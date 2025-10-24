"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { FiSave, FiList } from "react-icons/fi";
import { admin_get_payment_dtails_api, admin_payment_edit_api } from "@/api";
import toast from "react-hot-toast";
import LoadingSpiner from "../../_components/LoadingSpiner";
import Link from "next/link";
import { ILogItem, IPaymentDetails } from "@/types";

interface PaymentFormData {
  paymentMethod: string;
  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  note: ''
}



export default function PaymentUpdatePage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails | null>(null);
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: "",
    status: "pending",
    note: ''
  });

  const token = useSelector((state: RootState) => state.user.token);

  const fetchPaymentDetails = async () => {
    if (!token || !paymentId) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        admin_get_payment_dtails_api,
        { id: paymentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setPaymentDetails(data.payment);
        setFormData({
          paymentMethod: data.payment.paymentMethod,
          status: data.payment.status,
          note:data.payment.note
        });
      }
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
      toast.error("Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!paymentId) return;

  try {
    setUpdating(true);

    const { data } = await axios.post(
      admin_payment_edit_api, // replace with your API route
      {
        id: paymentId,
        ...formData
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success("Payment updated successfully");
      setTimeout(()=>{
        window.location.reload()
      },500)
    } else {
      toast.error(data.message || "Failed to update payment");
    }
  } catch (err: any) {
    console.error("Failed to update payment:", err);
    toast.error(err.response?.data?.message || "Failed to update payment");
  } finally {
    setUpdating(false);
  }
};


  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, token]);

  if (loading) return <LoadingSpiner />;

  if (!paymentDetails) {
    return (
      <div className="max-w-4xl mx-auto pb-28 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-600">Payment not found</h2>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto pb-28 px-4">
      {/* Header */}
      <div className="mb-6">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">

            Payment Details
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-base">{paymentDetails.orderId}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">User Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{paymentDetails.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 ">Email</p>
                <Link href={`/admin/user/view?id=${paymentDetails.user._id}`} className=" hover:underline font-medium">{paymentDetails.user.email}</Link>
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Amount Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Base Amount:</span>
                <span className="font-medium">{paymentDetails.currency} {paymentDetails.amountDetails.baseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Discount:</span>
                <span className="font-medium text-green-600">-{paymentDetails.currency} {paymentDetails.amountDetails.discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tax:</span>
                <span className="font-medium">+{paymentDetails.currency} {paymentDetails.amountDetails.taxAmount}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-green-600">
                  {paymentDetails.currency} {paymentDetails.amountDetails.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">Subscription Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-medium">{paymentDetails.planDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{paymentDetails.subscriptionMonths} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Automation</p>
                <Link href={`/admin/automation/viewedit?id=${paymentDetails.instanceId._id}`} className="font-medium">{paymentDetails.instanceId.instanceName}</Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Period</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">
                  {new Date(paymentDetails.period.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">
                  {new Date(paymentDetails.period.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium">
                  {new Date(paymentDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="border border-gray-200 rounded-md p-4 mt-6 bg-gray-50">
          <h3 className="text-md font-semibold text-gray-700 mb-3">Payment Activity Log</h3>

          {paymentDetails.Log && paymentDetails.Log.length > 0 ? (
            <div className="space-y-2">
              {paymentDetails.Log.map((item:ILogItem, i) => (
                <div key={i} className="border-b border-gray-200 pb-2 last:border-b-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">{item.status}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.changedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{item.note}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No activity logs available</p>
          )}
        </div>
      </div>

      {/* Update Form */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Update Payment Status</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Note */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Note
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Optional note for admin"
              ></textarea>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Link
                href="/admin/billing"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex items-center gap-2 text-sm"
              >
                <FiList size={16} />
                Go to List
              </Link>

             
            </div>

            <div className="flex gap-3 ml-auto">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center gap-2 text-sm disabled:opacity-50"
              >
                <FiSave size={16} />
                {updating ? "Updating..." : "Update Payment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}