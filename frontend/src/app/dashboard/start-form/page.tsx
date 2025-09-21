"use client"

import { service_detail_api } from "@/api";
import { WorkflowDetail } from "@/app/admin/service/view/page";
import Loading_ from "@/components/Loading";
import { RootState } from "@/redux-store/redux_store";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function StartFormPage() {
  const searchParams = useSearchParams();
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [credentials, setCredentials] = useState<Record<string, boolean>>({});

  const workflowId = searchParams.get("id");
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

  useEffect(() => {
    if (!workflowId) return;

    async function fetchWorkflow() {
      try {
        const { data } = await axios.post(service_detail_api, { id: workflowId });
        setWorkflow(data.workflow);

        // Initialize empty states
        let initialInputs: Record<string, string> = {};
        data.workflow.requiredInputs?.forEach((inp: any) => {
          initialInputs[inp.key] = "";
        });
        setFormData(initialInputs);

        let initialCreds: Record<string, boolean> = {};
        data.workflow.requiredCredentials?.forEach((cred: any) => {
          initialCreds[cred.service] = false;
        });
        setCredentials(initialCreds);

      } catch (err) {
        console.error("Failed to fetch workflow detail:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [workflowId]);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleOAuthConnect = (service: string) => {
    toast.success(`${service} connected successfully! ✅`);
    setCredentials((prev) => ({ ...prev, [service]: true }));
    // NOTE: Yahan aapko apna actual OAuth flow trigger karna hoga
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to continue 🚀");
      return router.push("/login");
    }

    // Validation: sab required inputs fill huye?
    for (const input of workflow?.requiredInputs || []) {
      if (input.required && !formData[input.key]) {
        toast.error(`Please fill ${input.label}`);
        return;
      }
    }

    // Validation: sab required credentials connect huye?
    for (const cred of workflow?.requiredCredentials || []) {
      if (!credentials[cred.service]) {
        toast.error(`Please connect ${cred.label}`);
        return;
      }
    }

    // Final API call to start workflow
    try {
      toast.loading("Starting service...");
      const { data } = await axios.post(
        "/api/start-workflow",
        {
          workflowId,
          inputs: formData,
          credentials,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.dismiss();
      toast.success("Workflow started successfully 🎉");
      console.log("Started workflow:", data);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to start workflow ❌");
      console.error(err);
    }
  };

  if (loading) return <Loading_ />;

  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Start {workflow?.name}
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl">
          Please provide the required inputs and credentials to activate this service.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl flex flex-col gap-6"
      >
        {/* Dynamic Required Inputs */}
        {workflow?.requiredInputs?.map((inp, idx) => (
          <input
            key={idx}
            type={inp.type === "string" ? "text" : inp.type}
            placeholder={inp.placeholder || inp.label}
            value={formData[inp.key]}
            onChange={(e) => handleInputChange(inp.key, e.target.value)}
            className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ))}

        {/* Dynamic Required Credentials */}
        {workflow?.requiredCredentials?.map((cred, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/20">
            <span className="text-white/90">{cred.label} ({cred.service})</span>
            {credentials[cred.service] ? (
              <span className="text-green-400 font-semibold">Connected ✅</span>
            ) : (
              <button
                type="button"
                onClick={() => handleOAuthConnect(cred.service)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition"
              >
                Connect
              </button>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:from-secondary hover:to-primary"
        >
          Start Service
        </button>
      </motion.form>
    </section>
  );
}
