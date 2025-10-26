

export const credentialFieldsMap: Record<string, { label: string; inputType: string; name: string }[]> = {
  // ----------------------
  // HTTP Authentication
  // ----------------------
  httpBasicAuth: [
    { label: "Username", inputType: "text", name: "user" },
    { label: "Password", inputType: "password", name: "password" },
  ],
  httpHeaderAuth: [
    { label: "Header Name", inputType: "text", name: "name" },
    { label: "Header Value", inputType: "text", name: "value" },
  ],
  httpQueryAuth: [
    { label: "Query Parameter Name", inputType: "text", name: "name" },
    { label: "Query Parameter Value", inputType: "text", name: "value" },
  ],
  apiKey: [
    { label: "API Key", inputType: "text", name: "apiKey" },
  ],

  // ----------------------
  // OAuth2
  // ----------------------
  googleOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
  ],
  microsoftOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
    { label: "Tenant ID", inputType: "text", name: "tenantId" },
  ],
  facebookOAuth2Api: [
    { label: "App ID", inputType: "password", name: "appId" },
    { label: "App Secret", inputType: "password", name: "appSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
  ],
  notionOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
  ],
  dropboxOAuth2Api: [
    { label: "App Key", inputType: "password", name: "appKey" },
    { label: "App Secret", inputType: "password", name: "appSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
  ],
  githubOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
  ],
  slackOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
  ],
  linkedinOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
  ],
  discordOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
  ],
  twitterOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
  ],
  salesforceOAuth2Api: [
    { label: "Client ID", inputType: "password", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "password", name: "accessToken" },
    { label: "Refresh Token", inputType: "password", name: "refreshToken" },
  ],

  // ----------------------
  // API Key Services
  // ----------------------
  slackApi: [{ label: "Token", inputType: "text", name: "token" }],
  githubApi: [{ label: "Access Token", inputType: "text", name: "accessToken" }],
  telegramApi: [{ label: "Bot Token", inputType: "text", name: "accessToken" }],
  openAiApi: [{ label: "API Key", inputType: "text", name: "apiKey" }],
  stripeApi: [{ label: "API Key", inputType: "text", name: "apiKey" }],
  sendGridApi: [{ label: "API Key", inputType: "text", name: "apiKey" }],
  twilioApi: [
    { label: "Account SID", inputType: "text", name: "accountSid" },
    { label: "Auth Token", inputType: "password", name: "authToken" },
  ],
  airtableApi: [{ label: "API Key", inputType: "text", name: "apiKey" }],
  shopifyApi: [
    { label: "API Key", inputType: "text", name: "apiKey" },
    { label: "Password", inputType: "password", name: "password" },
    { label: "Shop Name", inputType: "text", name: "shopName" },
  ],
  woocommerceApi: [
    { label: "Consumer Key", inputType: "text", name: "consumerKey" },
    { label: "Consumer Secret", inputType: "password", name: "consumerSecret" },
    { label: "Store URL", inputType: "text", name: "storeUrl" },
  ],

  // ----------------------
  // Databases
  // ----------------------
  mysql: [
    { label: "Host", inputType: "text", name: "host" },
    { label: "Port", inputType: "number", name: "port" },
    { label: "Database", inputType: "text", name: "database" },
    { label: "Username", inputType: "text", name: "user" },
    { label: "Password", inputType: "password", name: "password" },
  ],
  postgres: [
    { label: "Host", inputType: "text", name: "host" },
    { label: "Port", inputType: "number", name: "port" },
    { label: "Database", inputType: "text", name: "database" },
    { label: "Username", inputType: "text", name: "user" },
    { label: "Password", inputType: "password", name: "password" },
  ],
  mongodb: [{ label: "Connection String", inputType: "text", name: "connectionString" }],
  mssql: [
    { label: "Host", inputType: "text", name: "host" },
    { label: "Port", inputType: "number", name: "port" },
    { label: "Database", inputType: "text", name: "database" },
    { label: "Username", inputType: "text", name: "user" },
    { label: "Password", inputType: "password", name: "password" },
  ],
  redis: [
    { label: "Host", inputType: "text", name: "host" },
    { label: "Port", inputType: "number", name: "port" },
    { label: "Password", inputType: "password", name: "password" },
  ],

  // ----------------------
  // Cloud / Services
  // ----------------------
  aws: [
    { label: "Access Key ID", inputType: "text", name: "accessKeyId" },
    { label: "Secret Access Key", inputType: "password", name: "secretAccessKey" },
    { label: "Region", inputType: "text", name: "region" },
  ],
  s3: [
    { label: "Access Key ID", inputType: "text", name: "accessKeyId" },
    { label: "Secret Access Key", inputType: "password", name: "secretAccessKey" },
    { label: "Region", inputType: "text", name: "region" },
  ],
  gcp: [
    { label: "Service Account Key JSON", inputType: "text", name: "serviceAccountKey" },
    { label: "Project ID", inputType: "text", name: "projectId" },
  ],
  azure: [
    { label: "Tenant ID", inputType: "text", name: "tenantId" },
    { label: "Client ID", inputType: "text", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Subscription ID", inputType: "text", name: "subscriptionId" },
  ],
  ftp: [
    { label: "Host", inputType: "text", name: "host" },
    { label: "Port", inputType: "number", name: "port" },
    { label: "Username", inputType: "text", name: "user" },
    { label: "Password", inputType: "password", name: "password" },
    { label: "Secure (FTPS)", inputType: "checkbox", name: "secure" },
  ],
  sftp: [
    { label: "Host", inputType: "text", name: "host" },
    { label: "Port", inputType: "number", name: "port" },
    { label: "Username", inputType: "text", name: "user" },
    { label: "Password", inputType: "password", name: "password" },
    { label: "Private Key", inputType: "password", name: "privateKey" },
  ],
  googleCloudStorage: [
    { label: "Project ID", inputType: "text", name: "projectId" },
    { label: "Client Email", inputType: "text", name: "clientEmail" },
    { label: "Private Key", inputType: "password", name: "privateKey" },
  ],
  azureBlobStorage: [
    { label: "Account Name", inputType: "text", name: "accountName" },
    { label: "Account Key", inputType: "password", name: "accountKey" },
  ],
  firebaseRealtimeDatabase: [
    { label: "Service Account Email", inputType: "text", name: "serviceAccountEmail" },
    { label: "Private Key", inputType: "password", name: "privateKey" },
    { label: "Project ID", inputType: "text", name: "projectId" },
  ],
};


