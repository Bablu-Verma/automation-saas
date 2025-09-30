import { Response } from "express";
import axios, { AxiosError } from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";
import AutomationInstance from "../../../../models/AutomationInstance";
import User from "../../../../models/User";
import { getIndiaTimeFormatted } from "../../../../utils/dateformate";

// Helper: inject value at nested field
// function injectValue(node: any, fieldPath: string, value: any) {
//   const parts = fieldPath.split(".");
//   let obj = node;
//   for (let i = 0; i < parts.length - 1; i++) {
//     obj = obj[parts[i]];
//     if (!obj) return; // field not found
//   }
//   obj[parts[parts.length - 1]] = value;
// }

export const createAutomationInstance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      serviceId: masterWorkflowId,
      instanceName,
      userInputs,
      userKeys,
      userCredentials,
    } = req.body;

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!masterWorkflowId) return res.status(400).json({ message: "Invalid serviceId.", success: false });
    if (!instanceName) return res.status(400).json({ message: "Add your automation name.", success: false });

    // Fetch master workflow
    const masterWorkflow = await MasterWorkflow.findById(masterWorkflowId);
    if (!masterWorkflow) return res.status(404).json({ message: "Master workflow template not found.", success: false });

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const existingInstance = await AutomationInstance.findOne({ user: userId, masterWorkflow: masterWorkflowId })

    // ------------------ Validation ------------------
    for (const inputDef of masterWorkflow.requiredInputs || []) {
      if (!inputDef.key) continue;
      const provided = (userInputs || []).find((i: any) => i.key === inputDef.key);
      if (!provided?.value) {
        return res.status(400).json({ message: `Missing required input: ${inputDef.label}`, success: false });
      }
    }



    for (const credDef of masterWorkflow.requiredCredentials || []) {
      if (!credDef.service) continue;
      const provided = (userCredentials || []).find((c: any) => c.serviceName === credDef.service);
      if (!provided?.n8nCredentialId) {
        return res.status(400).json({ message: `Missing required credential: ${credDef.label}`, success: false });
      }
    }

    // ------------------ Step 1: Clone Workflow ------------------
    let workflowJson = JSON.parse(JSON.stringify(masterWorkflow.workflowJsonTemplate));

    // ------------------ Step 2: Replace Inputs ------------------
    // let workflowString = JSON.stringify(workflowJson);
    // for (const input of userInputs || []) {
    //   const placeholder = `__${input.key.toUpperCase()}__`;
    //   workflowString = workflowString.replace(new RegExp(placeholder, "g"), input.value);
    // }
    // workflowJson = JSON.parse(workflowString);

    // ------------------ Step 3: Handle Keys ------------------
    // for (const keyDef of masterWorkflow.requiredKey || []) {
    //   if (!keyDef.key || !keyDef.inject) continue;

    //   const userKey = (userKeys || []).find((k: any) => k.key === keyDef.key);
    //   if (!userKey) continue;

    //   // Agar n8nCredentialId nahi diya to create
    //   if (!userKey.n8nCredentialId) {
    //     const credPayload = {
    //       name: `${keyDef.key}_${user.email}_${Date.now()}`,
    //       type: keyDef.inject.field.split(".").pop() || keyDef.key, // type guess
    //       data: { token: userKey.value },
    //     };

    //     const credRes = await axios.post(
    //       `${process.env.N8N_API_URL}/api/v1/credentials`,
    //       credPayload,
    //       { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    //     );

    //     userKey.n8nCredentialId = credRes.data.id;
    //   }

    //   // Inject into node
    //   for (const node of workflowJson.nodes || []) {
    //     if (node.name === keyDef.inject.node) {
    //       injectValue(node, keyDef.inject.field, {
    //         id: userKey.n8nCredentialId,
    //         name: userKey.name || keyDef.key,
    //       });
    //     }
    //   }
    // }

    // // ------------------ Step 4: Inject Credentials ------------------
    // for (const credDef of masterWorkflow.requiredCredentials || []) {
    //   if (!credDef.service || !credDef.inject) continue;

    //   const userCred = (userCredentials || []).find((c: any) => c.serviceName === credDef.service);
    //   if (!userCred) continue;

    //   for (const node of workflowJson.nodes || []) {
    //     if (node.name === credDef.inject.node) {
    //       injectValue(node, credDef.inject.field, {
    //         id: userCred.n8nCredentialId,
    //         name: userCred.name || credDef.service,
    //       });
    //     }
    //   }
    // }

    // ------------------ Step 5: Clean Workflow ------------------
    const { meta, versionId, id, tags, pinData, active, ...allowedWorkflow } = workflowJson;
    const newWorkflowJson = {
      ...allowedWorkflow,
      name: `${instanceName} ${user.email} ${getIndiaTimeFormatted()}`,
    };

    // ------------------ Step 6: POST to n8n ------------------
    const n8nResponse = await axios.post(
      `${process.env.N8N_API_URL}/api/v1/workflows`,
      newWorkflowJson,
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );
    const newN8nWorkflowId = n8nResponse.data.id;

    // ------------------ Step 7: Save Instance ------------------
    const automationInstance = new AutomationInstance({
      user: userId,
      masterWorkflow: masterWorkflowId,
      n8nWorkflowId: newN8nWorkflowId,
      instanceName,
      isActive: "PAUSE",
      userInputs,
      userKeys,
      userCredentials,
      executionCount: 0,
    });

    if (!existingInstance) {
      // First instance → Trial
      automationInstance.systemStatus = 'TRIAL';
      const trialDays = masterWorkflow.trialDays || 7;
      automationInstance.periods = {
        startTime: new Date(),
        endTime: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
      };
    } else {
      automationInstance.systemStatus = "PAID_PENDING";
    }

    await automationInstance.save();

    return res.status(201).json({
      message: "Instance created successfully!",
      automation: automationInstance,
      success: true,
    });

  } catch (err) {
    const error = err as AxiosError;
    console.error("Error creating automation:", error.response?.data ?? error.message);
    return res.status(500).json({ message: "Server error while creating automation.", success: false });
  }
};





