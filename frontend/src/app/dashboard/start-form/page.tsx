"use client";

import { instance_create_api, service_detail_api } from "@/api";
import { WorkflowDetail } from "@/app/admin/service/view/page";
import Loading_ from "@/components/Loading";
import { RootState } from "@/redux-store/redux_store";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const allowedOrigins = [process.env.NEXT_PUBLIC_BACKEND_BASE_URL];

export default function StartFormPage() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("id");
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [instanceName, setInstanceName] = useState("");
  const [inputData, setInputData] = useState<Record<string, string>>({});
  const [credentialsData, setCredentialsData] = useState<Record<string, Record<string, string>>>({});

  // Fetch workflow details
  useEffect(() => {
    if (!workflowId) return;

    async function fetchWorkflow() {
      try {
        const { data } = await axios.post(service_detail_api, { id: workflowId });
        const wf: WorkflowDetail = data.workflow;
        setWorkflow(wf);

        // Initialize inputData
        setInputData(
          Object.fromEntries(
            (wf.requiredInputs || []).filter((i) => i.key).map((i) => [i.key, ""])
          )
        );

        // Initialize credentialsData as nested object
        const creds: Record<string, Record<string, string>> = {};
        (wf.requiredCredentials || []).forEach((cred) => {
          creds[cred.service] = {};
          (cred.fields || []).forEach((field) => {
            creds[cred.service][field.name] = "";
          });
        });
        setCredentialsData(creds);

      } catch (err) {
        console.error("Failed to fetch workflow:", err);
        toast.error("Failed to load workflow details.");
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflow();
  }, [workflowId]);

  // Handlers
  const handleInputChange = (key: string, value: string) => {
    setInputData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCredentialChange = (service: string, fieldName: string, value: string) => {
    setCredentialsData(prev => ({
      ...prev,
      [service]: {
        ...(prev[service] || {}),
        [fieldName]: value
      }
    }));
  };

  const handleOAuth2Connect = async (cred) => {
    try {
      // 1️⃣ Dynamic scopes from the credential object
      const scopesParam = encodeURIComponent((cred.scopes || []).join(" "));

      // 2️⃣ Fetch OAuth URL from backend, pass scopes
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/oauth/google?scopes=${scopesParam}`
      );

      const { url } = response.data;

      console.log(url)

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // 3️⃣ Open OAuth popup
      window.open(
        url,
        `${cred.service} OAuth`,
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // 4️⃣ Listen for message from popup
      const handleMessage = (event: MessageEvent) => {
        if (!allowedOrigins.includes(event.origin)) return;

        const data = event.data;
        if (data.success) {
          setCredentialsData(prev => ({
            ...prev,
            [cred.service]: {
              ...(prev[cred.service] || {}),
              accessToken: data.accessToken || "",
              refreshToken: data.refreshToken || "",
              clientId: data.clientId || "",
              clientSecret: data.clientSecret || ""
            }
          }));
          toast.success(`${cred.service} connected successfully!`);
        } else {
          toast.error(`${cred.service} OAuth failed.`);
        }

        window.removeEventListener("message", handleMessage);
      };

      window.addEventListener("message", handleMessage, false);
    } catch (err) {
      console.error("OAuth2 connection failed:", err);
      toast.error("Failed to connect with OAuth2 service.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workflowId || !instanceName) {
      toast.error("Please fill all required fields.");
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        workflowId,
        instanceName,
        inputs: Object.entries(inputData).map(([key, value]) => ({ key, value })),
        credentials: credentialsData 
      };

      // console.log("Submitting payload:", payload);

      const res = await axios.post(
        instance_create_api,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Automation instance Create successfully!");
        // router.push("/user/dashboard");
      } else {
        toast.error("Failed to start automation.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error starting automation.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Loading_ />;


  // console.log(credentialsData)

  return (
    <section className="relative">
      {/* Header */}
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
          Provide the required inputs and credentials to start this service.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-xl m-auto max-w-3xl flex flex-col gap-6"
      >
        {/* Instance Name */}
        <input
          type="text"
          placeholder="Instance Name"
          value={instanceName}
          onChange={(e) => setInstanceName(e.target.value)}
          className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />

        {/* Dynamic Required Inputs */}
        {workflow?.requiredInputs?.filter(inp => inp.key).map((inp, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={inp.label}
            value={inputData[inp.key] || ""}
            onChange={(e) => handleInputChange(inp.key, e.target.value)}
            className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ))}

        {/* Dynamic Credentials */}
        {workflow?.requiredCredentials?.filter(cred => cred.service).map((cred, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 bg-white/5 p-4 rounded-xl border border-white/20"
          >
            <span className="text-white/90 font-semibold mb-2">
              {cred.label} ({cred.service})
            </span>

            {(cred.fields || []).map((field, fIdx) => {
              return (
                <input
                  key={fIdx}
                  type={field.inputType === "token" ? "text" : field.inputType}
                  placeholder={field.label}
                  value={credentialsData[cred.service]?.[field.name] || ""}
                  onChange={(e) =>
                    handleCredentialChange(cred.service, field.name, e.target.value)
                  }
                  className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              );
            })}

            {/* OAuth2 Connect Button */}
            {cred.inputType?.toLowerCase().includes("oauth2") && (
              <button
                type="button"
                className="px-5 py-2 rounded-full bg-white text-secondary font-semibold hover:shadow-lg transition"
                onClick={() => handleOAuth2Connect(cred)}
              >
                Connect {cred.label}
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-center items-center">
          <button
            type="submit"
            disabled={formLoading}
            className="px-20 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:from-secondary hover:to-primary"
          >
            {formLoading ? "Processing..." : "Continue"}
          </button>
        </div>
      </motion.form>
    </section>
  );
}
