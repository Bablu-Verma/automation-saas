// src/cron/cron.ts
import cron from "node-cron";
import axios from "axios";



(async () => {
  console.log("[CRON] Automation cron initialized...");

  const API_URL = "https://loopaxis.server.babluverma.site/api/admin/automation/automateupdate";


  cron.schedule(
     "0 2,14 * * *",
    async () => {
      console.log(`[CRON] Running daily automation job at 2 AM (${new Date().toLocaleString("en-IN")})`);

      try {
        const response = await axios.post(API_URL, {});

        console.log("[CRON] ✅ API success:", response.status, response.data);
      } catch (error: any) {
        console.error("[CRON] ❌ API error:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
})();
