import { Response } from "express";
import axios, { AxiosError } from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";
import AutomationInstance from "../../../../models/AutomationInstance";
import User from "../../../../models/User";
import { getIndiaTimeFormatted } from "../../../../utils/dateformate";
import {
  extractTriggersFromNodes,
  getCredName,
  injectWorkflowCredentials,
  injectWorkflowInputs,
  removeWebhookIds,
} from "../../../../lib/_n8n_helper";
import slug from "slug";
import { automation_create_success_email } from "../../../../email/automation_create_success_email";
import util from 'util';
import { autoSaveN8nWorkflow } from "../../../../lib/puppeteer_code_save_workflow";


// Helper function to safely get credential name

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


// Main controller
export const createAutomationInstance = async (req: AuthenticatedRequest, res: Response) => {
  const createdN8nCredentialIds: string[] = [];
  let createdN8nWorkflowId: string | null = null;






  try {
    const { workflowId, instanceName, inputs, credentials } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!workflowId) return res.status(400).json({ message: "Invalid workflowId.", success: false });
    if (!instanceName) return res.status(400).json({ message: "Instance name is required.", success: false });

    const instance_name_slug = slug(instanceName, '_');

    const masterWorkflow = await MasterWorkflow.findById(workflowId);
    if (!masterWorkflow) return res.status(404).json({ message: "Master workflow not found.", success: false });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found.", success: false });

    const existingInstance = await AutomationInstance.findOne({ user: userId, masterWorkflow: workflowId });

    // Clone workflow
    let workflowJson = JSON.parse(JSON.stringify(masterWorkflow.workflowJsonTemplate));
    workflowJson = removeWebhookIds(workflowJson);

    // Inject inputs
    let workflowWithInputs = injectWorkflowInputs(workflowJson, masterWorkflow.requiredInputs || [], inputs);

    // Handle credentials
    const credMap: Record<string, any> = {};
    for (const [service, creds] of Object.entries(credentials || {})) {
      const credentialsReadyToUse: Record<string, any> = {};

      for (const [key, value] of Object.entries(creds as Record<string, any>)) {
        let resolvedValue = value;

        // 🔹 1️⃣ Replace env vars (e.g., GOOGLE_CLIENT_ID → actual value)
        if (typeof value === "string" && /^[A-Z0-9_]+$/.test(value)) {
          if (process.env[value] !== undefined) {
            resolvedValue = process.env[value];
          }
        }

        // 🔹 2️⃣ Convert common string types → native types
        if (typeof resolvedValue === "string") {
          const trimmed = resolvedValue.trim().toLowerCase();

          // ✅ Convert "true" / "false" to booleans
          if (trimmed === "true") {
            resolvedValue = true;
          } else if (trimmed === "false") {
            resolvedValue = false;
          } else {
            // ✅ Try parsing JSON (for JSON objects or arrays)
            try {
              const parsed = JSON.parse(resolvedValue);
              if (typeof parsed === "object" && parsed !== null) {
                resolvedValue = parsed;
              }
            } catch {
              // ignore parsing errors, keep as string
            }
          }
        }

        credentialsReadyToUse[key] = resolvedValue;
      }


      let n8nCredentialId = (creds as any).n8nCredentialId;
      const credType = masterWorkflow.requiredCredentials?.find(c => c.service === service)?.credentialType || service;

      if (!n8nCredentialId) {

        const credPayload = {
          name: `${instance_name_slug}_${user.email}_${service}_${Date.now()}`,
          type: credType,
          data: credentialsReadyToUse
        };

        // console.log("credPayload", JSON.stringify(credPayload, null, 2));

        const credRes = await axios.post(`${process.env.N8N_API_URL}/api/v1/credentials`, credPayload, {
          headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
        });

        n8nCredentialId = credRes.data.id;
        credMap[service] = credRes.data;
        createdN8nCredentialIds.push(n8nCredentialId);

      } else {
        credMap[service] = { id: n8nCredentialId, name: getCredName(creds, service) || service };

      }
    }

    workflowWithInputs = injectWorkflowCredentials(workflowWithInputs, masterWorkflow.requiredCredentials || [], credMap);

    const { meta, versionId, id, tags, pinData, active, ...allowedWorkflow } = workflowWithInputs;

    const uniqueName = `${instance_name_slug}_${user.email}_${getIndiaTimeFormatted()}`;

    const newWorkflowJson = {
      ...allowedWorkflow,
      name: uniqueName,
    };

    const n8nResponse = await axios.post(`${process.env.N8N_API_URL}/api/v1/workflows`, newWorkflowJson, {
      headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
      timeout: 30000
    });

    createdN8nWorkflowId = n8nResponse.data.id;

    if (!createdN8nWorkflowId) throw new Error("n8n API did not return a workflow ID.");


    await autoSaveN8nWorkflow(createdN8nWorkflowId)

    const n8nGetJson = await axios.get(
      `${process.env.N8N_API_URL}/api/v1/workflows/${createdN8nWorkflowId}`,
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );

    // console.log(
    //   "🧠 Full Workflow Data ==>",
    //   util.inspect(n8nGetJson.data, { showHidden: false, depth: null, colors: true })
    // );

    await wait(1500);

    const triggers = extractTriggersFromNodes(n8nGetJson.data.nodes);
    // console.log("🚀 Extracted triggers:", triggers);

    // Save automation instance
    const automationInstance = new AutomationInstance({
      user: userId,
      masterWorkflow: workflowId,
      n8nWorkflowId: createdN8nWorkflowId,
      instanceName: instance_name_slug,
      isActive: "PAUSE",
      executionCount: 0,
      userCredentialsId: createdN8nCredentialIds,
      trigger: triggers,
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

    await automation_create_success_email(user.email, user.name, instance_name_slug)

    return res.status(201).json({
      message: "Automation instance created successfully!",
      automation: automationInstance,
      success: true
    });



  } catch (err) {
    console.error("Error creating automation instance. Starting cleanup process...");

    if (createdN8nCredentialIds.length > 0) {
      for (const credId of createdN8nCredentialIds) {
        try {
          await axios.delete(`${process.env.N8N_API_URL}/api/v1/credentials/${credId}`, {
            headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
          });
        } catch (cleanupErr) {
          console.error(`Failed to delete orphaned credential ${credId}:`, cleanupErr);
        }
      }
    }

    if (createdN8nWorkflowId) {
      try {
        await axios.delete(`${process.env.N8N_API_URL}/api/v1/workflows/${createdN8nWorkflowId}`, {
          headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
        });
      } catch (cleanupErr) {
        console.error(`Failed to delete partially created workflow ${createdN8nWorkflowId}:`, cleanupErr);
      }
    }

    const error = err as AxiosError;
    console.error("Original Error Details:", error.response ? error.response.data : error.response);

    return res.status(500).json({
      message:
        "Failed to create automation due to a server error. Any partial setup has been automatically rolled back. Please try again.",
      success: false,
    });
  }
};
