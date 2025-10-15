import { Response } from "express";
import axios, { AxiosError } from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";
import AutomationInstance from "../../../../models/AutomationInstance";
import User from "../../../../models/User";
import { getIndiaTimeFormatted } from "../../../../utils/dateformate";
import { buildCredentialData, getCredentialSchema, injectWorkflowCredentials, injectWorkflowInputs } from "../../../../lib/_n8n_helper";

// Helper function to get credential name safely
function getCredName(creds: unknown, fallback: string) {
  if (creds && typeof creds === 'object' && 'name' in creds) {
    return (creds as Record<string, any>).name || fallback;
  }
  return fallback;
}

// Main Controller to create an automation instance
export const createAutomationInstance = async (req: AuthenticatedRequest, res: Response) => {
  
  // --- Rollback Setup ---
  // Ek list jisme hum naye bane hue n8n credentials ki ID store karenge
  // Taaki error hone par inhe delete kar sakein
  const createdN8nCredentialIds: string[] = [];

  try {
    const { workflowId, instanceName, inputs, credentials } = req.body;
    const userId = req.user?.id;

    // 1. Basic Validations
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!workflowId) return res.status(400).json({ message: "Invalid workflowId.", success: false });
    if (!instanceName) return res.status(400).json({ message: "Instance name is required.", success: false });

    // 2. Fetch required data from DB
    const masterWorkflow = await MasterWorkflow.findById(workflowId);
    if (!masterWorkflow) return res.status(404).json({ message: "Master workflow not found.", success: false });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found.", success: false });

    const existingInstance = await AutomationInstance.findOne({ user: userId, masterWorkflow: workflowId });

    // 3. Prepare the workflow JSON
    let workflowJson = JSON.parse(JSON.stringify(masterWorkflow.workflowJsonTemplate));
    let workflowWithInputs = injectWorkflowInputs(workflowJson, masterWorkflow.requiredInputs, inputs);
    const credMap: Record<string, any> = {};

    // 4. Create or reuse n8n credentials
    for (const [service, creds] of Object.entries(credentials || {})) {
      const credentialsReadyToUse: Record<string, any> = {};
      for (const [key, value] of Object.entries(creds as Record<string, any>)) {
        if (typeof value === 'string' && value.startsWith('process.env.')) {
          // Be careful with this in production, consider an allow-list for security
          const envVarName = value.replace('process.env.', '');
          credentialsReadyToUse[key] = process.env[envVarName] ?? null;
        } else {
          credentialsReadyToUse[key] = value ?? null;
        }
      }

      let n8nCredentialId = (creds as any).n8nCredentialId;
      const credType = masterWorkflow.requiredCredentials?.find(c => c.service === service)?.credentialType || service;

      if (!n8nCredentialId) {
        // Credential exists nahi karta, toh naya banayenge
        const schemaData = await getCredentialSchema(credType);
        const _data_ = buildCredentialData(schemaData, credentialsReadyToUse);
        const credPayload = {
          name: `_${instanceName}_${user.email}_${Date.now()}_`,
          type: credType,
          data: _data_
        };

        const credRes = await axios.post(
          `${process.env.N8N_API_URL}/api/v1/credentials`,
          credPayload,
          { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
        );

        n8nCredentialId = credRes.data.id;
        credMap[service] = credRes.data;

        // ✅ IMPORTANT: Naye credential ki ID ko cleanup list mein daal denge
        createdN8nCredentialIds.push(n8nCredentialId);
      } else {
        // Credential pehle se hai, usko use karenge
        credMap[service] = { id: n8nCredentialId, name: getCredName(creds, service) || service };
      }
    }

    // 5. Inject credentials into the workflow JSON
    workflowWithInputs = injectWorkflowCredentials(workflowWithInputs, masterWorkflow.requiredCredentials, credMap);

    // 6. Create the workflow in n8n
    const { meta, versionId, id, tags, pinData, active, ...allowedWorkflow } = workflowWithInputs;
    const newWorkflowJson = {
      ...allowedWorkflow,
      name: `${instanceName} ${user.email} ${getIndiaTimeFormatted()}`,
    };

    const n8nResponse = await axios.post(
      `${process.env.N8N_API_URL}/api/v1/workflows`,
      newWorkflowJson,
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );

    const newN8nWorkflowId = n8nResponse.data.id;
    if (!newN8nWorkflowId) {
      throw new Error("n8n API did not return a workflow ID after creation.");
    }

    // 7. Save automation instance to our database (ONLY after all n8n steps are successful)
    const automationInstance = new AutomationInstance({
      user: userId,
      masterWorkflow: workflowId,
      n8nWorkflowId: newN8nWorkflowId,
      instanceName,
      isActive: "PAUSE",
      executionCount: 0,
    });

    if (!existingInstance) {
      automationInstance.systemStatus = "TRIAL";
      const trialDays = masterWorkflow.trialDays || 7;
      automationInstance.periods = {
        startTime: new Date(),
        endTime: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
      };
    } else {
      automationInstance.systemStatus = "NEED_PAYMENT";
    }

    await automationInstance.save();

    // 8. Send success response
    return res.status(201).json({ 
      message: "Automation instance created successfully!",
      automation: automationInstance,
      success: true,
    });

  } catch (err) {

    console.error("Error creating automation instance. Starting cleanup process...");

    // Cleanup: Delete any credentials that were created in n8n during this failed attempt
    if (createdN8nCredentialIds.length > 0) {
      console.log(`Attempting to delete ${createdN8nCredentialIds.length} orphaned n8n credentials...`);
      for (const credId of createdN8nCredentialIds) {
        try {
          await axios.delete(
            `${process.env.N8N_API_URL}/api/v1/credentials/${credId}`,
            { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
          );
          console.log(`Successfully deleted orphaned credential: ${credId}`);
        } catch (cleanupError) {
          // Agar delete karne mein bhi error aaye, to usko log karke aage badhenge
          console.error(`CRITICAL: Failed to delete orphaned credential ${credId}. Manual cleanup may be required.`, cleanupError);
        }
      }
    }


    const error = err as AxiosError;
    console.error("Original Error Details:", error.response?.data ?? error.message);
    
    return res.status(500).json({ 
      message: "Failed to create automation due to a server error. Any partial setup has been automatically rolled back. Please try again.", 
      success: false 
    });
  }
};