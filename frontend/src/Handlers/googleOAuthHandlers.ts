import { IRequiredCredential } from "@/types";
import axios from "axios";
import { toast } from "react-hot-toast";

export const allowedOrigins = [process.env.NEXT_PUBLIC_ALLOW_ORIGIN1];

export const googleOAuthHandlers = async (
  cred: IRequiredCredential,
  credentialsData: any,
  setCredentialsData: any,
) => {
  const serviceData = credentialsData[cred.service] || {};
  const clientId = serviceData.clientId;
  const clientSecret = serviceData.clientSecret;

  if (!clientId || !clientSecret) {
    toast.error(`Please provide clientId and clientSecret for ${cred.service}`);
    return;
  }

  try {
    // Get OAuth URL from backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}oauth/google`, {
      clientId,
      clientSecret,
      scopes: cred.scopes,
    });

    const { url } = response.data;
    if (!url) {
      toast.error("Failed to get OAuth URL from backend.");
      return;
    }

    // Open popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(url, `${cred.service} OAuth`, `width=${width},height=${height},top=${top},left=${left}`);
    if (!popup) {
      toast.error("Failed to open popup window.");
      return;
    }

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      if (!allowedOrigins.includes(event.origin)) return;
      const data = event.data;

      if (data.success) {
        const oauthTokenData = data.oauthToken || "";
        setCredentialsData((prev: any) => ({
          ...prev,
          [cred.service]: {
            ...(prev[cred.service] || {}),
            oauthTokenData,
          },
        }));
        toast.success(`${cred.service} connected successfully!`);
      } else {
        toast.error(`${cred.service} OAuth failed.`);
      }

      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage, false);

    // Optional: Detect popup closed without authentication
    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
      }
    }, 1000);
  } catch (err) {
    console.error("OAuth2 connection failed:", err);
    toast.error("Failed to connect with OAuth2 service.");
  }
};
