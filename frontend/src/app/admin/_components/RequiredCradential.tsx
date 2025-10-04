
import { IoClose } from "react-icons/io5";
import { credentialFieldsMap, } from "./credential_fields_and_scopes";
import { useState } from "react";


export function RequiredCredentialForm({
  formData,
  handleArrayChange,
  removeField,
  addField,
  setFormData
}: any) {



  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

  const addScope = (credIdx: number) => {
    const trimmed = (inputValues[credIdx] || "").trim();
    if (!trimmed) return;

    const currentScopes = formData.requiredCredentials[credIdx].scopes || [];
    if (!currentScopes.includes(trimmed)) {
      handleArrayChange(credIdx, "scopes", [...currentScopes, trimmed], "requiredCredentials");
    }

    setInputValues(prev => ({ ...prev, [credIdx]: "" }));
  };

  const removeScope = (credIdx: number, scope: string) => {
    const currentScopes = formData.requiredCredentials[credIdx].scopes || [];
    handleArrayChange(credIdx, "scopes", currentScopes.filter((s: string) => s !== scope), "requiredCredentials");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, credIdx: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addScope(credIdx);
    }
  };



  const handleInputTypeChange = (idx: number, value: string) => {

    const defaultFields = credentialFieldsMap[value] || [];

    const updatedCred = {
      ...formData.requiredCredentials[idx],
      inputType: value,
      fields: defaultFields,
    };

    const updatedArray = [...formData.requiredCredentials];
    updatedArray[idx] = updatedCred;

    setFormData((prev: any) => ({
      ...prev,
      requiredCredentials: updatedArray,
    }));

  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Required Credentials </h3>
      {formData.requiredCredentials.map((cred: any, idx: number) => {

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


            <div className="mt-2">
              <p className="text-sm font-medium">Select Scopes: <a className="text-primary underline" href="/admin/service/scopes" target="_blank">go to scopes</a></p>
              <div className=" mt-1">
                <div className="space-y-2">

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a scope and press Enter"
                      value={inputValues[idx] || ""}
                      onChange={(e) => setInputValues(prev => ({ ...prev, [idx]: e.target.value }))}
                      onKeyDown={(e) => handleInputKeyDown(e, idx)}
                      className="border px-2 py-1 rounded-lg w-full max-w-[500px] "
                    />
                    <button
                      type="button"
                      onClick={() => addScope(idx)}
                      className="bg-primary text-white px-4 rounded-lg hover:shadow-md"
                    >
                      Add
                    </button>
                  </div>

                  {/* Show keywords as chips */}
                  <div className="flex flex-wrap gap-2">
                    {(cred.scopes || []).map((scope: string, i: number) => (
                      <span key={i} className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2">
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




