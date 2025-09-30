"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UploadImageGetLink from "../../_components/UploadImage";
import { admin_create_master_workflow_api } from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

import { RequiredInputsForm } from "../../_components/RequiredInputsForm";
import { RequiredCredentialForm } from "../../_components/RequiredCradential";
import { initialFormData } from "../initialFormData";
import { useFormArrayHelpers } from "../useFormArrayHelpers";
import KeywordInput from "../KeywordInput";

const TiptapEditor = dynamic(() => import("../../_components/TextEditor"), { ssr: false });

export default function AddMasterWorkflow() {


  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);

  const {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    addField,
    removeField,

    description,
    setDescription,
    handleReset
  } = useFormArrayHelpers(initialFormData);


  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      const res = await axios.post(
        admin_create_master_workflow_api,
        { ...formData, workflowJsonTemplate: parsedTemplate, description },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);
      setFormData(initialFormData);
      setDescription("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error adding workflow.");
    } finally {
      setLoading(false);
    }
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

         

          <div className="grid grid-cols-2 gap-5">
           <input
            type="text"
            name="serviceImage"
            placeholder="Service Icon URL"
            value={formData.serviceImage}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
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

          <KeywordInput
            keywords={formData.keyword}
            setKeywords={(newKeywords) => setFormData({ ...formData, keyword: newKeywords })}
          />


          <RequiredInputsForm
            arrayName="requiredInputs"
            fields={formData.requiredInputs || []}
            handleArrayChange={handleArrayChange}
            addField={addField}
            removeField={removeField}
            newItemTemplate={{ key: "", label: "", inject: [{ node: "", field: "" }] }}
          />

          <RequiredCredentialForm
            formData={formData}
            handleArrayChange={handleArrayChange}
            addField={addField}
            setFormData={setFormData}
            removeField={removeField}
          />


          {/* Description */}
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
