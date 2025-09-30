import { Response } from "express";
import axios from "axios";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import InstanceValue from "../../../../models/InstanceValue";

export const createN8nCredential = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { serviceId, userInputs, userKeys, userCredentials } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const createdCreds: any[] = [];

    // 🔹 Step 1: userKeys ko N8N credentials me convert karo
    for (const keyObj of userKeys || []) {
      const payload = {
        name: `${keyObj.key}_${req.user?.email}_${Date.now()}`,
        type: "telegramApi", // ⚡ yaha aapko apne use-case ke hisaab se type select karna hoga
        data: {
          accessToken: keyObj.value   // ✅ yaha "token" nahi chalega
        },
      };

      const credRes = await axios.post(
        `${process.env.N8N_API_URL}/api/v1/credentials`,
        payload,
        { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
      );

      createdCreds.push({
        cradentialName: keyObj.key,
        credentialId: credRes.data.id,
      });
    }

    try {
    const { data } = await axios.get(`${process.env.N8N_API_URL}/rest/credentials/schema`, {
      headers: {
        "X-N8N-API-KEY": process.env.N8N_API_KEY,
      },
    });

    console.log("All Credential Schemas:", data);
  } catch (err:any) {
    console.error("Error:", err.response?.data || err.message);
  }



    // 🔹 Step 2: userCredentials ko bhi N8N me create karo
    for (const cred of userCredentials || []) {
      const payload = {
        name: `${cred.serviceName}_${Date.now()}`,
        type: cred.credentialType || "apiToken",
        data: cred.data || {},
      };

      const credRes = await axios.post(
        `${process.env.N8N_API_URL}/api/v1/credentials`,
        payload,
        { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
      );

      createdCreds.push({
        cradentialName: cred.serviceName,
        credentialId: credRes.data.id,
      });
    }

    // 🔹 Step 3: MongoDB me save karo
    const instance = new InstanceValue({
      user: userId,
      masterWorkflow: serviceId,
      userInputs,
      n8nCredential: createdCreds,
    });

    await instance.save();

    return res.status(201).json({
      message: "InstanceValue created successfully!",
      instance,
      success: true,
    });

  } catch (err: any) {
    console.error("Error creating InstanceValue:", err.response?.data || err.message);
    return res.status(500).json({ message: "Error creating InstanceValue", success: false });
  }
};
