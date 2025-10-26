"use client"

import { get_invoice_download_api } from "@/api"
import { RootState } from "@/redux-store/redux_store"
import axios from "axios"
import toast from "react-hot-toast"
import { FiDownload } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useState } from "react"

interface DownloadInvoiceProps {
  payments: string
}

export default function DownloadInvoice({ payments }: DownloadInvoiceProps) {
  const token = useSelector((state: RootState) => state.user.token)
  const [loading, setLoading] = useState(false)

  const handleDownloadInvoice = async () => {
    if (!payments) return
    
    setLoading(true)
    try {
      const { data } = await axios.post(
        get_invoice_download_api,
        { paymentId: payments }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      
      toast.success(data.message)
    } catch {
      toast.error("Invoice download Create Error!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownloadInvoice}
      disabled={loading}
      className={`rounded-full py-2 px-8 bg-gradient-to-r from-primary to-secondary text-white font-normal shadow-lg hover:shadow-xl transition duration-300 hover:from-secondary hover:to-primary flex gap-1 justify-center items-center `}
    >
      {loading ? (
        <>
          Downloading...
        </>
      ) : (
        <>
          <FiDownload size={18} />
          Download Invoice
        </>
      )}
    </button>
  )
}