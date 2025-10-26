import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";
import { admin_credential_schema_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import toast from "react-hot-toast";

const schemaCache: Record<string, any> = {};

export function RequiredCredentialForm({
  formData,
  handleArrayChange,
  removeField,
  addField,
  setFormData,
}: any) {
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const token = useSelector((state: RootState) => state.user.token);

  // ✅ Cache + fetch schema from API
  async function getCredentialSchema(credentialType: string) {
    if (schemaCache[credentialType]) return schemaCache[credentialType];
    try {
      const { data } = await axios.post(
        admin_credential_schema_api,
        { credentialType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const properties = data.schemaData;
      schemaCache[credentialType] = properties;
      return properties;
    } catch (error) {
      toast.error("Error fetching credential schema", );
      console.log(error)
      return {};
    }
  }

  // ✅ Add new scope to credential
  const addScope = (credIdx: number) => {
    const trimmed = (inputValues[credIdx] || "").trim();
    if (!trimmed) return;
    const currentScopes = formData.requiredCredentials[credIdx].scopes || [];
    if (!currentScopes.includes(trimmed)) {
      handleArrayChange(
        credIdx,
        "scopes",
        [...currentScopes, trimmed],
        "requiredCredentials"
      );
    }
    setInputValues((prev) => ({ ...prev, [credIdx]: "" }));
  };

  // ✅ Remove scope
  const removeScope = (credIdx: number, scope: string) => {
    const currentScopes = formData.requiredCredentials[credIdx].scopes || [];
    handleArrayChange(
      credIdx,
      "scopes",
      currentScopes.filter((s: string) => s !== scope),
      "requiredCredentials"
    );
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    credIdx: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addScope(credIdx);
    }
  };

  // ✅ Fetch n8n schema & map to fields[]
  const handleCredentialTypeChange = async (idx: number, value: string) => {
    const updatedCred = {
      ...formData.requiredCredentials[idx],
      credentialType: value,
    };

    setLoadingIndex(idx);
    try {
      const schema = await getCredentialSchema(value);

      // 🔹 Convert schema properties → fields (with proper mapping)
      const fields = Object.entries(schema).map(([key, prop]: [string, any]) => {
        // Determine input type based on schema
        let inputType = "text";
        if (prop.type === 'hidden') inputType = "hidden";
        else if (prop.typeOptions?.password) inputType = "password";
        else if (key.toLowerCase().includes('secret') || key.toLowerCase().includes('token')) 
          inputType = "password";
        else if (prop.type === 'number') inputType = "number";
        else if (prop.type === 'email') inputType = "email";
        
        return {
          name: key,
          label: prop.displayName || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          inputType: inputType,
          disabled: prop.disabled ?? false,
          require: prop.required ?? false,
          value: prop.default || "",
          defaultValue: prop.default || "", 
        };
      });
      
      updatedCred.fields = fields;
    } catch (err) {
      console.error("Failed to load schema:", err);
      updatedCred.fields = [];
    } finally {
      setLoadingIndex(null);
    }

    const updatedArray = [...formData.requiredCredentials];
    updatedArray[idx] = updatedCred;
    setFormData((prev: any) => ({
      ...prev,
      requiredCredentials: updatedArray,
    }));
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Required Credentials</h3>

      {formData.requiredCredentials.map((cred: any, idx: number) => (
        <div key={idx} className="flex flex-col gap-2 mb-4 border p-3 rounded-lg">
          {/* Service / Label / Type */}
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
            <input
              type="text"
              placeholder="Credential Type"
              value={cred.credentialType}
              onChange={(e) =>
                handleCredentialTypeChange(idx, e.target.value.trim())
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

          {/* Fields Section */}
          <div className="ml-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                Credential Fields{" "}
                {loadingIndex === idx && (
                  <span className="text-xs text-gray-500">(Loading...)</span>
                )}
              </h4>
            </div>

            {/* ✅ IMPROVED FIELDS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(cred.fields || []).map((field: any, fieldIdx: number) => (
                <div key={fieldIdx} className="relative border-gray-200 border rounded-lg p-3">
                  {/* Field Header with Controls */}
                  <div className="flex items-center justify-between mb-2">
                   <span className="text-sm">{field.label}</span>
                    
                    {/* Control Buttons */}
                    <div className="flex gap-1">
                      {/* Input Type Selector */}
                      <select
                        value={field.inputType}
                        onChange={(e) => {
                          const updated = [...(cred.fields || [])];
                          updated[fieldIdx] = {
                            ...updated[fieldIdx],
                            inputType: e.target.value,
                          };
                          handleArrayChange(idx, "fields", updated, "requiredCredentials");
                        }}
                        className="text-xs border rounded px-1"
                      >
                        <option value="text">Text</option>
                        <option value="password">Password</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="url">URL</option>
                      </select>

                      {/* Enable/Disable Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(cred.fields || [])];
                          updated[fieldIdx] = {
                            ...updated[fieldIdx],
                            disabled: !field.disabled,
                          };
                          handleArrayChange(idx, "fields", updated, "requiredCredentials");
                        }}
                        className={`p-1 rounded text-xs ${
                          field.disabled 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        title={field.disabled ? "Enable field" : "Disable field"}
                      >
                        {field.disabled ? "🔓" : "🔒"}
                      </button>

                      {/* Required Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(cred.fields || [])];
                          updated[fieldIdx] = {
                            ...updated[fieldIdx],
                            require: !field.require,
                          };
                          handleArrayChange(idx, "fields", updated, "requiredCredentials");
                        }}
                        className={`p-1 rounded text-xs ${
                          field.require 
                            ? "bg-red-100 text-red-700 hover:bg-red-200" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        title={field.require ? "Make optional" : "Make required"}
                      >
                        {field.require ? "✓" : "R"}
                      </button>

                      
                    </div>
                  </div>

                 

                  {/* Input Field */}
                  <div className="space-y-2">
                   

                    {/* Default Value Setter */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Default value"
                        value={field.defaultValue || ""}
                        onChange={(e) => {
                          const updated = [...(cred.fields || [])];
                          updated[fieldIdx] = {
                            ...updated[fieldIdx],
                            defaultValue: e.target.value,
                          };
                          handleArrayChange(idx, "fields", updated, "requiredCredentials");
                        }}
                        className="flex-1 border border-gray-300 px-2 py-1 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(cred.fields || [])];
                          updated[fieldIdx] = {
                            ...updated[fieldIdx],
                            value: field.defaultValue || "",
                          };
                          handleArrayChange(idx, "fields", updated, "requiredCredentials");
                        }}
                        disabled={!field.defaultValue}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Apply default value to field"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Field Status Badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {field.disabled && (
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Disabled</span>
                    )}
                    {field.require && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                    )}
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {field.inputType}
                    </span>
                    {field.defaultValue && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Default : {field.defaultValue}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inject Section */}
          <div className="ml-4 mt-2">
            <h4 className="text-sm font-medium">Inject To</h4>
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
                    const updated = (cred.inject || []).filter(
                      (_: any, i: number) => i !== injectIdx
                    );
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

          {/* Scopes Section */}
          <div className="mt-2">
            <p className="text-sm font-medium">
              Select Scopes:{" "}
              <a
                className="text-primary underline"
                href="/admin/service/scopes"
                target="_blank"
              >
                go to scopes
              </a>
            </p>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a scope and press Enter"
                  value={inputValues[idx] || ""}
                  onChange={(e) =>
                    setInputValues((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  onKeyDown={(e) => handleInputKeyDown(e, idx)}
                  className="border px-2 py-1 rounded-lg w-full max-w-[500px]"
                />
                <button
                  type="button"
                  onClick={() => addScope(idx)}
                  className="bg-primary text-white px-4 rounded-lg hover:shadow-md"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(cred.scopes || []).map((scope: string, i: number) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {scope}
                    <button
                      type="button"
                      onClick={() => removeScope(idx, scope)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <IoClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Credential */}
      <button
        type="button"
        onClick={() =>
          addField("requiredCredentials", {
            service: "",
            label: "",
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