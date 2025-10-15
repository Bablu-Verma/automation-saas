"use client";

import { scopes__ } from "../../_components/credential_fields_and_scopes";
import { scopes_servicei } from "../../_components/credential_fields_and_scopes";
import { useState } from "react";

export default function ScopesList() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-28  px-6">
      <div className="flex flex-col gap-3 mt-1">
        {(Object.keys(scopes__) as scopes_servicei[]).map((service) => (
          <div key={service} className="mt-2">
            <h4 className="font-medium text-xl capitalize">{service}</h4>
            <div className="mt-1 flex flex-col gap-1">
              {scopes__[service].map((scope,i) => (
                <p
                  key={scope.value}
                  className="flex items-center gap-2 mb-1 text-base cursor-pointer hover:bg-gray-700 hover:text-white rounded px-2 py-1 transition-colors"
                  onClick={() => handleCopy(scope.value)}
                  title="Click to copy"
                >
                 {i+1}. {' '} {scope.label} — {scope.value}{" "}
                  {copiedValue === scope.value && (
                    <span className="text-green-400 ml-2">(Copied!)</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
