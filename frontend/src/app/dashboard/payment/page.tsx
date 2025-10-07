"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheck, FiCreditCard, FiShield, FiInfo, FiCalendar, FiTag, FiDollarSign } from "react-icons/fi";
import Link from "next/link";
import { payment_create_request_api, payment_details_request_api } from "@/api";
import toast from "react-hot-toast";
import { IUser } from "@/types";

// Subscription plan types
type SubscriptionPlan = {
  id: string;
  name: string;
  duration: number; // in months
  price: number;
  totalPrice: number;
  savings?: number;
  savingsPercentage?: number;
  popular?: boolean;
  features: string[];
};

type AutomationDetail = {
  _id: string;
  instanceName: string;
  masterWorkflow: {
    _id: string;
    name: string;
    serviceImage?: string;
    pricePerMonth: number;
    currency: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

type AmountDetails = {
  baseAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  subtotal: number;
  taxPercentage: number;
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const instanceId = searchParams.get("id");
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;

  const [selectedPlan, setSelectedPlan] = useState<string | null>("1");
  const [loading, setLoading] = useState(false);
  const [automation, setAutomation] = useState<AutomationDetail | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [amountDetails, setAmountDetails] = useState<AmountDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");

  // Calculate amounts when plan changes
  useEffect(() => {
    if (!selectedPlan || !automation || subscriptionPlans.length === 0) return;

    const selectedPlanData = subscriptionPlans.find(p => p.id === selectedPlan);
    if (!selectedPlanData) return;

    const monthlyPrice = automation.masterWorkflow.pricePerMonth;
    const baseAmount = monthlyPrice * selectedPlanData.duration;
    const discountAmount = selectedPlanData.savings || 0;
    const subtotal = baseAmount - discountAmount;
    const taxPercentage = 18; // 18% GST
    const taxAmount = Math.round((subtotal * taxPercentage) / 100);
    const totalAmount = subtotal + taxAmount;

    setAmountDetails({
      baseAmount,
      discountAmount,
      taxAmount,
      totalAmount,
      subtotal,
      taxPercentage
    });
  }, [selectedPlan, automation, subscriptionPlans]);

  useEffect(() => {
    if (!instanceId || !token) return;

    async function fetchAutomation() {
      try {
        const { data } = await axios.post(
          payment_details_request_api,
          { id: instanceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAutomation(data.automation);

        // Generate subscription plans based on masterWorkflow pricing
        const monthlyPrice = data.automation.masterWorkflow.pricePerMonth;
        const currency = data.automation.masterWorkflow.currency;

        // Common features for all plans
        const commonFeatures = [
          "Automation access",
          "Priority support",
          "Standard execution limits",
          "Email notifications",
          "Cancel anytime",
          "Instant activation"
        ];

        const plans: SubscriptionPlan[] = [
          {
            id: "1",
            name: "1 Month",
            duration: 1,
            price: monthlyPrice,
            totalPrice: monthlyPrice,
            features: commonFeatures
          },
          {
            id: "3",
            name: "3 Months",
            duration: 3,
            price: monthlyPrice,
            totalPrice: monthlyPrice * 3 * 0.95, // 5% discount
            savings: monthlyPrice * 3 * 0.05,
            savingsPercentage: 5,
            features: commonFeatures
          },
          {
            id: "6",
            name: "6 Months",
            duration: 6,
            price: monthlyPrice,
            totalPrice: monthlyPrice * 6 * 0.90, // 10% discount
            savings: monthlyPrice * 6 * 0.10,
            savingsPercentage: 10,
            popular: true,
            features: commonFeatures
          },
          {
            id: "9",
            name: "9 Months",
            duration: 9,
            price: monthlyPrice,
            totalPrice: monthlyPrice * 9 * 0.85, // 15% discount
            savings: monthlyPrice * 9 * 0.15,
            savingsPercentage: 15,
            features: commonFeatures
          },
          {
            id: "12",
            name: "12 Months",
            duration: 12,
            price: monthlyPrice,
            totalPrice: monthlyPrice * 12 * 0.80, // 20% discount
            savings: monthlyPrice * 12 * 0.20,
            savingsPercentage: 20,
            features: commonFeatures
          }
        ];

        setSubscriptionPlans(plans);
      } catch (error) {
        console.error("Failed to fetch automation details:", error);
        toast.error("Failed to load automation details");
      }
    }

    fetchAutomation();
  }, [instanceId, token]);

  const handlePayment = async () => {
    if (!selectedPlan || !instanceId || !token || !automation || !amountDetails) return;

    if (!user?.profile?.phoneNumber) {
      toast.error('Please add your phone number. Redirecting...')
      setTimeout(() => {
        router.push('/dashboard/profile-edit')
      }, 2000)
      return
    }

    setLoading(true);
    try {
      const selectedPlanData = subscriptionPlans.find(p => p.id === selectedPlan);
      
      if (!selectedPlanData) {
        toast.error("Invalid plan selected");
        return;
      }

      const planDetails = {
        name: selectedPlanData.name,
        duration: selectedPlanData.duration,
        discountPercentage: selectedPlanData.savingsPercentage || 0,
        monthlyPrice: automation.masterWorkflow.pricePerMonth
      };

      // Call payment API
      const response = await axios.post(
        payment_create_request_api,
        {
          instanceId: instanceId,
          subscriptionMonths: selectedPlanData.duration,
          planDetails: planDetails,
          amountDetails: amountDetails,
          currency: automation.masterWorkflow.currency,
          paymentMethod: paymentMethod
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        toast.success("Payment request created successfully!");
        setTimeout(()=>{
          router.push("/dashboard/billing");
        },2000)
      }
    } catch (error: any) {
      console.error("Payment creation error:", error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || "Payment request failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "INR") => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!automation) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-28 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/10"
      >
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-gray-400 mb-4">
            Activate your automation: <strong>{automation.instanceName}</strong>
          </p>

          {/* Automation Info Card */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  Base price: {formatCurrency(automation.masterWorkflow.pricePerMonth, automation.masterWorkflow.currency)}/month
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Select your preferred subscription duration
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Status</p>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                  Payment Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans - 5 columns for larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -3 }}
              className={`relative rounded-xl p-4 border-2 transition-all cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 bg-white/5"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-2xl font-bold">
                    {formatCurrency(plan.totalPrice, automation.masterWorkflow.currency)}
                  </span>
                </div>

                {plan.duration > 1 && (
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs">
                      {formatCurrency(plan.totalPrice / plan.duration, automation.masterWorkflow.currency)}/month
                    </p>
                    {plan.savings && (
                      <p className="text-green-400 text-xs font-semibold">
                        Save {plan.savingsPercentage}%
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedPlan === plan.id
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {selectedPlan === plan.id ? "Selected" : "Select"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Payment Method Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10"
        >
          <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "upi", name: "UPI", icon: "💸" },
              { id: "card", name: "Credit Card", icon: "💳" },
              { id: "netbanking", name: "Net Banking", icon: "🏦" },
              { id: "wallet", name: "Wallet", icon: "👛" }
            ].map((method) => (
              <div
                key={method.id}
                className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  paymentMethod === method.id 
                    ? "border-blue-500 bg-blue-500/10" 
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="font-semibold">{method.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Amount Breakdown */}
        {amountDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10"
          >
            <h3 className="text-xl font-bold mb-4">Amount Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-gray-400" />
                  <span>Base Amount</span>
                </div>
                <span>{formatCurrency(amountDetails.baseAmount, automation.masterWorkflow.currency)}</span>
              </div>
              
              {amountDetails.discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-400">
                  <div className="flex items-center gap-2">
                    <FiTag className="text-green-400" />
                    <span>Discount</span>
                  </div>
                  <span>-{formatCurrency(amountDetails.discountAmount, automation.masterWorkflow.currency)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-gray-400" />
                  <span>Subtotal</span>
                </div>
                <span>{formatCurrency(amountDetails.subtotal, automation.masterWorkflow.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiInfo className="text-gray-400" />
                  <span>GST ({amountDetails.taxPercentage}%)</span>
                </div>
                <span>+{formatCurrency(amountDetails.taxAmount, automation.masterWorkflow.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-white/10 pt-3 text-lg font-bold">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-blue-400" />
                  <span>Total Amount</span>
                </div>
                <span className="text-blue-400">
                  {formatCurrency(amountDetails.totalAmount, automation.masterWorkflow.currency)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <p className="text-gray-400 text-sm">
                  {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan • 
                  Payment via {paymentMethod.toUpperCase()}
                </p>
                {subscriptionPlans.find(p => p.id === selectedPlan)?.savings && (
                  <p className="text-green-400 text-sm mt-1">
                    You save {formatCurrency(
                      subscriptionPlans.find(p => p.id === selectedPlan)?.savings || 0,
                      automation.masterWorkflow.currency
                    )} ({subscriptionPlans.find(p => p.id === selectedPlan)?.savingsPercentage}% discount)
                  </p>
                )}
              </div>
              <div className="text-center sm:text-right">
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    amountDetails?.totalAmount || 0,
                    automation.masterWorkflow.currency
                  )}
                </p>
                <p className="text-gray-400 text-sm">
                  {subscriptionPlans.find(p => p.id === selectedPlan)?.duration} month{
                    subscriptionPlans.find(p => p.id === selectedPlan)?.duration === 1 ? '' : 's'
                  } access
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Section - Same for all plans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10"
        >
          <h3 className="text-xl font-bold mb-4 text-center">All plans include:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans[0]?.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <FiCheck className="text-green-400 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Security & Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <FiShield className="text-green-400" size={20} />
            <span>Secure SSL Encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <FiCreditCard className="text-blue-400" size={20} />
            <span>Multiple Payment Methods</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <FiCalendar className="text-purple-400" size={20} />
            <span>Instant Activation</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-white/10">
          <Link
            href={`/dashboard/automation-view?id=${instanceId}`}
            className="px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white hover:text-primary transition"
          >
            Back to Automation
          </Link>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <span className="text-gray-400 text-sm text-center">
              {selectedPlan
                ? `Selected: ${subscriptionPlans.find((p) => p.id === selectedPlan)?.name} Plan`
                : "Please select a duration"}
            </span>

            <button
              onClick={handlePayment}
              disabled={!selectedPlan || loading}
              className="px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                `Pay Now - ${formatCurrency(
                  amountDetails?.totalAmount || 0,
                  automation.masterWorkflow.currency
                )}`
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}