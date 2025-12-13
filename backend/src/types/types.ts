import { Document, Types } from 'mongoose';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface Profile {
  company?: string;
  phoneNumber?: string;
  address?: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role:string;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profile?: Profile;
  status: "active" | "inactive" | "banned" | "delete_request" | "deleted";
  role: "user" | "admin" | "developer";
  otp?: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface IAutomationInstance extends Document {
  _id:Types.ObjectId;
  user: Types.ObjectId; 
  masterWorkflow: Types.ObjectId;
  
  n8nWorkflowId: string;
  instanceName: string;

  selectedPlanDetails?: {
    planName: string;
    monthlyPrice: number;
     payAmount: number;
      discountPercent: number;
    validityDays: number;
    usageLimit: number;
  };
  usageCount:number;

  isActive: "RUNNING" | "PAUSE";
  systemStatus: "TRIAL" | "ACTIVE" | "NEED_PAYMENT" | "EXPIRED" | "EXPIRE_SOON" | 'USAGE_LIMIT_EXCEEDED' |"CONTACT_SUPPORT";

  periods?: {
    startTime?: Date | null;
    endTime?: Date;
  };

  lastExecutedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  name: string;
  number: number;
  email: string;
  subject: string;
  message: string;
  status: "UN_READ" | "READ";
  createdAt: Date;
  updatedAt: Date;
}

interface IInject {
  node: string;
  field: string;
}

export interface IRequiredInput {
  key?: string;
  label?: string;
  inject?: IInject[];
}

interface IField {
  name?: string;
  label?: string;
  inputType?: string;
  disabled?: boolean;
  require?: boolean;
  defaultValue?: string;
}

interface IRequiredCredential {
  service?: string;
  label?: string;
  credentialType?: string;
  scopes?: string[];
  fields?: IField[];
  inject?: IInject[];
}

export interface IMasterWorkflow extends Document {
  name: string;
  description?: string;
  slug: string;
  workflowJsonTemplate: Record<string, any>; 
  serviceImage?: string;
  version?: number;
  pricingPlans: {
    planName: string;
    monthlyPrice: number;
    usageLimit: number;
    validityDays: number;
    discountPercent: number;
    features: string[];
  }[];
  keyword?: string[];
  isPublished?: "ACTIVE" | "PAUSE";
  currency?: string;
  requiredInputs?: IRequiredInput[];
  requiredCredentials?: IRequiredCredential[];
  createdAt: Date;
  updatedAt: Date;
}


export interface INewsletter extends Document {
  email: string;
  status?: "SUBSCRIBED" | "UNSUBSCRIBED"; // optional kyunki default hai
  createdAt: Date;
  updatedAt: Date;
}



export interface IPaymentLog {
  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  note?: string;
  changedAt: Date;
}

/* PERIOD */
export interface IPeriod {
  startDate?: Date;
  endDate?: Date;
}

/* PLAN SNAPSHOT */
export interface IPlanDetails {
  name?: string;
  monthlyPrice?: number;
  months?: number;
  discountPercentage?: number;
}

/* AMOUNT DETAILS */
export interface IAmountDetails {
  baseAmount: number;
  discountAmount: number;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  totalAmount: number;
}


export interface IPayment extends Document {
  user: Types.ObjectId;

  orderId: string;

  instanceId: Types.ObjectId;

  subscriptionMonths: number;

  period?: IPeriod;

  planDetails?: IPlanDetails;

  amountDetails: IAmountDetails;

  currency: "INR" | "USD";

  paymentMethod?:
    | "card"
    | "upi"
    | "netbanking"
    | "wallet"
    | "manual"
    | "internal";

  transactionId?: string;

  status: "pending" | "success" | "failed" | "refunded" | "cancelled";

  note?: string;

  logs: IPaymentLog[];

  createdAt: Date;
  updatedAt: Date;
}






