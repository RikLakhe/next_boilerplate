import { createAction } from "@reduxjs/toolkit";
import * as SEARCH_ACTION_TYPES from "./types";

export const searchFlightRequest = createAction(
  SEARCH_ACTION_TYPES.SEARCH_FLIGHT_REQUEST,
);

export const searchFlightRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.SEARCH_FLIGHT_REQUEST_SUCCESS,
);

export const searchFlightRequestFailure = createAction(
  SEARCH_ACTION_TYPES.SEARCH_FLIGHT_REQUEST_ERROR,
);

export const searchAirportRequest = createAction(
  SEARCH_ACTION_TYPES.SEARCH_AIRPORT_REQUEST,
);

export const searchAirportRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.SEARCH_AIRPORT_REQUEST_SUCCESS,
);

export const searchAirportRequestFailure = createAction(
  SEARCH_ACTION_TYPES.SEARCH_AIRPORT_REQUEST_ERROR,
);

export const documentUploadRequest = createAction(
  SEARCH_ACTION_TYPES.DOCUMENT_UPLOAD,
);

export const documentUploadRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.DOCUMENT_UPLOAD_SUCCESS,
);

export const documentUploadRequestFailure = createAction(
  SEARCH_ACTION_TYPES.DOCUMENT_UPLOAD_ERROR,
);

export const pnrRequest = createAction(SEARCH_ACTION_TYPES.PNR_REQUEST);

export const pnrRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.PNR_REQUEST_SUCCESS,
);

export const pnrRequestFailure = createAction(
  SEARCH_ACTION_TYPES.PNR_REQUEST_ERROR,
);

export const flightTicketPaymentRequest = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_PAYMENT_REQUEST,
);

export const flightTicketPaymentRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_PAYMENT_REQUEST_SUCCESS,
);

export const flightTicketPaymentRequestFailure = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_PAYMENT_REQUEST_ERROR,
);

export const fetchFlightBookingListRequest = createAction(
  SEARCH_ACTION_TYPES.FETCH_FLIGHT_BOOKING_LIST_WITH_CRITERIA_REQUEST,
);

export const fetchFlightBookingListRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.FETCH_FLIGHT_BOOKING_LIST_WITH_CRITERIA_REQUEST_SUCCESS,
);

export const fetchFlightBookingListRequestFailure = createAction(
  SEARCH_ACTION_TYPES.FETCH_FLIGHT_BOOKING_LIST_WITH_CRITERIA_REQUEST_ERROR,
);

export const flightTicketFareRuleRequest = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_FARE_RULE_REQUEST,
);

export const flightTicketFareRuleRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_FARE_RULE_REQUEST_SUCCESS,
);

export const flightTicketFareRuleRequestFailure = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_FARE_RULE_REQUEST_ERROR,
);

export const pnrSessionSignoutRequest = createAction(
  SEARCH_ACTION_TYPES.PNR_SESSION_SIGNOUT_REQUEST,
);

export const pnrSessionSignoutRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.PNR_SESSION_SIGNOUT_REQUEST_SUCCESS,
);

export const pnrSessionSignoutRequestFailure = createAction(
  SEARCH_ACTION_TYPES.PNR_SESSION_SIGNOUT_REQUEST_ERROR,
);

export const flightTicketViewRequest = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_VIEW_REQUEST,
);

export const flightTicketViewRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_VIEW_REQUEST_SUCCESS,
);

export const flightTicketViewRequestFailure = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_TICKET_VIEW_REQUEST_ERROR,
);

export const createFlightTicketRequest = createAction(
  SEARCH_ACTION_TYPES.CREATE_FLIGHT_TICKET_REQUEST,
);

export const createFlightTicketRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.CREATE_FLIGHT_TICKET_REQUEST_SUCCESS,
);

export const createFlightTicketRequestFailure = createAction(
  SEARCH_ACTION_TYPES.CREATE_FLIGHT_TICKET_REQUEST_ERROR,
);

