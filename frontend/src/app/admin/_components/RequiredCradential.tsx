import { useFormArrayHelpers } from "../service/useFormArrayHelpers";


const googleScopes = [
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
];

const facebookScopes = [
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
];


const credentialFieldsMap: Record<string, { label: string; inputType: string; name: string }[]> = {
  // HTTP
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

  // OAuth2
  oAuth2Api: [
    { label: "Client ID", inputType: "text", name: "clientId" },
    { label: "Client Secret", inputType: "password", name: "clientSecret" },
    { label: "Access Token", inputType: "token", name: "accessToken" },
    { label: "Refresh Token", inputType: "token", name: "refreshToken" },
  ],

  facebookOAuth2Api: [
    { label: "App ID", inputType: "text", name: "appId" },
    { label: "App Secret", inputType: "password", name: "appSecret" },
    { label: "Access Token", inputType: "token", name: "accessToken" },
  ],
  slackApi: [
    { label: "Token", inputType: "token", name: "token" },
  ],
  githubApi: [
    { label: "Access Token", inputType: "token", name: "accessToken" },
  ],
  telegramApi: [
    { label: "Bot Token", inputType: "token", name: "accessToken" },
  ],

  // Databases
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

  // Cloud / Services
  aws: [
    { label: "Access Key ID", inputType: "text", name: "accessKeyId" },
    { label: "Secret Access Key", inputType: "password", name: "secretAccessKey" },
    { label: "Region", inputType: "text", name: "region" },
  ],
};


export function RequiredCredentialForm({
  formData,
  handleArrayChange,
  removeField,
  addField,
  setFormData
}: any) {
  const toggleScope = (credIdx: number, scope: string) => {
    const scopes = formData.requiredCredentials[credIdx].scopes || [];
    const updatedScopes = scopes.includes(scope)
      ? scopes.filter((s: string) => s !== scope)
      : [...scopes, scope];
    handleArrayChange(credIdx, "scopes", updatedScopes, "requiredCredentials");
  };


  const handleInputTypeChange = (idx: number, value: string) => {

    const defaultFields = credentialFieldsMap[value] || [];

  const updatedCred = {
    ...formData.requiredCredentials[idx],
    inputType: value,
    // credentialType: value,
    fields: defaultFields,
  };

  const updatedArray = [...formData.requiredCredentials];
  updatedArray[idx] = updatedCred;

  setFormData((prev:any) => ({
    ...prev,
    requiredCredentials: updatedArray,
  }));

  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Required Credentials</h3>
      {formData.requiredCredentials.map((cred: any, idx: number) => {
        const availableScopes =
          cred.inputType === 'oAuth2Api'
            ? googleScopes
            : cred.inputType === "facebookOAuth2Api"
              ? facebookScopes
              : [];

        return (
          <div key={idx} className="flex flex-col gap-2 mb-4 border p-3 rounded-lg">
            {/* Service, Label, Input Type, Credential Type */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Service"
                value={cred.service}
                onChange={(e) =>
                  handleArrayChange(idx, "service", e.target.value, "requiredCredentials")
                }
                className="border p-2 rounded-lg flex-1"
              />
              <input
                type="text"
                placeholder="Label"
                value={cred.label}
                onChange={(e) =>
                  handleArrayChange(idx, "label", e.target.value, "requiredCredentials")
                }
                className="border p-2 rounded-lg flex-1"
              />
              <select
                value={cred.inputType}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  handleInputTypeChange(idx, selectedType);
                }}
                className="border p-2 rounded-lg"
              >
                <option value="">choose type</option>
                {Object.keys(credentialFieldsMap).map((type) => (
                  <option key={type} className='capitalize' value={type}>
                    {type} {/* You can customize this label if needed */}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Credential Type (n8n internal)"
                value={cred.credentialType}
               onChange={(e) =>
                  handleArrayChange(idx, "credentialType", e.target.value, "requiredCredentials")
                }
                className="border p-2 rounded-lg flex-1"
              />
              <button
                type="button"
                onClick={() => removeField("requiredCredentials", idx)}
                className="bg-red-500 text-white px-3 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Auto-loaded Credential Fields */}
            <div className="ml-4 mt-2">
              <h4 className="text-sm font-medium">Credential Fields</h4>
              <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                {(cred.fields || []).map((field: any, fieldIdx: number) => (
                  <div key={fieldIdx} className="flex gap-2 mb-2">
                    <input
                      type={field.inputType === "password" ? "password" : "text"}
                      placeholder={field.label || field.name}
                      value={field.value || ""}
                      onChange={(e) => {
                        const updated = [...(cred.fields || [])];
                        updated[fieldIdx] = {
                          ...updated[fieldIdx],
                          value: e.target.value,
                        };
                        handleArrayChange(idx, "fields", updated, "requiredCredentials");
                      }}
                      className="border px-2 py-1 rounded-lg flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Inject Fields */}
            <div className="ml-4 mt-2">
              <h4 className="text-sm font-medium">Place to Inject</h4>
              {(cred.inject || []).map((injectItem: any, injectIdx: number) => (
                <div key={injectIdx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Inject Node"
                    value={injectItem.node || ""}
                    onChange={(e) => {
                      const updated = [...(cred.inject || [])];
                      updated[injectIdx] = { ...updated[injectIdx], node: e.target.value };
                      handleArrayChange(idx, "inject", updated, "requiredCredentials");
                    }}
                    className="border px-2 py-1 rounded-lg flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Inject Field"
                    value={injectItem.field || ""}
                    onChange={(e) => {
                      const updated = [...(cred.inject || [])];
                      updated[injectIdx] = { ...updated[injectIdx], field: e.target.value };
                      handleArrayChange(idx, "inject", updated, "requiredCredentials");
                    }}
                    className="border px-2 py-1 rounded-lg flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (cred.inject || []).filter((_: any, i: number) => i !== injectIdx);
                      handleArrayChange(idx, "inject", updated, "requiredCredentials");
                    }}
                    className="bg-red-400 text-white px-2 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updated = [...(cred.inject || []), { node: "", field: "" }];
                  handleArrayChange(idx, "inject", updated, "requiredCredentials");
                }}
                className="text-blue-600 text-xs"
              >
                ➕ Add Inject
              </button>
            </div>

            {/* Dynamic Scopes */}
            {availableScopes.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Select Scopes:</p>
                <div className="flex gap-x-8 gap-y-3 flex-wrap mt-1">
                  {availableScopes.map((scope) => (
                    <label key={scope.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={cred.scopes?.includes(scope.value) || false}
                        onChange={() => toggleScope(idx, scope.value)}
                      />
                      {scope.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Credential button */}
      <button
        type="button"
        onClick={() =>
          addField("requiredCredentials", {
            service: "",
            label: "",
            inputType: "",
            credentialType: "",
            scopes: [],
            fields: [],
            inject: [{ node: "", field: "" }],
          })
        }
        className="text-blue-600 text-sm"
      >
        ➕ Add Credential
      </button>
    </div>
  );
}




