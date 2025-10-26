import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/loginCheck";
import { getCredentialSchema } from "../../lib/_n8n_helper";

export const CredentialSchema = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can access.",
      });
    }

    const {
      credentialType,
    } = req.body;

  const schemaData = await getCredentialSchema(credentialType);

    return res.status(200).json({
      success: true,
      message: "schema fetched successfully.",
      schemaData
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching contacts.",
    });
  }
};