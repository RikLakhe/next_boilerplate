/* eslint-disable */

import { ERROR_MESSAGE_TRY_AGAIN } from "@/app/constants/ui/app-config";

// @ts-nocheck

enum CustomerErrorCodes {
  AFNCSIC001 = "Invalid credentials",
  AFNCSFN001 = "First name is required",
  AFNCSFN002 = "First name is invalid",
  AFNCSFN003 = "First name is invalid",
  AFNCSMN001 = "Mobile number is required",
  AFNCSMN002 = "Mobile number is too short",
  AFNCSLN001 = "Last name is empty",
  AFNCSlN002 = "Last name is invalid",
  AFCSLN003 = "Last name is invalid",
  AFNCSEM001 = "Email is required",
  AFNCSEM002 = "Email is invalid",
  AFNCSPW001 = "Password is required",
  AFNCSPW003 = "Password does not match",
  AFNCSNN001 = "Mobile number is required",
  AFNCSNN002 = "Mobile number is invalid",
  AFNCSNN003 = "Mobile number is invalid",
  ALIAEEN004 = "Record already exists",
  AFNVSOP001 = "OTP has already been sent",
  AFNVSOP002 = "OTP has been verified already",
  AFNVSOP003 = "OTP is expired",
  AFNVSOP004 = "Invalid OTP",
  AFNFSTO001 = "Origin location is required",
  AFNFSDD001 = "Departure date is required",
  AFNFSDD002 = "Departure date is invalid",
  AFNFSDD003 = "Departure date cannot be past date",
  AFNFSDD004 = "Departure date cannot be future date greater than 361 days",
  AFNFSTD001 = "Destination location is required",
  AFNFSTD002 = "Origin and destination cannot be same",
  AFNFSPI003 = "No of infants cannot be greater no of adults",
  AFNFSAD001 = "Arrival date is required",
  AFNFSAD002 = "Arrival date is invalid",
  AFNFSAD003 = "Arrival date cannot be past date",
  AFNFSAD004 = "Arrival date cannot be future date greater than 361 days",
  AFNFSPI002 = "Max 9 passengers allowed",
  AFNFSPN001 = "Nationality is required",
  AFNBTBL001 = "Insufficient balance to procceed transaction",
  AFNPSST001 = "PNR already ticketed",
  AFNCSMN003 = "Mobile number is too long",
  AFNCSNN004 = "Mobile number already exist",
  AFNPSTL001 = "PNR expired",
  AFNESEM001 = "Invalid email",
}

export const CUSTOM_API_ERROR = {
  COUNTRY_BLOCKED_ERROR:
    "Country selected is blocked. You cannot proceed further.",
  AIRLINE_BLOCKED_ERROR:
    "Airline selected is blocked. You cannot proceed further.",
  COUNTRY_BLOCKED_ERROR_CODE: "AFNPSCO001",
  AIRLINE_BLOCKED_ERROR_CODE: "AFNPSAI001",
};

export const handleErrorMessage = (errorCode: string) => {
  const customerErrorCodeIndex =
    Object.keys(CustomerErrorCodes).indexOf(errorCode);
  return customerErrorCodeIndex === -1
    ? ERROR_MESSAGE_TRY_AGAIN
    : Object.values(CustomerErrorCodes)[customerErrorCodeIndex];
};

export const handleCustomOrDefaultErrorMessage = (
  errorCode: string,
  defaultErrorMessage: string,
) => {
  if (errorCode === CUSTOM_API_ERROR.COUNTRY_BLOCKED_ERROR_CODE) {
    return CUSTOM_API_ERROR.COUNTRY_BLOCKED_ERROR;
  }
  if (errorCode === CUSTOM_API_ERROR.AIRLINE_BLOCKED_ERROR_CODE) {
    return CUSTOM_API_ERROR.AIRLINE_BLOCKED_ERROR;
  }
  return defaultErrorMessage;
};
