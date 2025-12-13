"use client";


import { home_service_api } from "@/api";
import { Workflow__ } from "@/app/admin/service/list/page";
import axios from "axios";
import { useEffect, useState } from "react";




export function useHomeServices() {
  const [services, setServices] = useState<Workflow__[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchServices() {
      try {
        const { data } = await axios.post(home_service_api);
        if (mounted) {
          setServices(data.workflows || []);
        }
      } catch (err) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
    return () => {
      mounted = false;
    };
  }, []);

  return { services, loading, error };
}
