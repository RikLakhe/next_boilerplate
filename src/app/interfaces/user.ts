/* eslint-disable */

// @ts-nocheck

export interface LoginSuccessData {
  token: string;
  id: string;
  email: string;
  fullName: string;
  countryCode: string;
  emailVerified: string;
  mobileNumberVerified: string;
  customerType: string;
  mobileNumber: string;
}

export interface UserDetail {
  id: string;
  invitedTo: string;
  fullName: string;
  active?: boolean;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
}

export interface ClientBalanceTransactionDetail {
  data: Array<SingleUserBalanceTransactionDetail>;
}

export interface SingleUserBalanceTransactionDetail {
  transactionType: string;
  accountId: string;
  txnDetailId: string;
  partyAccountId: string;
  afnuuTransactionType: string;
  partyId: string;
  partyType: string;
  partyName: string;
  newBalance: number;
  amount: number;
  id: string;
  createdOn: string;
  data: [];
}

export interface accountInfoDetails {
  active?: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string | null;
  nationality: string;
  country: string;
  countryCode: string;
  state: string;
  streetAddress: string;
  postCode: string;
  emailVerified: boolean;
  mobileNumberVerified: boolean;
  invitedBy?: string | null;
  agentName?: string | null;
  afnuuAccountInfos?: [
    {
      balanceAmount: number;
      currency: string;
      id: string;
    },
  ];
}

export interface PaymentLogsDetail {
  controlNumber: string;
  paymentMode: string;
  status: string;
  amount: number;
  id: string;
  createdOn: string;
  currency: string;
  data: [];
}
