"use client"

import jsPDF from "jspdf"
import "jspdf-autotable"
import { FiDownload } from "react-icons/fi"

type PaymentLog = {
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  note?: string
  changedAt: string
}

type Payment = {
  _id: string
  orderId: string
  user: {
    name: string
    email: string
    profile?: {
      address?: string
      company?: string
      phoneNumber?: string
    }
  }
  instanceId: {
    instanceName: string
    _id:string
  }
  subscriptionMonths: number
  planDetails: {
    name: string
    duration: number
    price: number
    discountPercentage: number
  }
  amountDetails: {
    baseAmount: number
    discountAmount: number
    taxAmount: number
    totalAmount: number
  }
  currency: "INR" | "USD"
  paymentMethod: "card" | "upi" | "netbanking" | "wallet" | "manual" | "internal"
  period?: {
    startDate?: string
    endDate?: string
  }
  status: "pending" | "success" | "failed" | "refunded" | "cancelled"
  note?: string
  Log?: PaymentLog[]
  createdAt: string
  updatedAt: string
}

interface DownloadInvoiceProps {
  payment: Payment
}

export default function DownloadInvoice({ payment }: DownloadInvoiceProps) {
  const handleDownloadInvoice = () => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text("Invoice", 14, 20)

    // Customer Info
    doc.setFontSize(12)
    doc.text(`Customer: ${payment.user.name}`, 14, 30)
    doc.text(`Email: ${payment.user.email}`, 14, 36)
    if (payment.user.profile?.company) doc.text(`Company: ${payment.user.profile.company}`, 14, 42)
    if (payment.user.profile?.address) doc.text(`Address: ${payment.user.profile.address}`, 14, 48)
    if (payment.user.profile?.phoneNumber) doc.text(`Phone: ${payment.user.profile.phoneNumber}`, 14, 54)

    // Payment Info
    doc.text(`Order ID: ${payment.orderId}`, 14, 64)
    doc.text(`Instance: ${payment.instanceId.instanceName}`, 14, 70)
    doc.text(`Payment Method: ${payment.paymentMethod}`, 14, 76)
    doc.text(`Status: ${payment.status}`, 14, 82)
    doc.text(`Created At: ${new Date(payment.createdAt).toLocaleString()}`, 14, 88)
    if (payment.period?.startDate && payment.period?.endDate)
      doc.text(
        `Subscription Period: ${new Date(payment.period.startDate).toLocaleDateString()} - ${new Date(payment.period.endDate).toLocaleDateString()}`,
        14,
        94
      )

    // Plan Details Table
    const planColumns = ["Plan Name", "Duration (Months)", "Price", "Discount %"]
    const planRows = [[
      payment.planDetails.name,
      payment.planDetails.duration.toString(),
      payment.planDetails.price.toFixed(2),
      payment.planDetails.discountPercentage.toString()
    ]]
    ;(doc as any).autoTable({
      head: [planColumns],
      body: planRows,
      startY: 104,
      theme: "grid",
    })

    // Amount Breakdown Table
    const startY = (doc as any).lastAutoTable?.finalY + 10 || 130
    const amountColumns = ["Base Amount", "Discount", "Tax", "Total Amount"]
    const amountRows = [[
      payment.amountDetails.baseAmount.toFixed(2),
      payment.amountDetails.discountAmount.toFixed(2),
      payment.amountDetails.taxAmount.toFixed(2),
      payment.amountDetails.totalAmount.toFixed(2)
    ]]
    ;(doc as any).autoTable({
      head: [amountColumns],
      body: amountRows,
      startY,
      theme: "grid",
    })

    // Optional Payment Log
    if (payment.Log && payment.Log.length > 0) {
      const logStartY = (doc as any).lastAutoTable?.finalY + 10 || startY + 50
      doc.text("Payment Log:", 14, logStartY)
      const logColumns = ["Status", "Note", "Changed At"]
      const logRows = payment.Log.map(log => [
        log.status,
        log.note || "-",
        new Date(log.changedAt).toLocaleString()
      ])
      ;(doc as any).autoTable({
        head: [logColumns],
        body: logRows,
        startY: logStartY + 6,
        theme: "grid",
      })
    }

    doc.save(`invoice_${payment.orderId}.pdf`)
  }

  return (
    <button
      onClick={handleDownloadInvoice}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
    >
      <FiDownload size={18} />
      Download Invoice
    </button>
  )
}
