"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/cron/cron.ts
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
(async () => {
    console.log("[CRON] Automation cron initialized...");
    const API_URL = "https://loopaxis.server.babluverma.site/api/admin/automation/automateupdate";
    node_cron_1.default.schedule("0 2 * * *", // every day at 2 AM
    async () => {
        console.log(`[CRON] Running daily automation job at 2 AM (${new Date().toLocaleString("en-IN")})`);
        try {
            const response = await axios_1.default.post(API_URL, {});
            console.log("[CRON] ✅ API success:", response.status, response.data);
        }
        catch (error) {
            console.error("[CRON] ❌ API error:", error.message);
        }
    }, {
        timezone: "Asia/Kolkata",
    });
})();
