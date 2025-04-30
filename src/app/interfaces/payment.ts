export interface ConnectIpsState {
  data: Data;
  token: string;
  actionUrl: string;
}

export interface Data {
  token: string;
  data: ConnectIpsResponse;
}

export interface ConnectIpsResponse {
  MERCHANTID: string;
  APPID: string;
  PARTICULARS: string;
  APPNAME: string;
  TXNDATE: string;
  REFERENCEID: string;
  REMARKS: string;
  TXNCRNCY: string;
  TXNID: string;
  TXNAMT: number;
  TOKEN: string;
}

export interface PaymentMethodsResponse {
  code: string;
  title: string;
}
