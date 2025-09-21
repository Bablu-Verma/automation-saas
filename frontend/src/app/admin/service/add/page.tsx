"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UploadImageGetLink from "../../_components/UploadImage";
import { admin_create_master_workflow_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

const TiptapEditor = dynamic(() => import("../../_components/TextEditor"), { ssr: false });

export default function AddMasterWorkflow() {
    const initialFormData = {
        name: "",
        workflowJsonTemplate: "",
        serviceImage: "",
        category: "",
        pricePerMonth: 0,
        currency: "INR",
        trialDays: 7,
        requiredInputs: [{ key: "", label: "", type: "string", placeholder: "", required: true }],
        requiredCredentials: [{ service: "", label: "", type: "OAuth2" }],
        isPublished: "PAUSE",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const token = useSelector((state: RootState) => state.user.token);


    // handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle dynamic fields
    const handleArrayChange = (
        index: number,
        field: string,
        value: string,
        arrayName: "requiredInputs" | "requiredCredentials"
    ) => {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        setFormData((prev) => ({ ...prev, [arrayName]: updatedArray }));
    };

    const addField = (arrayName: "requiredInputs" | "requiredCredentials", newItem: any) => {
        setFormData((prev) => ({ ...prev, [arrayName]: [...prev[arrayName], newItem] }));
    };

    const removeField = (arrayName: "requiredInputs" | "requiredCredentials", index: number) => {
        const updatedArray = [...formData[arrayName]];
        updatedArray.splice(index, 1);
        setFormData((prev) => ({ ...prev, [arrayName]: updatedArray }));
    };

    // handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // validate JSON
            let parsedTemplate = {};
            if (formData.workflowJsonTemplate.trim()) {
                try {
                    parsedTemplate = JSON.parse(formData.workflowJsonTemplate);
                } catch {
                    toast.error("Invalid JSON in Workflow Template.");
                    setLoading(false);
                    return;
                }
            }

            const res = await axios.post(admin_create_master_workflow_api, {
                ...formData,
                workflowJsonTemplate: parsedTemplate,
                description,
            },
        {
             headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );

            toast.success(res.data.message);

            // reset form
            setFormData(initialFormData);
            setDescription("");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error adding workflow.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setDescription("");
    };

    return (

        <>
            <UploadImageGetLink />
            <div className="bg-white p-6 rounded-2xl shadow-lg">

                <h2 className="text-xl font-bold mb-4">➕ Add Master Workflow</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Inputs */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Workflow Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                        required
                    />

                    <textarea
                        name="workflowJsonTemplate"
                        placeholder="Workflow JSON Template"
                        value={formData.workflowJsonTemplate}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 font-mono text-sm"
                        rows={4}
                        required
                    />

                    <input
                        type="text"
                        name="serviceImage"
                        placeholder="Service Icon URL"
                        value={formData.serviceImage}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2"
                    />

                    <div className="grid grid-cols-2 gap-5">
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />

                        <select
                            name="isPublished"
                            value={formData.isPublished}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="PAUSE">Pause</option>
                            <option value="ACTIVE">Active</option>
                        </select>
                    </div>

                    {/* Monetization */}
                    <div className="grid grid-cols-3 gap-5">
                        <input
                            type="number"
                            name="pricePerMonth"
                            placeholder="Price Per Month"
                            value={formData.pricePerMonth}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="USD">USD</option>
                            <option value="INR">INR</option>
                            <option value="EUR">EUR</option>
                        </select>
                        <input
                            type="number"
                            name="trialDays"
                            placeholder="Trial Days"
                            value={formData.trialDays}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    {/* Dynamic Inputs */}
                    <div>
                        <h3 className="font-semibold mb-2">Required Inputs</h3>
                        {formData.requiredInputs.map((input, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={input.key}
                                    onChange={(e) => handleArrayChange(idx, "key", e.target.value, "requiredInputs")}
                                    className="border p-2 rounded-lg flex-1"
                                    
                                />
                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={input.label}
                                    onChange={(e) => handleArrayChange(idx, "label", e.target.value, "requiredInputs")}
                                    className="border p-2 rounded-lg flex-1"
                                    
                                />
                                <input
                                    type="text"
                                    placeholder="Placeholder"
                                    value={input.placeholder}
                                    onChange={(e) => handleArrayChange(idx, "placeholder", e.target.value, "requiredInputs")}
                                    className="border p-2 rounded-lg flex-1"
                                />
                                <select
                                    value={input.type}
                                    onChange={(e) => handleArrayChange(idx, "type", e.target.value, "requiredInputs")}
                                    className="border p-2 rounded-lg"
                                >
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => removeField("requiredInputs", idx)}
                                    className="bg-red-500 text-white px-3 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                addField("requiredInputs", { key: "", label: "", type: "string", placeholder: "", required: true })
                            }
                            className="text-blue-600 text-sm"
                        >
                            ➕ Add Input
                        </button>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Required Credentials</h3>
                        {formData.requiredCredentials.map((cred, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Service"
                                    value={cred.service}
                                    onChange={(e) => handleArrayChange(idx, "service", e.target.value, "requiredCredentials")}
                                    className="border p-2 rounded-lg flex-1"
                                    
                                />
                                <input
                                    type="text"
                                    placeholder="Label"
                                    value={cred.label}
                                    onChange={(e) => handleArrayChange(idx, "label", e.target.value, "requiredCredentials")}
                                    className="border p-2 rounded-lg flex-1"
                                    
                                />
                                <select
                                    value={cred.type}
                                    onChange={(e) => handleArrayChange(idx, "type", e.target.value, "requiredCredentials")}
                                    className="border p-2 rounded-lg"
                                >
                                    <option value="oauth2">OAuth2</option>
                                    <option value="apikey">API Key</option>
                                    <option value="token">Token</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => removeField("requiredCredentials", idx)}
                                    className="bg-red-500 text-white px-3 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                addField("requiredCredentials", { service: "", label: "", type: "oauth2" })
                            }
                            className="text-blue-600 text-sm"
                        >
                            ➕ Add Credential
                        </button>
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <TiptapEditor editorContent={description} setEditorContent={setDescription} />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end items-center gap-5">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-red-600 text-white p-2 rounded-lg hover:shadow-2xl px-10"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary px-10 text-white p-2 rounded-lg hover:shadow-2xl disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Workflow"}
                        </button>
                    </div>
                </form>
            </div>
        </>



    );
}
