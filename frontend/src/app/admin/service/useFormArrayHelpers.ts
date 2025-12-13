import { useState } from "react";

export function useFormArrayHelpers<T extends Record<string, any>>(initialData: T) {
  const [formData, setFormData] = useState<T>(initialData);
  const [description, setDescription] = useState("");

  // handle basic inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle array fields (inputs, keys, credentials, etc.)
  const handleArrayChange = (
    index: number,
    field: string,
    value: any,
    arrayName: keyof T
  ) => {
    const updatedArray = [...(formData[arrayName] as any[])];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setFormData((prev) => ({ ...prev, [arrayName]: updatedArray }));
  };

  // add new item in array
  const addField = (arrayName: keyof T, newItem: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[]), newItem],
    }));
  };

  // remove item from array
  const removeField = (arrayName: keyof T, index: number) => {
    const updatedArray = [...(formData[arrayName] as any[])];
    updatedArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [arrayName]: updatedArray }));
  };
   const handleReset = () => {
    setFormData(initialData);
    setDescription("");
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    addField,
    removeField,
    description,
    setDescription,
    handleReset
  };
}
