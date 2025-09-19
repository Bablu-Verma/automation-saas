import { Response } from "express";
import axios, { AxiosError } from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";
import AutomationInstance from "../../../../models/AutomationInstance";
import SubscriptionModel from "../../../../models/SubscriptionModel";


export const createAutomationInstance = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { serviceId: masterWorkflowId, instanceName, userInputs, subscriptionId } = req.body;
    const userId = req.user?.id;

    if (!masterWorkflowId) {
      return res.status(400).json({ message: "Invalid serviceId.", success: false });
    }

    if (!instanceName) {
      return res.status(400).json({ message: "Add your automation name.", success: false });
    }

    if (!userInputs || typeof userInputs !== "object") {
      return res.status(400).json({ message: "Invalid userInputs provided.", success: false });
    }

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required.", success: false });
    }

    // ✅ Fetch master workflow
    const masterWorkflow = await MasterWorkflow.findById(masterWorkflowId);
    if (!masterWorkflow) {
      return res.status(404).json({ message: "Master workflow template not found.", success: false });
    }

    // ✅ Fetch subscription
    const subscription = await SubscriptionModel.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found.", success: false });
    }

    // ✅ Clone workflow JSON and replace placeholders
    let workflowString = JSON.stringify(masterWorkflow.workflowJsonTemplate);
    for (const key in userInputs) {
      const placeholder = `__${key.toUpperCase()}__`;
      workflowString = workflowString.replace(new RegExp(placeholder, "g"), userInputs[key]);
    }
    const newWorkflowJson = JSON.parse(workflowString);
    newWorkflowJson.name = `User_${userId}_${masterWorkflow.name}_${Date.now()}`;

    // ✅ Create workflow in n8n
    const n8nResponse = await axios.post(
      `${process.env.N8N_API_URL}/api/v1/workflows`,
      newWorkflowJson,
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );
    const newN8nWorkflowId = n8nResponse.data.id;

    // ✅ Activate workflow
    await axios.post(
      `${process.env.N8N_API_URL}/api/v1/workflows/${newN8nWorkflowId}/activate`,
      {},
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );

    // ✅ Save automation instance
    const automationInstance = new AutomationInstance({
      user: userId,
      masterWorkflow: masterWorkflowId,
      subscription: subscriptionId,
      n8nWorkflowId: newN8nWorkflowId,
      instanceName,
      isActive: "ACTIVE",
      userCredentials: [],
      executionCount: 0,
    });

    await automationInstance.save();

    return res.status(201).json({
      message: "Automation instance created successfully!",
      automation: automationInstance,
      success: true,
    });
  } catch (err) {
    const error = err as AxiosError;
    console.error("Error creating automation:", error.response?.data ?? error.message);
    return res.status(500).json({
      message: "Server error while creating automation.",
      success: false,
    });
  }
};
