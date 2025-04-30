/* eslint-disable */
// @ts-nocheck

import { BaggageInfo } from "./searchedFlight";

export interface travellerData {
  identificationType: string;
  index: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  nationality: string;
  identificationNumber: string;
  identificationExpiryDate: string;
  gender: string;
  identityDocument: {};
  fileName: string;
  fileUploading: boolean;
  type?: string;
  openImageCropper?: boolean;
  parsedPassportDataSuccess?: boolean;
  parsedPassportDataFailed?: boolean;
  passportExpiryValidationMessage?: string;
  isPassportExpired?: boolean;
  ageValidationMessage?: string;
  isAgeValidError?: boolean;
  parsedPassportDataLoading?: boolean;
}

export interface bookingDetail {
  date: string;
  time: string;
  orignPoint: string;
  arrivalPoint: string;
  passengersName: string;
  PNR: string;
  status: string;
}

export interface dashboardTableDataProps {
  date: string;
  time: string;
  originPoint: string;
  arrivalPoint: string;
  passengersName: string;
  pnr: string;
  status: string;
  createdOn: string;
  id?: string;
  segments: [SegmentInfoProps];
  passengers: [
    {
      firstName: string | null;
      middleName: string | null;
      lastName: string | null;
    },
  ];
  totalAmount: number;
}

export interface SegmentInfoProps {
  id: string;
  createdOn: string;
  createdBy: string;
  lastModifiedOn: string;
  lastModifiedBy: string;
  deletedOn: string | null;
  deletedBy: string | null;
  deleted: boolean;
  active: boolean;
  version: number;
  controlNumber: string;
  referenceNumber: string;
  airline: string;
  boardPoint: string;
  offPoint: string;
  departureDate: string;
  departureTime: string | null;
  arrivalDate: string;
  arrivalTime: string | null;
  flightNumber: string;
  cabinClass: string | null;
  pnrId: string | null;
  flightDuration: number;
  baggageInfo: BaggageInfo;
  type: string;
  departureTerminal: string;
  arrivalTerminal: string;
  services: string;
  transitTime: number;
}

export interface TravelerDataState {
  identificationType: string;
  index: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  nationality: string;
  identificationNumber: string;
  identificationExpiryDate: string;
  gender: string;
  documentId: string;
  fileName: string;
  passengerType: string;
  fileUploading: boolean;
  openImageCropper: boolean;
  parsedPassportDataLoading: boolean;
  parsedPassportDataSuccess: boolean;
  parsedPassportDataFailed: boolean;
  passportExpiryValidationMessage: string;
  isPassportExpired: boolean;
  ageValidationMessage: string;
  isAgeValidError: boolean;
  mealType: string;
  wheelChair: string;
}
