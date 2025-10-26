import axios from "axios";
import { IRequiredInput } from "../types/types";

let cachedSchemas: Record<string, any> = {};

export async function getCredentialSchema(credentialType: string) {
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



export function injectWorkflowInputs(workflowJson: any, requiredInputs :IRequiredInput[], inputs: any[]) {
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


export function injectWorkflowCredentials(
  workflowJson: any,
  requiredCredentials: any[],
  credMap: Record<string, any>
) {
  const workflowCopy = JSON.parse(JSON.stringify(workflowJson));

  for (const credDef of requiredCredentials) {
    const credRes = credMap[credDef.service];
    if (!credRes) continue;

    for (const injection of credDef.inject || []) {
      const node = workflowCopy.nodes.find((n: any) => n.name === injection.node);
      if (!node) continue;

      const pathParts = injection.field.split('.');
      let target = node;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!target[pathParts[i]]) target[pathParts[i]] = {};
        target = target[pathParts[i]];
      }
      target[pathParts[pathParts.length - 1]] = {
        id: credRes.id,
        name: credRes.name,
      };
      
    }
  }

  return workflowCopy;
}


 export function removeWebhookIds(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeWebhookIds);
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key !== 'webhookId') {
        newObj[key] = removeWebhookIds(value);
      }
    }
    return newObj;
  } else {
    return obj; 
  }
}


export function getCredName(creds: unknown, fallback: string) {
  if (creds && typeof creds === "object" && "name" in creds) {
    return (creds as Record<string, any>).name || fallback;
  }
  return fallback;
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





