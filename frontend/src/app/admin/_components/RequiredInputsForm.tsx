interface RequiredInputsFormProps {
  arrayName: "requiredInputs";
  fields: {
    key: string;
    label: string;
    inject?: { node: string; field: string }[];
  }[];
  handleArrayChange: (
    index: number,
    field: string,
    value: any,
    arrayName: any
  ) => void;
  addField: (arrayName: any, newItem: any) => void;
  removeField: (arrayName: any, index: number) => void;
  newItemTemplate: { key: string; label: string; inject: { node: string; field: string }[] };
}

export function RequiredInputsForm({
  arrayName,
  fields,
  handleArrayChange,
  addField,
  removeField,
  newItemTemplate,
}: RequiredInputsFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold mb-2">Required Inputs</h3>

      {fields.map((item, idx) => (
        <div key={idx} className="border p-3 rounded-lg space-y-2">
          {/* Key & Label */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Key"
              value={item.key || ""}
              onChange={(e) =>
                handleArrayChange(idx, "key", e.target.value, arrayName)
              }
              className="border p-2 rounded-lg flex-1"
            />
            <input
              type="text"
              placeholder="Label"
              value={item.label || ""}
              onChange={(e) =>
                handleArrayChange(idx, "label", e.target.value, arrayName)
              }
              className="border p-2 rounded-lg flex-1"
            />
            <button
              type="button"
              onClick={() => removeField(arrayName, idx)}
              className="bg-red-500 text-white px-3 rounded-lg"
            >
              ✕
            </button>
          </div>

          {/* Inject Sub-fields */}
          <div className="ml-4">
            <h4 className="font-medium text-sm mb-1">Inject Fields</h4>
            {(item.inject || []).map((injectItem, injectIdx) => (
              <div key={injectIdx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Node"
                  value={injectItem.node || ""}
                  onChange={(e) => {
                    const updated = [...(item.inject || [])];
                    updated[injectIdx] = { ...updated[injectIdx], node: e.target.value };
                    handleArrayChange(idx, "inject", updated, arrayName);
                  }}
                  className="border px-2 py-1 rounded-lg flex-1"
                />
                <input
                  type="text"
                  placeholder="Field"
                  value={injectItem.field || ""}
                  onChange={(e) => {
                    const updated = [...(item.inject || [])];
                    updated[injectIdx] = { ...updated[injectIdx], field: e.target.value };
                    handleArrayChange(idx, "inject", updated, arrayName);
                  }}
                  className="border px-2 py-1 rounded-lg flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = (item.inject || []).filter(
                      (_, i) => i !== injectIdx
                    );
                    handleArrayChange(idx, "inject", updated, arrayName);
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
                const updated = [...(item.inject || []), { node: "", field: "" }];
                handleArrayChange(idx, "inject", updated, arrayName);
              }}
              className="text-blue-600 text-xs"
            >
              ➕ Add Inject
            </button>
          </div>
        </div>
      ))}

      {/* Add Parent Input */}
      <button
        type="button"
        onClick={() => addField(arrayName, newItemTemplate)}
        className="text-blue-600 text-sm"
      >
        ➕ Add Input
      </button>
    </div>
  );
}
