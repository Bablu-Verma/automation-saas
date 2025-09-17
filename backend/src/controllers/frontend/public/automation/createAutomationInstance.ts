

import { Response } from "express";

import axios, { AxiosError } from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";
import User from "../../../../models/User";
import { Automation } from "../../../../types/types";



export const createAutomationInstance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Step 1: Extract data
    const { serviceId : masterWorkflowId, instanceName, userInputs } = req.body;


     if (!masterWorkflowId) {
      return res.status(400).json({ message: "Invalid serviceId.", success: false });
     }

       if (!instanceName) {
      return res.status(400).json({ message: "Add Your automation Name.", success: false });
     }

     if (!userInputs || typeof userInputs !== "object") {
      return res.status(400).json({ message: "Invalid userInputs provided." ,success: false});
    }


    const userId = req.user?.id;

    // Step 2: Fetch master workflow
    const masterWorkflow = await MasterWorkflow.findById(masterWorkflowId);
    if (!masterWorkflow) {
      return res.status(404).json({ message: "Master workflow template not found.",success: false });
    }

    // Step 3: Clone & replace placeholders
    let workflowString = JSON.stringify(masterWorkflow.workflowJsonTemplate);

    for (const key in userInputs) {
      const placeholder = `__${key.toUpperCase()}__`;
      workflowString = workflowString.replace(new RegExp(placeholder, "g"), userInputs[key]);
    }

    const newWorkflowJson = JSON.parse(workflowString);
    newWorkflowJson.name = `User_${userId}_${masterWorkflow.name}_${Date.now()}`;

    // Step 4: Create workflow in n8n
    const n8nResponse = await axios.post(
      `${process.env.N8N_API_URL}/api/v1/workflows`,
      newWorkflowJson,
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );

    const newN8nWorkflowId = n8nResponse.data.id;

    // Activate workflow
    await axios.post(
      `${process.env.N8N_API_URL}/api/v1/workflows/${newN8nWorkflowId}/activate`,
      {},
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );

    // Step 5: Save automation in user doc
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const newAutomation: Automation = {
      masterWorkflow: masterWorkflowId,
      workflowId: newN8nWorkflowId,
      name: instanceName,
      credentials: {},
      executionCount: 0, 
      subscription: {
        plan: "pro",
        status: "active",
        startDate: new Date(),
      },
    };

    user.automations.push(newAutomation);
    await user.save();

    return res.status(201).json({
      message: "Automation instance created successfully!",
      automation: newAutomation,
      success: true
    });
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      "Error creating automation:",
      error.response?.data ?? error.message
    );
    return res.status(500).json({ message: "Server error while creating automation.",success: false });
  }
};
