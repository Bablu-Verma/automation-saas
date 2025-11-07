"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCredentialSchema = getCredentialSchema;
exports.injectWorkflowInputs = injectWorkflowInputs;
exports.injectWorkflowCredentials = injectWorkflowCredentials;
exports.removeWebhookIds = removeWebhookIds;
exports.getCredName = getCredName;
exports.toggleN8nWorkflow = toggleN8nWorkflow;
exports.extractTriggersFromNodes = extractTriggersFromNodes;
const axios_1 = __importDefault(require("axios"));
let cachedSchemas = {};
async function getCredentialSchema(credentialType) {
    // Return cached schema if already fetched
    if (cachedSchemas[credentialType])
        return cachedSchemas[credentialType];
    // Otherwise, fetch from n8n API
    const res = await axios_1.default.get(`${process.env.N8N_API_URL}/api/v1/credentials/schema/${credentialType}`, { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } });
    return res.data.properties;
}
function removeCachedResultUrl(obj) {
    if (!obj || typeof obj !== "object")
        return;
    for (const key in obj) {
        if (key === "cachedResultUrl") {
            delete obj[key];
        }
        else if (typeof obj[key] === "object") {
            removeCachedResultUrl(obj[key]);
        }
    }
}
function injectWorkflowInputs(workflowJson, requiredInputs, inputs) {
    const workflowCopy = JSON.parse(JSON.stringify(workflowJson)); // deep clone to avoid mutation
    // Loop over each required input
    for (const inputDef of requiredInputs) {
        const inputValueObj = inputs.find(i => i.key === inputDef.key);
        if (!inputValueObj)
            continue; // skip if input not provided
        const value = inputValueObj.value;
        // Loop over nodes/fields where this input should be injected
        for (const injection of inputDef.inject || []) {
            const node = workflowCopy.nodes.find((n) => n.name === injection.node);
            if (!node)
                continue;
            removeCachedResultUrl(node);
            // Navigate to the nested field using dot notation
            const pathParts = injection.field.split('.');
            let target = node;
            for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                if (!target[part])
                    target[part] = {};
                target = target[part];
            }
            target[pathParts[pathParts.length - 1]] = value;
        }
    }
    return workflowCopy;
}
function injectWorkflowCredentials(workflowJson, requiredCredentials, credMap) {
    const workflowCopy = JSON.parse(JSON.stringify(workflowJson));
    for (const credDef of requiredCredentials) {
        const credRes = credMap[credDef.service];
        if (!credRes)
            continue;
        for (const injection of credDef.inject || []) {
            const node = workflowCopy.nodes.find((n) => n.name === injection.node);
            if (!node)
                continue;
            const pathParts = injection.field.split('.');
            let target = node;
            for (let i = 0; i < pathParts.length - 1; i++) {
                if (!target[pathParts[i]])
                    target[pathParts[i]] = {};
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
function removeWebhookIds(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeWebhookIds);
    }
    else if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(obj)) {
            if (key !== 'webhookId') {
                newObj[key] = removeWebhookIds(value);
            }
        }
        return newObj;
    }
    else {
        return obj;
    }
}
function getCredName(creds, fallback) {
    if (creds && typeof creds === "object" && "name" in creds) {
        return creds.name || fallback;
    }
    return fallback;
}
async function toggleN8nWorkflow(workflowId, activate = false) {
    if (!workflowId)
        return;
    // Choose the correct endpoint based on the desired action
    const endpoint = activate ? 'activate' : 'deactivate';
    try {
        await axios_1.default.post(// Use POST method for activation/deactivation
        `${process.env.N8N_API_URL}/api/v1/workflows/${workflowId}/${endpoint}`, {}, { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } });
        console.log(`Workflow ${workflowId} ${activate ? "ACTIVATED" : "DEACTIVATED"}`);
        return true;
    }
    catch (err) {
        console.error(`Failed to update n8n workflow ${workflowId}:`, err.response?.data || err.message);
        return false;
    }
}
// ✅ Helper function to extract triggers from nodes array
function extractTriggersFromNodes(nodes) {
    if (!nodes || !Array.isArray(nodes))
        return [];
    const triggerNodes = nodes.filter((node) => node?.type && (node.type.includes("Trigger") ||
        node.type === "n8n-nodes-base.webhook" ||
        node.type === "n8n-nodes-base.start"));
    const triggers = [];
    console.log("triggerNodes", triggerNodes);
    for (const triggerNode of triggerNodes) {
        let webhookId = triggerNode.webhookId ||
            triggerNode.parameters?.webhookPath ||
            triggerNode.parameters?.path;
        let triggerType = triggerNode.type.split('.').pop();
        triggers.push(`${triggerType}:${webhookId}`);
    }
    return triggers;
}
