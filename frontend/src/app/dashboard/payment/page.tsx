"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { FiRefreshCw, FiLock, FiCheckCircle, FiCheck, FiInfo } from "react-icons/fi";

import {
  payment_create_request_api,
  payment_details_request_api,
} from "@/api";
import toast from "react-hot-toast";
import { IUser } from "@/types";
import LoadingSpiner from "@/app/admin/_components/LoadingSpiner";

/* ================= TYPES ================= */

type AutomationDetail = {
  _id: string;
  instanceName: string;
  masterWorkflow: {
    _id: string;
    name: string;
    currency: string;
    pricingPlans: {
      planName: string;
      monthlyPrice: number;
      usageLimit:number;
      discountPercent?: number;
      features: string[];
    }[];
  };
};

type SubscriptionPlan = {
  id: string;
  name: string;
  usageLimit:number;
  monthlyPrice: number;
  discountPercent: number;
  features: string[];
};

type AmountDetails = {
  baseAmount: number;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  taxPercentage: number;
};

/* ================= COMPONENT ================= */

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const instanceId = searchParams.get("id");
  const router = useRouter();

  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;

  const [loading, setLoading] = useState(false);
  const [automation, setAutomation] =
    useState<AutomationDetail | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [amountDetails, setAmountDetails] =
    useState<AmountDetails | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number>(1);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!instanceId || !token) return;

    async function fetchDetails() {
      try {
        const { data } = await axios.post(
          payment_details_request_api,
          { id: instanceId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAutomation(data.automation);

        const plans: SubscriptionPlan[] =
          data.automation.masterWorkflow.pricingPlans
            .filter((p: any) => p.planName !== "TRIAL")
            .map((p: any) => ({
              id: p.planName,
              name: p.planName,
              usageLimit:p.usageLimit,
              monthlyPrice: p.monthlyPrice,
              discountPercent: p.discountPercent || 0,
              features: p.features || [],
            }));

        setSubscriptionPlans(plans);
        setSelectedPlan(plans[0]?.id || null);
      } catch (error) {
        console.log(error)
        toast.error("Failed to load payment details", );
      }
    }

    fetchDetails();
  }, [instanceId, token]);

  /* ================= AMOUNT CALCULATION ================= */

  useEffect(() => {
    if (!selectedPlan) return;

    const plan = subscriptionPlans.find(
      (p) => p.id === selectedPlan
    );
    if (!plan) return;

    const baseAmount = plan.monthlyPrice * selectedMonths;
    const discountAmount = Math.round(
      (baseAmount * plan.discountPercent) / 100
    );
    const subtotal = baseAmount - discountAmount;
    const taxPercentage =
      Number(process.env.NEXT_PUBLIC_TAX_PARCENTAGE) || 18;
    const taxAmount = Math.round(
      (subtotal * taxPercentage) / 100
    );

    setAmountDetails({
      baseAmount,
      discountAmount,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      taxPercentage,
    });
  }, [selectedPlan, selectedMonths, subscriptionPlans]);

  /* ================= PAYMENT ================= */

 const handlePayment = async () => {
  if (!selectedPlan || !automation || !amountDetails) return;

  if (!user?.profile?.phoneNumber) {
    toast.error("Please add your phone number");
    router.push("/dashboard/profile-edit");
    return;
  }

  const plan = subscriptionPlans.find(
    (p) => p.id === selectedPlan
  );
  if (!plan) return;

  setLoading(true);

  try {
    const payload = {
      instanceId,
      subscriptionMonths: selectedMonths,

      planDetails: {
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        months: selectedMonths,
        discountPercentage: plan.discountPercent,
      },

      amountDetails: {
        baseAmount: amountDetails.baseAmount,
        discountAmount: amountDetails.discountAmount,
        subtotal: amountDetails.subtotal,
        taxPercentage: amountDetails.taxPercentage,
        taxAmount: amountDetails.taxAmount,
        totalAmount: amountDetails.totalAmount,
      },
    };

    // ✅ optional debug (safe)
    // console.log("PAYMENT PAYLOAD 👉", payload);

    const { data } = await axios.post(
      payment_create_request_api,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Payment request created successfully");

    router.push(
      `/dashboard/billing/view?id=${data.data.paymentId}`
    );
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Payment failed"
    );
  } finally {
    setLoading(false);
  }
};


  /* ================= HELPERS ================= */

  const formatCurrency = (amount: number, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  if (!automation) return <LoadingSpiner />;

  const plan = subscriptionPlans.find(
    (p) => p.id === selectedPlan
  );

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl pt-5 mx-auto px-6 ">
      <h1 className="text-3xl font-bold mb-6">
        Complete Your Subscription
      </h1>

     <div className="grid md:grid-cols-3 gap-4 mb-6">
  {subscriptionPlans.map((p) => (
    <div
      key={p.id}
      onClick={() => setSelectedPlan(p.id)}
      className={`
        relative
        border rounded-xl p-4 cursor-pointer
        transition
        ${selectedPlan === p.id
          ? "border-primary bg-primary/5"
          : "border-textLight/30 dark:border-textDark/30"
        }
      `}
    >
      <h3 className="font-bold mb-2 text-textLight dark:text-textDark">
        {p.name}
      </h3>

      <p className="text-xl font-bold text-textLight dark:text-textDark">
        {formatCurrency(p.monthlyPrice)}
        <span className="text-sm font-normal text-textLight/60 dark:text-textDark/60">
          /month
        </span>
      </p>

      {p.discountPercent > 0 && (
        <p className="text-green-600 text-sm mt-1">
          {p.discountPercent}% OFF
        </p>
      )}

      {/* Usage Limit with Info */}
      <div className='absolute top-2 right-2 z-10'>
        

        {/* INFO TOOLTIP */}
        <div className="relative group">
          <FiInfo size={14} className="cursor-pointer" />

          <div
            className="
              absolute z-20 right-2 mt-2
              w-48
              rounded-lg px-3 py-2 text-xs
              bg-darkBg text-textDark
              opacity-0 group-hover:opacity-100
              transition-opacity
              pointer-events-none
              shadow-lg
            "
          >
            <span>{p.usageLimit}</span> Usage Limit, resets every billing cycle.  
            Fair usage policy applies.
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      {plan && (
        <div
          className="
      rounded-2xl p-5 mb-6
      bg-lightBg/70 dark:bg-darkBg/70
      border border-textLight/10 dark:border-textDark/10
    "
        >
          <h3
            className="
        text-lg font-semibold mb-4
        text-textLight uppercase dark:text-textDark
      "
          >
            {plan.name} Features
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            {plan.features.map((feature, index) => (
              <div
                key={index}
                className="
            flex items-center gap-3 text-sm
            text-textLight/80 dark:text-textDark/80
          "
              >
                <FiCheck className="text-primary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* MONTHS */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Select Duration</h3>
        <div className="flex gap-3 md:gap-5 justify-center flex-wrap">
          {[1, 3, 6, 12, 18, 24].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonths(m)}
              className={`px-4 py-2 rounded-full border ${selectedMonths === m
                ? "bg-primary text-white"
                : ""
                }`}
            >
              {m} Month{m > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      {amountDetails && plan && (
        <div
          className="
      rounded-2xl p-5 mb-6 shadow-sm
      bg-lightBg/80 dark:bg-darkBg/80
      border border-textLight/10 dark:border-textDark/10
    "
        >
          <h3
            className="
        text-lg font-semibold mb-4
        text-textLight dark:text-textDark
      "
          >
            Payment Summary
          </h3>

          <div className="space-y-3 text-sm">
            {/* Monthly Price */}
            <div className="flex justify-between text-textLight/80 dark:text-textDark/80">
              <span>Base Price (per month)</span>
              <span>{formatCurrency(plan.monthlyPrice)}</span>
            </div>

            {/* Duration */}
            <div className="flex justify-between text-textLight/80 dark:text-textDark/80">
              <span>Duration</span>
              <span>
                {selectedMonths} Month{selectedMonths > 1 ? "s" : ""}
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between text-textLight/80 dark:text-textDark/80">
              <span>
                Subtotal
                <span className="text-xs text-textLight/50 dark:text-textDark/50 ml-1">
                  ({formatCurrency(plan.monthlyPrice)} × {selectedMonths})
                </span>
              </span>
              <span>{formatCurrency(amountDetails.baseAmount)}</span>
            </div>

            {/* Discount */}
            {plan.discountPercent > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount ({plan.discountPercent}%)</span>
                <span>
                  -{formatCurrency(amountDetails.discountAmount)}
                </span>
              </div>
            )}

            {/* After Discount */}
            <div
              className="
          flex justify-between pt-2
          border-t border-textLight/10 dark:border-textDark/10
          text-textLight/80 dark:text-textDark/80
        "
            >
              <span>Amount after Discount</span>
              <span>{formatCurrency(amountDetails.subtotal)}</span>
            </div>

            {/* GST */}
            <div className="flex justify-between text-textLight/80 dark:text-textDark/80">
              <span>GST ({amountDetails.taxPercentage}%)</span>
              <span>
                +{formatCurrency(amountDetails.taxAmount)}
              </span>
            </div>

            {/* Total */}
            <div
              className="
          flex justify-between pt-3 text-base font-bold
          border-t border-textLight/10 dark:border-textDark/10
          text-textLight dark:text-textDark
        "
            >
              <span>Total Payable</span>
              <span className="text-primary">
                {formatCurrency(amountDetails.totalAmount)}
              </span>
            </div>
          </div>

          {/* Trust Note */}
        <p
  className="
    text-xs mt-4
    text-textLight/50 dark:text-textDark/50
  "
>
  💡 One-time payment for {selectedMonths} month
  {selectedMonths > 1 ? "s" : ""}.  
  No auto-renewal or hidden charges.
</p>
        </div>
      )}



      {/* PAY SECTION */}
      <div
        className="
    flex flex-col sm:flex-row
    items-center px-2 justify-between gap-4
    mt-6
  "
      >
        {/* LEFT: TOTAL AMOUNT */}
        <div className="text-center sm:text-left">
          <p
            className="
        text-sm
        text-textLight/60 dark:text-textDark/60
      "
          >
            Total Payable
          </p>
          <p
            className="
        text-2xl font-bold
        text-primary
      "
          >
            {formatCurrency(amountDetails?.totalAmount || 0)}
          </p>
        </div>

        {/* RIGHT: PAY BUTTON */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="
      px-8 py-3 rounded-full font-semibold
      bg-primary text-white
      hover:bg-secondary
      transition-colors
      disabled:opacity-60 disabled:cursor-not-allowed
      flex items-center gap-2
    "
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>




      {/* TRUST & SAFETY */}
      <div
        className="
    mt-28
    border rounded-2xl p-6
    bg-lightBg/60 dark:bg-darkBg/60
    border-textLight/10 dark:border-textDark/10
  "
      >
        <div className="grid gap-5 sm:grid-cols-3 text-sm">

          {/* Cancel Anytime */}
          <div className="flex items-start gap-3">
            <FiRefreshCw className="text-primary  mt-0.5" size={28} />
            <div>
              <p className="font-semibold text-textLight dark:text-textDark">
                Cancel Anytime
              </p>
              <p className="text-textLight/60 dark:text-textDark/60">
                Manage or cancel your plan anytime.
              </p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex items-start gap-3">
            <FiLock className="text-primary mt-0.5" size={28} />
            <div>
              <p className="font-semibold text-textLight dark:text-textDark">
                Secure Payments
              </p>
              <p className="text-textLight/60 dark:text-textDark/60">
                Encrypted payments via trusted gateways.
              </p>
            </div>
          </div>

          {/* Transparent Pricing */}
          <div className="flex items-start gap-3">
            <FiCheckCircle className="text-primary mt-0.5" size={28} />
            <div>
              <p className="font-semibold text-textLight dark:text-textDark">
                Transparent Pricing
              </p>
              <p className="text-textLight/60 dark:text-textDark/60">
                No hidden fees. Pay exactly what you see.
              </p>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
}
