"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/googleAuth.ts
const express_1 = __importDefault(require("express"));
const googleapis_1 = require("googleapis");
const OAuthRouter = express_1.default.Router();
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);
const FRONTEND_ORIGIN = process.env.CLIENT_URL;
// Step 1: Redirect user to Google consent screen
OAuthRouter.get("/oauth/google", (req, res) => {
    try {
        // 1️⃣ Frontend से scopes fetch करो
        const { scopes } = req.query;
        // 2️⃣ Scopes ko array me convert karo
        const scopeArray = scopes
            ? scopes.split(" ").map((s) => s.trim()).filter(Boolean)
            : [
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/drive.readonly",
            ];
        // 3️⃣ Generate Google OAuth URL
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: scopeArray,
        });
        // console.log(url)
        return res.status(200).json({
            success: true,
            message: "Google OAuth URL generated successfully.",
            url,
        });
    }
    catch (error) {
        console.error("Error generating Google OAuth URL:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate Google OAuth URL.",
        });
    }
});
OAuthRouter.get("/oauth/google/callback", async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.send(`
        <html>
          <body>
            <h2>Authorization code is missing</h2>
            <button onclick="window.close()">Close Window</button>
          </body>
        </html>
      `);
        }
        const { tokens } = await oauth2Client.getToken(code);
        const oauthTokenData = JSON.stringify({
            access_token: tokens.access_token || "",
            refresh_token: tokens.refresh_token || "",
            scope: tokens.scope || "",
            token_type: tokens.token_type || "Bearer",
            expiry_date: tokens.expiry_date || Date.now() + 3600000,
            id_token: tokens.id_token || ""
        });
        return res.send(`
      <html>
        <body>
          <h2>Google OAuth completed successfully!</h2>
          <p>You can close this window now.</p>
           <script>
            const FRONTEND__ORIGIN = "${FRONTEND_ORIGIN}";
            
            window.opener.postMessage(
              {
                success: true,
                oauthTokenData: ${JSON.stringify(oauthTokenData)}
              },
             FRONTEND__ORIGIN
            );
            window.close();
          </script>
        
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Error during Google OAuth callback:", error);
        return res.send(`
      <html>
        <body>
          <h2>Failed to complete Google OAuth.</h2>
          <p>Please try again.</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
    }
});
exports.default = OAuthRouter;
