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

  isActive: "RUNNING" | "PAUSE";
  systemStatus: "TRIAL" | "ACTIVE" | "NEED_PAYMENT" | "EXPIRED" | "EXPIRE_SOON" | "CONTACT_SUPPORT";

  periods?: {
    startTime?: Date | null;
    endTime?: Date;
  };

  executionCount: number;
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
  keyword?: string[];
  isPublished?: "ACTIVE" | "PAUSE";
  pricePerMonth?: number;
  currency?: string;
  trialDays?: number;
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
  changedAt?: Date;
}

interface IPlanDetails {
  name?: string;
  duration?: number;
  price?: number;
  discountPercentage?: number;
}

interface IAmountDetails {
  baseAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;
}

interface IPeriod {
  startDate?: Date;
  endDate?: Date;
}

export interface IPayment extends Document {
  user: Types.ObjectId;
  orderId?: string;
  instanceId: Types.ObjectId;
  subscriptionMonths: number;

  period?: IPeriod;
  planDetails?: IPlanDetails;
  amountDetails: IAmountDetails;

  currency?: "INR" | "USD";
  paymentMethod?: "card" | "upi" | "netbanking" | "wallet" | "manual" | "internal";

  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  note?: string;
  Log?: IPaymentLog[];

  createdAt: Date;
  updatedAt: Date;
}






