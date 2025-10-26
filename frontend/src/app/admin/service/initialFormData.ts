  export const initialFormData = {
    name: "",
    workflowJsonTemplate: "",
    serviceImage: "",
    pricePerMonth: 0,
    currency: "INR",
    keyword:[] as string[],
    trialDays: 7,
    requiredInputs: [{ key: "", label: "" }],
    requiredCredentials: [
      {
        service: "",
        label: "",
        credentialType: "",
        fields: [],
        scopes: [],
        inject: [{ node: "", field: "" }],
      },
    ],
    isPublished: "PAUSE",
  };