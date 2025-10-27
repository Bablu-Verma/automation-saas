export interface IUser {
    _id: string;
    name: string;
    email: string;
    role:string;
    status:string;
    profile:{
        company?:string;
        phoneNumber?:string;
        address?:string;
    }
}

export interface IPaymentDetails {
  _id: string;
  orderId: string;
  amountDetails: {
    totalAmount: number;
    baseAmount: number;
    discountAmount: number;
    taxAmount: number;
  };
  currency: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    _id: string;
  };
  instanceId: {
    instanceName: string;
    _id: string;
  };
  subscriptionMonths: number;
  period: {
    startDate: string;
    endDate: string;
  };
  planDetails: {
    name: string;
    duration: number;
    price: number;
    discountPercentage: number;
  };
  Log: []
}

export interface ILogItem {
  status: string;
  changedAt: string | Date;
  note: string;
}

export type IContcatFiltersType = {
  search: string;
  status: "" | "UN_READ" | "READ";
  dateFrom: string;
  dateTo: string;
};

export type INewsleterFiltersType = {
  search: string;
  status: "" | "SUBSCRIBED" | "UNSUBSCRIBED";
  dateFrom: string;
  dateTo: string;
};

export interface ICredentialField {
  name: string;
  label?: string;
  inputType?: 'text' | 'password' | 'number' | 'email';
  disabled?: boolean;
  require?: boolean;
  defaultValue?: string;
}


export interface IRequiredCredential {
  service: string;
  label?: string;
  credentialType?: string;
  scopes?: string[];
  fields?: ICredentialField[];
  inject?: Array<{ node: string; field: string }>;
}

interface RequiredInput {
  key: string;
  label?: string;
  defaultValue?: string;
  inject?: Array<{ node: string; field: string }>;
}


export type IWorkflowDetail = {
  _id: string;
  name: string;
  description: string;
  keyword: string[];
  slug:string;
  pricePerMonth: number;
  currency: string;
  isPublished: "ACTIVE" | "PAUSE";
  serviceImage?: string;
  trialDays: number;
  requiredInputs: RequiredInput[];
  requiredCredentials: IRequiredCredential[];
};
