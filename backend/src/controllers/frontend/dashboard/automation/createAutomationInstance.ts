import { Response } from "express";
import axios, { AxiosError } from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";
import AutomationInstance from "../../../../models/AutomationInstance";
import User from "../../../../models/User";
import { getIndiaTimeFormatted } from "../../../../utils/dateformate";
import { buildCredentialData, getCredentialSchema, injectWorkflowCredentials, injectWorkflowInputs } from "../../../../lib/_n8n_helper";


function getCredName(creds: unknown, fallback: string) {
  if (creds && typeof creds === 'object' && 'name' in creds) {
    return (creds as Record<string, any>).name || fallback;
  }
  return fallback;
}

export const createAutomationInstance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { workflowId, instanceName, inputs, credentials } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!workflowId) return res.status(400).json({ message: "Invalid workflowId.", success: false });
    if (!instanceName) return res.status(400).json({ message: "Instance name is required.", success: false });

    // Fetch master workflow
    const masterWorkflow = await MasterWorkflow.findById(workflowId);
    if (!masterWorkflow) return res.status(404).json({ message: "Master workflow not found.", success: false });

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found.", success: false });

    const existingInstance = await AutomationInstance.findOne({ user: userId, masterWorkflow: workflowId });

    // ------------------ Step 1: Clone workflow JSON ------------------
    let workflowJson = JSON.parse(JSON.stringify(masterWorkflow.workflowJsonTemplate));


    // ------------------ Step 2: Replace input placeholders ------------------
    let workflowWithInputs = injectWorkflowInputs(workflowJson, masterWorkflow.requiredInputs, inputs);

    const credMap: Record<string, any> = {};

    // Step 3: Create or reuse credentials
    for (const [service, creds] of Object.entries(credentials || {})) {

      const credentialsReadyToUse: Record<string, any> = {};

      for (const [key, value] of Object.entries(creds as Record<string, any>)) {
         
        if (typeof value === 'string' && value.startsWith('process.env.')) {
          
          const envVarName = value.replace('process.env.', '');
          const envValue = process.env[envVarName];
          if (envValue == null) {
           console.warn(`Warning: Environment variable ${envVarName} is not set for credential field ${key}`);
          }
          credentialsReadyToUse[key] = envValue ?? null;
        } else {
           
          credentialsReadyToUse[key] = value ?? null;
        }
      }

      // Check if creds already have n8nCredentialId
      let n8nCredentialId = (creds as any).n8nCredentialId;
      const credType = masterWorkflow.requiredCredentials?.find(c => c.service === service)?.credentialType || service;

      if (!n8nCredentialId) {

        // console.log('credType',credType)
        const schemaData = await getCredentialSchema(credType);

        // console.log('credentialsReadyToUse',credentialsReadyToUse)
        // console.log('schemaData',schemaData)
        const _data_ = buildCredentialData(schemaData, credentialsReadyToUse);

        // console.log('_data___', _data_)

        const credPayload = {
          name: `_${instanceName}_${user.email}_${Date.now()}_`,
          type: credType,
          data: _data_
        };


        // console.log("credPayload", credPayload)

        const credRes = await axios.post(
          `${process.env.N8N_API_URL}/api/v1/credentials`,
          credPayload,
          { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
        );

        n8nCredentialId = credRes.data.id;
        credMap[service] = credRes.data;
      } else {
        credMap[service] = { id: n8nCredentialId, name: getCredName(creds, service) || service };
      }
    }

    // Step 4: Inject credentials into workflow
    workflowWithInputs = injectWorkflowCredentials(workflowWithInputs, masterWorkflow.requiredCredentials, credMap);


    // ------------------ Step 4: Post workflow to n8n ------------------
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

    // ------------------ Step 5: Save automation instance ------------------
    const automationInstance = new AutomationInstance({
      user: userId,
      masterWorkflow: workflowId,
      n8nWorkflowId: newN8nWorkflowId,
      instanceName,
      isActive: "PAUSE",
      inputs,
      userCredentials: [],
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
      automationInstance.systemStatus = "PAID_PENDING";
    }

    await automationInstance.save();

    return res.status(200).json({
      message: "Automation instance created successfully!",
      automation: automationInstance,
      success: true,
    });

  } catch (err) {
    const error = err as AxiosError;
    console.error("Error creating automation:", error.response?.data ?? error.message);
    return res.status(500).json({ message: "Server error while creating automation.", success: false });
  }
};


