"use client";

import { IoClose } from "react-icons/io5";

interface PricingPlan {
    planName: string;
    monthlyPrice: number;
    usageLimit: number;
    validityDays: number;
    discountPercent:number;
    features: string[];
}

interface Props {
    pricingPlans: PricingPlan[];
    setPricingPlans: (plans: PricingPlan[]) => void;
}

export default function PricingPlansForm({ pricingPlans, setPricingPlans }: Props) {

    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...pricingPlans];
        (updated as any)[index][field] = value;
        setPricingPlans(updated);
    };

    const addPlan = () => {
        setPricingPlans([
            ...pricingPlans,
            {
                planName: "BASE",
                monthlyPrice: 499,
                usageLimit: 100,
                validityDays: 30,
                discountPercent:5,
                features: []
            }
        ]);
    };

    const removePlan = (index: number) => {
        const updated = pricingPlans.filter((_, i) => i !== index);
        setPricingPlans(updated);
    };

    return (
        <div className="border p-4 rounded-xl shadow-sm space-y-5">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pricing Plans</h3>
                <button
                    type="button"
                    onClick={addPlan}
                    className="px-4 py-1 bg-primary text-white rounded-lg"
                >
                    + Add Plan
                </button>
            </div>

            {pricingPlans.map((plan, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">

                    <div className="grid grid-cols-3 gap-4">
                        {/* Plan Name */}
                        <div>
                            <label className="text-sm font-medium">Plan Name</label>
                            <select
                                value={plan.planName}
                                onChange={(e) => handleChange(index, "planName", e.target.value)}
                                className="border p-2 rounded-lg w-full mt-1"
                            >
                                <option value="TRIAL">TRIAL</option>
                                <option value="BASE">BASE</option>
                                <option value="STARTER">STARTER</option>
                                <option value="PRO">PRO</option>
                            </select>
                        </div>

                        {/* Monthly Price */}
                        <div>
                            <label className="text-sm font-medium">Monthly Price</label>
                            <input
                                type="number"
                                placeholder="Monthly Price"
                                value={plan.monthlyPrice}
                                onChange={(e) =>
                                    handleChange(index, "monthlyPrice", Number(e.target.value))
                                }
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>

                        {/* Usage Limit */}
                        <div>
                            <label className="text-sm font-medium">
                                Usage Limit <span className="text-xs text-gray-500">( -1 = unlimited )</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Usage Limit"
                                value={plan.usageLimit}
                                onChange={(e) =>
                                    handleChange(index, "usageLimit", Number(e.target.value))
                                }
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>

                        {/* Validity Days */}
                        <div>
                            <label className="text-sm font-medium">Validity Days</label>
                            <input
                                type="number"
                                placeholder="Validity Days"
                                value={plan.validityDays}
                                onChange={(e) =>
                                    handleChange(index, "validityDays", Number(e.target.value))
                                }
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Discount Percent</label>
                            <input
                                type="number"
                                placeholder="discountPercent"
                                value={plan.discountPercent}
                                onChange={(e) =>
                                    handleChange(index, "discountPercent", Number(e.target.value))
                                }
                                className="border p-2 rounded-lg w-full mt-1"
                            />
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <label className="text-sm font-medium">Features</label>
                       <textarea
                            placeholder="Enter each feature on a new line"
                            value={plan.features.join("\n")}
                            onChange={(e) =>
                                handleChange(
                                index,
                                "features",
                                e.target.value.split("\n") 
                                )
                            }
                            className="border p-2 rounded-lg w-full mt-1 h-20"
                            />
                    </div>

                    {/* Remove btn */}
                    <button
                        type="button"
                        onClick={() => removePlan(index)}
                        className="text-red-600 inline-flex gap-1 items-center justify-center text-sm underline"
                    >
                        <span>Remove Plan</span> <IoClose />
                    </button>
                </div>
            ))}
        </div>
    );
}
