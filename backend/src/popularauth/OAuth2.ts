import { google } from "googleapis";
import { Request, Response } from "express";

let OAuthSessions: Record<string, any> = {};

export const OAuthScopes = async (req: Request, res: Response) => {
  try {
    const { clientId, clientSecret, scopes } = req.body;


    if (!clientId || !clientSecret) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (clientId, clientSecret)",
      });
    }


    if (!Array.isArray(scopes)) {
      return res.status(400).json({
        success: false,
        message: "Scopes must be an array.",
      });
    }

    if (scopes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Scopes array cannot be empty.",
      });
    }

    const validScopes = scopes.filter(
      (s) => typeof s === "string" && s.trim().length > 0
    );

    if (validScopes.length !== scopes.length) {
      return res.status(400).json({
        success: false,
        message: "Scopes must contain valid non-empty strings.",
      });
    }

    const uniqueScopes = [...new Set(validScopes)];

    const sessionId = Date.now().toString();

    const redirectUri = process.env.GOOGLE_CALLBACK_URL

    OAuthSessions[sessionId] = {
      clientId,
      clientSecret,
      redirectUri,
      scopes: uniqueScopes,
      origin: process.env.CLIENT_URL
    };

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );


    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: uniqueScopes,
      state: sessionId,
    });

    return res.status(200).json({
      success: true,
      url: authUrl,
    });
  } catch (error) {
    console.error("Error generating OAuth URL:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate OAuth URL",
    });
  }
};


export const OAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.send("<h2>Missing authorization code or state.</h2>");
    }

    const session = OAuthSessions[state as string];
    if (!session) {
      return res.send("<h2>Invalid or expired OAuth session.</h2>");
    }

    const oauth2Client = new google.auth.OAuth2(
      session.clientId,
      session.clientSecret,
      session.redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code as string);

    const create_responce = {
      access_token: tokens?.access_token || null,
      refresh_token: tokens?.refresh_token || null,
      scope: tokens?.scope || null,
      token_type: tokens?.token_type || null,
      expiry_date: tokens?.expiry_date || null,
      id_token: tokens?.id_token || null
    };

    let stringify_data = JSON.stringify(create_responce)

    return res.send(`
      <html>
        <body>
          <h2>Google OAuth completed successfully!</h2>
          <p>You can close this window.</p>

          <script>
            window.opener.postMessage(
              {
                success: true,
                oauthToken: ${JSON.stringify(stringify_data)}
              },
              "${session.origin}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return res.send("<h2>Failed to complete Google OAuth</h2>");
  }
};
