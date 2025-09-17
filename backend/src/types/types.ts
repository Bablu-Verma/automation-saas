import { Document, Schema, Types } from 'mongoose';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AutomationSubscription {
  plan: "free" | "pro";
  status: "active" | "inactive" | "paused" | "canceled";
  planId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Automation {
  masterWorkflow: Types.ObjectId;
  workflowId: string;
  name?: string;
  credentials?: Record<string, any>; // Dynamic object
  executionCount: number;
  lastExecutedAt?: Date;
  subscription: AutomationSubscription;
}

export interface BillingHistory {
  invoiceId: string;
  amount: number;
  date: Date;
  status: string;
}

export interface Profile {
  company?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserDocument extends Document {
  _id:Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profile?: Profile;
  automations: Automation[];
  billingHistory: BillingHistory[];
  status: "active" | "inactive" | "banned" | "delete_request" | "deleted";
  role: "user" | "admin" | "developer";
  otp?: number;
  createdAt: Date;
  updatedAt: Date;
}