export type scopes_servicei = "google" | "facebook" | "microsoft";

export const scopes__: Record<scopes_servicei, { label: string; value: string }[]> = {
  google: [
    { label: "Google Drive (readonly)", value: "https://www.googleapis.com/auth/drive.readonly" },
    { label: "Google Drive (full)", value: "https://www.googleapis.com/auth/drive" },
    { label: "Gmail Readonly", value: "https://www.googleapis.com/auth/gmail.readonly" },
    { label: "Gmail Send", value: "https://www.googleapis.com/auth/gmail.send" },
    { label: "Gmail Modify", value: "https://www.googleapis.com/auth/gmail.modify" },
    { label: "Google Sheets", value: "https://www.googleapis.com/auth/spreadsheets" },
    { label: "Google Calendar", value: "https://www.googleapis.com/auth/calendar" },
    { label: "Google Calendar (readonly)", value: "https://www.googleapis.com/auth/calendar.readonly" },
    { label: "Google Docs", value: "https://www.googleapis.com/auth/documents" },
    { label: "Google Docs (readonly)", value: "https://www.googleapis.com/auth/documents.readonly" },
    { label: "Google Contacts", value: "https://www.googleapis.com/auth/contacts" },
    { label: "User Profile", value: "https://www.googleapis.com/auth/userinfo.profile" },
    { label: "User Email", value: "https://www.googleapis.com/auth/userinfo.email" },
    { label: "Google Photos (readonly)", value: "https://www.googleapis.com/auth/photoslibrary.readonly" },
    { label: "Google Drive Metadata (readonly)", value: "https://www.googleapis.com/auth/drive.metadata.readonly" },
  ],

  facebook: [
    { label: "Public Profile", value: "public_profile" },
    { label: "Email", value: "email" },
    { label: "User Friends", value: "user_friends" },
    { label: "Pages Show List", value: "pages_show_list" },
    { label: "Pages Manage Posts", value: "pages_manage_posts" },
    { label: "Pages Read Engagement", value: "pages_read_engagement" },
    { label: "Pages Read User Content", value: "pages_read_user_content" },
    { label: "Pages Manage Ads", value: "pages_manage_ads" },
    { label: "Instagram Basic", value: "instagram_basic" },
    { label: "Instagram Manage Insights", value: "instagram_manage_insights" },
    { label: "Business Management", value: "business_management" },
    { label: "Ads Management", value: "ads_management" },
    { label: "Ads Read", value: "ads_read" },
  ],

  microsoft: [
    { label: "Microsoft Graph User.Read", value: "User.Read" },
    { label: "Microsoft Graph Mail.Read", value: "Mail.Read" },
    { label: "Microsoft Graph Mail.Send", value: "Mail.Send" },
    { label: "Microsoft Graph Calendars.Read", value: "Calendars.Read" },
    { label: "Microsoft Graph Calendars.ReadWrite", value: "Calendars.ReadWrite" },
    { label: "Microsoft Graph Contacts.Read", value: "Contacts.Read" },
    { label: "Microsoft Graph Files.Read", value: "Files.Read" },
    { label: "Microsoft Graph Files.ReadWrite", value: "Files.ReadWrite" },
  ]
};

