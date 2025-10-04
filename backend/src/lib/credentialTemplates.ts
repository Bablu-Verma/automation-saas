export const credentialTemplates: Record<string, any> = {
    // ----------------------
    // HTTP Authentication
    // ----------------------
    httpBasicAuth: { user: "", password: "" },
    httpHeaderAuth: { name: "", value: "" },
    httpQueryAuth: { name: "", value: "" },
    apiKey: { apiKey: "" },

    // ----------------------
    // OAuth2
    // ----------------------
    googleOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },
    microsoftOAuth2Api: {
        clientId: "",
        clientSecret: "",
        tenantId: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },
    facebookOAuth2Api: {
        appId: "",
        appSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", token_type: "Bearer" }
    },
    notionOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },
    dropboxOAuth2Api: {
        appKey: "",
        appSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },
    githubOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },
    slackOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", token_type: "Bearer" }
    },
    linkedinOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", token_type: "Bearer" }
    },
    discordOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", token_type: "Bearer" }
    },
    twitterOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },
    salesforceOAuth2Api: {
        clientId: "",
        clientSecret: "",
        sendAdditionalBodyProperties: true,
        additionalBodyProperties: {},
        oauthTokenData: { access_token: "", refresh_token: "", token_type: "Bearer" }
    },

    // ----------------------
    // API Key Services
    // ----------------------
    slackApi: { token: "" },
    githubApi: { accessToken: "" },
    telegramApi: { accessToken: "" },
    openAiApi: { apiKey: "" },
    stripeApi: { apiKey: "" },
    sendGridApi: { apiKey: "" },
    twilioApi: { accountSid: "", authToken: "" },
    airtableApi: { apiKey: "" },
    shopifyApi: { apiKey: "", password: "", shopName: "" },
    woocommerceApi: { consumerKey: "", consumerSecret: "", storeUrl: "" },

    // ----------------------
    // Databases
    // ----------------------
    mysql: { host: "", port: 3306, database: "", user: "", password: "" },
    postgres: { host: "", port: 5432, database: "", user: "", password: "" },
    mongodb: { connectionString: "" },
    mssql: { host: "", port: 1433, database: "", user: "", password: "" },
    redis: { host: "", port: 6379, password: "" },

    // ----------------------
    // Cloud / Services
    // ----------------------
    aws: { accessKeyId: "", secretAccessKey: "", region: "" },
    s3: { accessKeyId: "", secretAccessKey: "", region: "" },
    gcp: { serviceAccountKey: "", projectId: "" },
    azure: { tenantId: "", clientId: "", clientSecret: "", subscriptionId: "" },
    ftp: { host: "", port: 21, user: "", password: "", secure: false },
    sftp: { host: "", port: 22, user: "", password: "", privateKey: "" },
    googleCloudStorage: { projectId: "", clientEmail: "", privateKey: "" },
    azureBlobStorage: { accountName: "", accountKey: "" },
    firebaseRealtimeDatabase: { serviceAccountEmail: "", privateKey: "", projectId: "" },
};
