import axios from "axios";

let cachedSchemas: Record<string, any> = {};
 
export  async function getCredentialSchema(credentialType: string) {
  // Return cached schema if already fetched
  if (cachedSchemas[credentialType]) return cachedSchemas[credentialType];

  // Otherwise, fetch from n8n API
  const res = await axios.get(
    `${process.env.N8N_API_URL}/api/v1/credentials/schema/${credentialType}`,
    { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
  );


  return res.data.properties
}


type SchemaField = {
  type: 'string' | 'boolean' | 'json' | 'notice';
  required?: boolean;
};

type SchemaData = Record<string, SchemaField>;

type CredentialsReadyToUse = {
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiryDate?: string | number | null;
  [key: string]: any; // fallback for other dynamic fields
};

export function buildCredentialData(
  schemaData: SchemaData,
  credentialsReadyToUse: CredentialsReadyToUse
): Record<string, any> {
  const data: Record<string, any> = {};
  const now = Date.now();
  const fiftyMinutesInMs = 50 * 60 * 1000;

  // Check if credentialsReadyToUse has any meaningful data
  const hasMeaningfulCredentials = Object.values(credentialsReadyToUse).some(value => 
    value !== undefined && value !== "" && value !== null
  );

  for (const [field, schema] of Object.entries(schemaData)) {
    // Special case: oauthTokenData
    if (field === "oauthTokenData" && schema.type === "json") {
      const accessToken = credentialsReadyToUse.accessToken || "";
      const refreshToken = credentialsReadyToUse.refreshToken || "";
      
      // Only create oauthTokenData if we have at least one token
      if (accessToken || refreshToken) {
        const tokenType = credentialsReadyToUse.tokenType || "Bearer";
        const expiryDate = credentialsReadyToUse.expiryDate || now + fiftyMinutesInMs;

        data[field] = {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: tokenType,
          expiry_date: expiryDate,
        };
      } else if (schema.required) {
        // If required but no tokens, create empty structure
        data[field] = {
          access_token: "",
          refresh_token: "",
          token_type: "Bearer",
          expiry_date: now + fiftyMinutesInMs,
        };
      }
      // If optional and no tokens, skip this field
      continue;
    }

    // For other fields, only include if we have meaningful credentials
    // OR if the field is required
    if (hasMeaningfulCredentials) {
      // If we have meaningful data, use the existing logic
      if (credentialsReadyToUse[field] !== undefined && credentialsReadyToUse[field] !== "") {
        data[field] = credentialsReadyToUse[field];
        continue;
      }
    } else {
      // If no meaningful credentials, only include required fields with defaults
      if (schema.required) {
        switch (schema.type) {
          case "string":
            data[field] = "";
            break;
          case "boolean":
            data[field] = false;
            break;
          case "json":
            data[field] = {};
            break;
          case "notice":
            data[field] = null;
            break;
          default:
            data[field] = null;
        }
      }
      // Skip optional fields when no meaningful credentials
      continue;
    }

    // Required field check (only reached when hasMeaningfulCredentials is true)
    if (schema.required) {
      switch (schema.type) {
        case "string":
          data[field] = "";
          break;
        case "boolean":
          data[field] = false;
          break;
        case "json":
          data[field] = {};
          break;
        case "notice":
          data[field] = null;
          break;
        default:
          data[field] = null;
      }
      continue;
    }

    // Optional fields: only include if we have meaningful credentials
    if (hasMeaningfulCredentials) {
      switch (schema.type) {
        case "string":
          data[field] = "";
          break;
        case "boolean":
          data[field] = false;
          break;
        case "json":
          data[field] = {};
          break;
        case "notice":
          data[field] = null;
          break;
        default:
          data[field] = null;
      }
    }
    // If no meaningful credentials and field is optional, it won't be included
  }

  return data;
}




export function injectWorkflowInputs(workflowJson: any, requiredInputs: any[], inputs: any[]) {
  const workflowCopy = JSON.parse(JSON.stringify(workflowJson)); // deep clone to avoid mutation

  // Loop over each required input
  for (const inputDef of requiredInputs) {
    const inputValueObj = inputs.find(i => i.key === inputDef.key);
    if (!inputValueObj) continue; // skip if input not provided

    const value = inputValueObj.value;

    // Loop over nodes/fields where this input should be injected
    for (const injection of inputDef.inject || []) {
      const node = workflowCopy.nodes.find((n: any) => n.name === injection.node);
      if (!node) continue;

      // Navigate to the nested field using dot notation
      const pathParts = injection.field.split('.');
      let target = node;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!target[part]) target[part] = {};
        target = target[part];
      }
      target[pathParts[pathParts.length - 1]] = value;
    }
  }

  return workflowCopy;
}


export function injectWorkflowCredentials(workflowJson: any, requiredCredentials: any[], credMap: Record<string, any>) {
  const workflowCopy = JSON.parse(JSON.stringify(workflowJson)); // deep clone

  for (const credDef of requiredCredentials) {
    const credRes = credMap[credDef.service];
    if (!credRes) continue; // skip if no credentials for this service

    for (const injection of credDef.inject || []) {
      const node = workflowCopy.nodes.find((n: any) => n.name === injection.node);
      if (!node) continue;

      // Navigate nested field using dot notation
      const pathParts = injection.field.split('.');
      let target = node;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!target[part]) target[part] = {};
        target = target[part];
      }

      // Inject credential reference (n8n expects { id: 'credentialId', name: 'credentialName' })
      target[pathParts[pathParts.length - 1]] = {
        id: credRes.id,
        name: credRes.name,
      };
    }
  }

  return workflowCopy;
}


export async function toggleN8nWorkflow(workflowId?: string, activate: boolean = false) {
  if (!workflowId) return;

  // Choose the correct endpoint based on the desired action
  const endpoint = activate ? 'activate' : 'deactivate';

  try {
    await axios.post( // Use POST method for activation/deactivation
      `${process.env.N8N_API_URL}/api/v1/workflows/${workflowId}/${endpoint}`,
      {},
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );
    console.log(`Workflow ${workflowId} ${activate ? "ACTIVATED" : "DEACTIVATED"}`);
    return true;
  } catch (err: any) {
    console.error(
      `Failed to update n8n workflow ${workflowId}:`,
      err.response?.data || err.message
    );
    return false;
  }
}





