"use client";

import { instance_create_api, service_detail_api } from "@/api";
import Loading_ from "@/components/Loading";
import { RootState } from "@/redux-store/redux_store";
import { ICredentialField, IRequiredCredential, IWorkflowDetail } from "@/types";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";

const allowedOrigins = [process.env.NEXT_PUBLIC_BACKEND_BASE_URL];


export default function StartFormPage() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("id");
  const token = useSelector((state: RootState) => state.user.token);

  const [workflow, setWorkflow] = useState<IWorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [instanceName, setInstanceName] = useState("");
  const [inputData, setInputData] = useState<Record<string, string>>({});
  const [credentialsData, setCredentialsData] = useState<Record<string, Record<string, string>>>({});

  const router  = useRouter()

  // Fetch workflow details
  useEffect(() => {
    if (!workflowId) return;

    async function fetchWorkflow() {
      try {
        const { data } = await axios.post(service_detail_api, { id: workflowId });
        const wf: IWorkflowDetail = data.workflow;
        setWorkflow(wf);

        // ✅ Initialize inputData with default values
        setInputData(
          Object.fromEntries(
            (wf.requiredInputs || []).filter((i) => i.key).map((i) => [i.key, i.defaultValue || ""])
          )
        );

        // ✅ Initialize credentialsData with default values and handle disabled fields
        const creds: Record<string, Record<string, string>> = {};
        (wf.requiredCredentials || []).forEach((cred) => {
          creds[cred.service] = {};
          (cred.fields || []).forEach((field) => {
            // ✅ Use default value if available, otherwise empty string
            creds[cred.service][field.name] = field.defaultValue || "";
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

  const handleOAuth2Connect = async (cred:IRequiredCredential) => {
    try {
      // 1️⃣ Dynamic scopes from the credential object
      const scopesParam = encodeURIComponent((cred.scopes || []).join(" "));

      // console.log('scopesParam', scopesParam)

      // 2️⃣ Fetch OAuth URL from backend, pass scopes
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/oauth/google?scopes=${scopesParam}`
      );

      const { url } = response.data;

      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // 3️⃣ Open OAuth popup
      const popup = window.open(
        url,
        `${cred.service} OAuth`,
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // 4️⃣ Listen for message from popup (FIXED VERSION)
      const handleMessage = (event: MessageEvent) => {
        if (!allowedOrigins.includes(event.origin)) return;

        const data = event.data;
        if (data.success) {
          setCredentialsData(prev => ({
            ...prev,
            [cred.service]: { // ✅ Now cred is accessible
              ...(prev[cred.service] || {}),
              oauthTokenData
                : data.oauthTokenData || "",
            }
          }));
          toast.success(`${cred.service} connected successfully!`);
        } else {
          toast.error(`${cred.service} OAuth failed.`);
        }

        window.removeEventListener("message", handleMessage);
      };

      window.addEventListener("message", handleMessage, false);

      // 5️⃣ Optional: Check if popup closed without authentication
      const checkPopupClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", handleMessage);
          // toast.info(`${cred.service} authentication window closed`);
        }
      }, 1000);

    } catch (err) {
      console.error("OAuth2 connection failed:", err);
      toast.error("Failed to connect with OAuth2 service.");
    }
  };

  // ✅ Validate required fields before submit
  const validateForm = () => {
    // Check instance name
    if (!instanceName.trim()) {
      toast.error("Please enter Instance Name");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      workflowId:workflow?._id,
      instanceName,
      inputs: Object.entries(inputData).map(([key, value]) => ({ key, value })),
      credentials: credentialsData
    };

    // console.log(payload)

  
    setFormLoading(true);
    try {
      const res = await axios.post(
        instance_create_api,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Automation instance created successfully!");
         setTimeout(()=>{   router.push( `/dashboard/automation-view?id=${res.data.automation._id}`)},1000)
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

  return (
    <section className="relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
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
        <div className="relative">
          <input
            type="text"
            placeholder="Instance Name *"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            className="w-full px-5 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
         
        </div>

        {/* Dynamic Required Inputs */}
        {workflow?.requiredInputs?.filter(inp => inp.key).map((inp, idx) => (
          <div key={idx} className="relative">
            <input
              type="text"
              placeholder={inp.label}
              value={inputData[inp.key] || ""}
              onChange={(e) => handleInputChange(inp.key, e.target.value)}
              className={`w-full px-5 py-2 rounded-xl border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary bg-white/20 border-white/30`}
            />
          </div>
        ))}

        {/* Dynamic Credentials */}
        {workflow?.requiredCredentials?.filter(cred => cred.service).map((cred, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-4 bg-white/5 p-6 rounded-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/90 font-semibold text-lg">
                {cred.label} ({cred.service})
              </span>

            </div>

            <div className="grid grid-cols-1 m gap-4">
              {(cred.fields || []).map((field: ICredentialField, fIdx) => {
                const fieldValue = credentialsData[cred.service]?.[field.name] || "";
                if (field.disabled) {
                  return
                } else {
                  return (
                    <div key={fIdx} className="relative">
                      <input
                        type={field.inputType === "password" ? "password" : "text"}
                        placeholder={`${field.label} *`}
                        value={fieldValue}
                        required={field.require ? true : false}
                        onChange={(e) =>
                          handleCredentialChange(cred.service, field.name, e.target.value)
                        }
                        disabled={field.disabled}
                        className={`w-full px-5 py-2 rounded-xl border text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary bg-white/20 border-white/30 `}
                      />
                    </div>
                  );
                }
              })}
            </div>

            {/* OAuth2 Connect Button */}
            {cred.credentialType?.toLowerCase().includes("oauth2") && (
              <button
                type="button"
                title={`Click to connect your ${cred.label}`}
                className="px-4 py-2 flex justify-center items-center gap-2 text-sm self-start rounded-full bg-white text-secondary font-normal hover:shadow-lg transition "
                onClick={() => handleOAuth2Connect(cred)}
              >
               <FcGoogle className="w-4 h-4" />
                <span>Connect {cred.label}</span>
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-center items-center mt-6">
          <button
            type="submit"
            disabled={formLoading}
            className="px-20 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition hover:from-secondary hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formLoading ? "Processing..." : "Continue"}
          </button>
        </div>

      </motion.form>
    </section>
  );
}