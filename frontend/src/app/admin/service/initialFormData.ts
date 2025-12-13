export const initialFormData = {
  name: "",
  description: "",
  workflowJsonTemplate: '', 
  serviceImage: "",
 pricingPlans: [
  {
    planName: "STARTER",
    monthlyPrice: 149,
    usageLimit: 10,
    validityDays: 30,   // ⭐ added
    discountPercent:5,
    features: [] as string[],
  },
],
  currency: "INR",
  keyword: [] as string[],
  requiredInputs: [
    {
      key: "",
      label: "",
      inject: [{ node: "", field: "" }],
    },
  ],
  requiredCredentials: [
    {
      service: "",
      label: "",
      credentialType: "",
      scopes: [] as string[],
      fields: [] as any[],
      inject: [{ node: "", field: "" }],
    },
  ],

  isPublished: "PAUSE",
};
