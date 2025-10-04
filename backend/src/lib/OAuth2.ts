// backend/googleAuth.ts
import express from "express";
import { google } from "googleapis";

const OAuthRouter = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const FRONTEND_ORIGIN = process.env.CLIENT_URL

// Step 1: Redirect user to Google consent screen
OAuthRouter.get("/oauth/google", (req, res) => {
  try {
    // 1️⃣ Frontend से scopes fetch करो
    const { scopes } = req.query;

    // 2️⃣ Scopes ko array me convert karo
    const scopeArray: string[] = scopes
      ? (scopes as string).split(" ").map((s) => s.trim()).filter(Boolean)
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
  } catch (error) {
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

    const { tokens } = await oauth2Client.getToken(code as string);

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
                accessToken: "${tokens.access_token}",
                refreshToken: "${tokens.refresh_token || ''}",
                clientSecret: "process.env.GOOGLE_CLIENT_SECRET",
                clientId: "process.env.GOOGLE_CLIENT_ID",
              },
             FRONTEND__ORIGIN
            );
            window.close();
          </script>
        
        </body>
      </html>
    `);
  } catch (error) {
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


export default OAuthRouter;
