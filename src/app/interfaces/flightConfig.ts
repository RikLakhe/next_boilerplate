/* eslint-disable */

// @ts-nocheck

interface FlightConifgResponseProp {
  data: ConifgList;
}

interface ConifgList {
  dashboard: Dashboard;
  loaders: Loader[];
  ads: Adds[];
  term: string;
  rule: string;
  policy: string;
  otherInfo?: null | string;
}

interface Loader {
  title: string;
  image: string;
  action: string;
  redirect: string;
  link: string;
  data?: null | string;
}

interface Dashboard {
  banners: Banner[];
  ads: Adds[];
}

export interface Adds {
  title: string;
  image: string;

  action?: string;
  redirect?: string;
  link?: null | string;
  data?: Data;
}

interface Data {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  destinationTitle: string;
  originTitle: string;
}

export interface Banner {
  title: string;
  image: string;
  action: string;
  redirect?: null | string;
  link?: null | string;
  data?: null | string;
}