export const twoFactorAuthenticationBeforeAfnuuBalancePaymentRequest =
  createAction(
    SEARCH_ACTION_TYPES.TWO_FACTOR_AUTHENTICATION_BEFORE_AFNUU_BALANCE_PAYMENT_REQUEST,
  );

export const twoFactorAuthenticationBeforeAfnuuBalancePaymentRequestSuccess =
  createAction(
    SEARCH_ACTION_TYPES.TWO_FACTOR_AUTHENTICATION_BEFORE_AFNUU_BALANCE_PAYMENT_REQUEST_SUCCESS,
  );

export const twoFactorAuthenticationBeforeAfnuuBalancePaymentRequestFailure =
  createAction(
    SEARCH_ACTION_TYPES.TWO_FACTOR_AUTHENTICATION_BEFORE_AFNUU_BALANCE_PAYMENT_REQUEST_ERROR,
  );

export const connectIpsInitateTokenRequest = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_INITATE_TOKEN_REQUEST,
);
export const connectIpsInitateTokenRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_INITATE_TOKEN_SUCCESS,
);
export const connectIpsInitateTokenRequestFailure = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_INITATE_TOKEN_ERROR,
);

export const connectIpsConfirmPaymentRequest = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_CONFIRM_PAYMENT_REQUEST,
);
export const connectIpsConfirmPaymentRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_CONFIRM_PAYMENT_SUCCESS,
);
export const connectIpsConfirmPaymentRequestFailure = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_CONFIRM_PAYMENT_ERROR,
);

export const connectIpsErrorPaymentRequest = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_FAILURE_PAYMENT_REQUEST,
);
export const connectIpsErrorPaymentRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_FAILURE_PAYMENT_REQUEST_SUCCESS,
);
export const connectIpsErrorPaymentRequestFailure = createAction(
  SEARCH_ACTION_TYPES.CONNECT_IPS_FAILURE_PAYMENT_REQEST_ERROR,
);

export const paymentMethodsRequest = createAction(
  SEARCH_ACTION_TYPES.PAYMENT_METHODS_REQUEST,
);
export const paymentMethodsRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.PAYMENT_METHODS_REQUEST_SUCCESS,
);
export const paymentMethodsRequestFailure = createAction(
  SEARCH_ACTION_TYPES.PAYMENT_METHODS_REQUEST_ERROR,
);

export const topUpAfnuuBalanceSuccessRequest = createAction(
  SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_SUCCESS_REQUEST,
);
export const topUpAfnuuBalanceSuccessRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_SUCCESS_REQUEST_SUCCESS,
);
export const topUpAfnuuBalanceSuccessRequestFailure = createAction(
  SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_SUCCESS_REQUEST_FAILURE,
);

export const topUpAfnuuBalanceFailureRequest = createAction(
  SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_FAILURE_REQUEST,
);
export const topUpAfnuuBalanceFailureRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_FAILURE_REQUEST_SUCCESS,
);
export const topUpAfnuuBalanceFailureRequestFailure = createAction(
  SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_FAILURE_REQUEST_FAILURE,
);

export const afnuuFlightConfigRequest = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_CONFIG_REQUEST,
);
export const afnuuFlightConfigRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_CONFIG_REQUEST_SUCCESS,
);
export const afnuuFlightConfigRequestFailure = createAction(
  SEARCH_ACTION_TYPES.FLIGHT_CONFIG_REQUEST_ERROR,
);

export const acceptFareChangePNRRequest = createAction(
  SEARCH_ACTION_TYPES.ACCEPT_FARE_CHANGE_PNR_REQUEST,
);
export const acceptFareChangePNRRequestSuccess = createAction(
  SEARCH_ACTION_TYPES.ACCEPT_FARE_CHANGE_PNR_REQUEST_SUCCESS,
);
export const acceptFareChangePNRRequestFailure = createAction(
  SEARCH_ACTION_TYPES.ACCEPT_FARE_CHANGE_PNR_REQUEST_ERROR,
);
