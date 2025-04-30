/* eslint-disable */
// @ts-nocheck

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import * as SEARCH_ACTION from "./actions";
import { ConnectIpsState, PaymentMethodsResponse } from "@/app/interfaces";
import { getLocalStorage } from "@/app/utils/ui";
import { AIRLINEINFODETAILS } from "@/app/constants/ui/app-config";

const initialState: flightSliceState = {
  searchFlightPayload: undefined,
  searchFlightLoading: false,
  searchFlightErrors: {},
  searchAirportLoading: false,
  searchAirportPayload: [],
  searchAirportErrors: {},
  searchFlightAirlineList:
    getLocalStorage(AIRLINEINFODETAILS.AIRLINE_INFO_LIST) || [],
  searchFlightAirportInfoList:
    getLocalStorage(AIRLINEINFODETAILS.AIRPORT_INFO_LIST) || [],
  documentUploadPayload: [],
  documentUploadLoading: false,
  documentUploadErrors: {},
  pnrPayload: [],
  pnrLoading: false,
  pnrErrors: {},
  flightTicketPaymentPayload: [],
  flightTicketPaymentLoading: false,
  flightTicketPaymentErrors: {},
  fetchFlightListPayload: [],
  fetchFlightListLoading: false,
  fetchFlightListErrors: {},
  flightTicketFareRulePayload: [],
  flightTicketFareRuleLoading: false,
  flightTicketFareRuleErrors: {},
  pnrSessionSignoutPayload: [],
  pnrSessionSignoutLoading: false,
  pnrSessionSignoutErrors: {},
  flightTicketSingleDetailPayload: [],
  flightTicketSingleDetailLoading: false,
  flightTicketSingleDetailErrors: {},
  createFlightTicketPayload: [],
  createFlightTicketLoading: false,
  createFlightTicketErrors: {},
  twoFactorAuthenticationBeforeAfnuuBalancePaymentPayload: [],
  twoFactorAuthenticationBeforeAfnuuBalancePaymentLoading: false,
  twoFactorAuthenticationBeforeAfnuuBalancePaymentErrors: {},
  airlineImageLists:
    getLocalStorage(AIRLINEINFODETAILS.AIRLINE_IMAGE_INFO) || [],
  airlineImageListsLoading: false,
  airlineImageListsErrors: {},
  connectIpsTokenPayload: undefined,
  connectIpsTokenLoading: false,
  connectIpsTokenErrors: {},
  connectIpsConfirmPaymentRequestErrors: {},
  connectIpsConfirmPaymentRequestLoading: false,
  connectIpsConfirmPaymentRequestPayload: [],
  connectIpsErrorPaymentRequestLoading: false,
  connectIpsErrorPaymentRequestErrors: {},
  connectIpsErrorPaymentRequestPayload: [],
  paymentMethodsRequestLoading: false,
  paymentMethodsRequestErrors: {},
  paymentMethodsRequestPayload: undefined,
  topUpAfnnuBalanceSuccessPayload: [],
  topUpAfnnuBalanceSuccessLoading: false,
  topUpAfnnuBalanceSuccessErrors: {},
  topUpAfnnuBalanceFailurePayload: [],
  topUpAfnnuBalanceFailureLoading: false,
  topUpAfnnuBalanceFailureErrors: {},
  flightConfigPayload: undefined,
  flightConfigloading: false,
  flightConfigErrors: {},
  acceptFareChangePNRPayload: [],
  acceptFareChangePNRloading: false,
  acceptFareChangePNRErrors: {},
};
export const flightSlice = createSlice({
  name: "flightSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SEARCH_ACTION.searchFlightRequest, (state) => {
        state.searchFlightLoading = true;
      })
      .addCase(
        SEARCH_ACTION.searchFlightRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.searchFlightLoading = false;
          if (action.payload) {
            state.searchFlightPayload = action.payload.recommendations;
            state.searchFlightAirlineList = action.payload.airlineInfo;
            state.searchFlightAirportInfoList = action.payload.airportInfo;
            state.airlineImageLists = action.payload.imageInfo;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.searchFlightRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.searchFlightLoading = false;
          if (action.payload) {
            state.searchFlightErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.searchAirportRequest, (state) => {
        state.searchAirportLoading = true;
      })
      .addCase(
        SEARCH_ACTION.searchAirportRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.searchAirportLoading = false;
          if (action.payload) {
            state.searchAirportPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.searchAirportRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.searchAirportLoading = false;
          if (action.payload) {
            state.searchAirportErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.documentUploadRequest, (state) => {
        state.documentUploadLoading = true;
      })
      .addCase(
        SEARCH_ACTION.documentUploadRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.documentUploadLoading = false;
          if (action.payload) {
            state.documentUploadPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.documentUploadRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.documentUploadLoading = false;
          if (action.payload) {
            state.documentUploadErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.pnrRequest, (state) => {
        state.pnrLoading = true;
      })
      .addCase(
        SEARCH_ACTION.pnrRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.pnrLoading = false;
          if (action.payload) {
            state.pnrPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.pnrRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.pnrLoading = false;
          if (action.payload) {
            state.pnrErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.flightTicketPaymentRequest, (state) => {
        state.flightTicketPaymentLoading = true;
      })
      .addCase(
        SEARCH_ACTION.flightTicketPaymentRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.flightTicketPaymentLoading = false;
          if (action.payload) {
            state.flightTicketPaymentPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.flightTicketPaymentRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.flightTicketPaymentLoading = false;
          if (action.payload) {
            state.flightTicketPaymentErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.fetchFlightBookingListRequest, (state) => {
        state.fetchFlightListLoading = true;
      })
      .addCase(
        SEARCH_ACTION.fetchFlightBookingListRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.fetchFlightListLoading = false;
          if (action.payload) {
            state.fetchFlightListPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.fetchFlightBookingListRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.fetchFlightListLoading = false;
          if (action.payload) {
            state.fetchFlightListErrors = action.payload;
          }
        },
      )

      .addCase(SEARCH_ACTION.flightTicketFareRuleRequest, (state) => {
        state.flightTicketFareRuleLoading = true;
      })
      .addCase(
        SEARCH_ACTION.flightTicketFareRuleRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.flightTicketFareRuleLoading = false;
          if (action.payload) {
            state.flightTicketFareRulePayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.flightTicketFareRuleRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.flightTicketFareRuleLoading = false;
          if (action.payload) {
            state.flightTicketFareRuleErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.pnrSessionSignoutRequest, (state) => {
        state.pnrSessionSignoutLoading = true;
      })
      .addCase(
        SEARCH_ACTION.pnrSessionSignoutRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.pnrSessionSignoutLoading = false;
          if (action.payload) {
            state.pnrSessionSignoutPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.pnrSessionSignoutRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.pnrSessionSignoutLoading = false;
          if (action.payload) {
            state.pnrSessionSignoutErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.flightTicketViewRequest, (state) => {
        state.flightTicketSingleDetailLoading = true;
      })
      .addCase(
        SEARCH_ACTION.flightTicketViewRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.flightTicketSingleDetailLoading = false;
          if (action.payload) {
            state.flightTicketSingleDetailPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.flightTicketViewRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.flightTicketSingleDetailLoading = false;
          if (action.payload) {
            state.flightTicketSingleDetailErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.createFlightTicketRequest, (state) => {
        state.createFlightTicketLoading = true;
      })
      .addCase(
        SEARCH_ACTION.createFlightTicketRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.createFlightTicketLoading = false;
          if (action.payload) {
            state.createFlightTicketPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.createFlightTicketRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.createFlightTicketLoading = false;
          if (action.payload) {
            state.createFlightTicketErrors = action.payload;
          }
        },
      )

      .addCase(
        SEARCH_ACTION.twoFactorAuthenticationBeforeAfnuuBalancePaymentRequest,
        (state) => {
          state.twoFactorAuthenticationBeforeAfnuuBalancePaymentLoading = true;
        },
      )
      .addCase(
        SEARCH_ACTION.twoFactorAuthenticationBeforeAfnuuBalancePaymentRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.twoFactorAuthenticationBeforeAfnuuBalancePaymentLoading = false;
          if (action.payload) {
            state.twoFactorAuthenticationBeforeAfnuuBalancePaymentPayload =
              action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.twoFactorAuthenticationBeforeAfnuuBalancePaymentRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.twoFactorAuthenticationBeforeAfnuuBalancePaymentLoading = false;
          if (action.payload) {
            state.twoFactorAuthenticationBeforeAfnuuBalancePaymentErrors =
              action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.connectIpsInitateTokenRequest, (state) => {
        state.connectIpsTokenLoading = true;
        state.connectIpsTokenPayload = undefined;
      })
      .addCase(
        SEARCH_ACTION.connectIpsInitateTokenRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.connectIpsTokenLoading = false;
          if (action.payload) {
            state.connectIpsTokenPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.connectIpsInitateTokenRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.connectIpsTokenLoading = false;
          if (action.payload) {
            state.connectIpsTokenErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.connectIpsConfirmPaymentRequest, (state) => {
        state.connectIpsConfirmPaymentRequestLoading = true;
      })
      .addCase(
        SEARCH_ACTION.connectIpsConfirmPaymentRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.connectIpsConfirmPaymentRequestLoading = false;
          if (action.payload) {
            state.connectIpsConfirmPaymentRequestPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.connectIpsConfirmPaymentRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.connectIpsConfirmPaymentRequestLoading = false;
          if (action.payload) {
            state.connectIpsConfirmPaymentRequestErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.connectIpsErrorPaymentRequest, (state) => {
        state.connectIpsErrorPaymentRequestLoading = true;
      })
      .addCase(
        SEARCH_ACTION.connectIpsErrorPaymentRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.connectIpsErrorPaymentRequestLoading = false;
          if (action.payload) {
            state.connectIpsErrorPaymentRequestPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.connectIpsErrorPaymentRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.connectIpsErrorPaymentRequestLoading = false;
          if (action.payload) {
            state.connectIpsErrorPaymentRequestErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.paymentMethodsRequest, (state) => {
        state.paymentMethodsRequestLoading = true;
      })
      .addCase(
        SEARCH_ACTION.paymentMethodsRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.paymentMethodsRequestLoading = false;
          if (action.payload) {
            state.paymentMethodsRequestPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.paymentMethodsRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.paymentMethodsRequestLoading = false;
          if (action.payload) {
            state.paymentMethodsRequestErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.topUpAfnuuBalanceSuccessRequest, (state) => {
        state.topUpAfnnuBalanceSuccessLoading = true;
      })
      .addCase(
        SEARCH_ACTION.topUpAfnuuBalanceSuccessRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.topUpAfnnuBalanceSuccessLoading = false;
          if (action.payload) {
            state.topUpAfnnuBalanceSuccessPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.topUpAfnuuBalanceSuccessRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.topUpAfnnuBalanceSuccessLoading = false;
          if (action.payload) {
            state.topUpAfnnuBalanceSuccessErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.topUpAfnuuBalanceFailureRequest, (state) => {
        state.topUpAfnnuBalanceFailureLoading = true;
      })
      .addCase(
        SEARCH_ACTION.topUpAfnuuBalanceFailureRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.topUpAfnnuBalanceFailureLoading = false;
          if (action.payload) {
            state.topUpAfnnuBalanceFailurePayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.topUpAfnuuBalanceFailureRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.topUpAfnnuBalanceFailureLoading = false;
          if (action.payload) {
            state.topUpAfnnuBalanceFailureErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.afnuuFlightConfigRequest, (state) => {
        state.flightConfigPayload = undefined;
        state.flightConfigloading = true;
      })
      .addCase(
        SEARCH_ACTION.afnuuFlightConfigRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.flightConfigloading = false;
          if (action.payload) {
            state.flightConfigPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.afnuuFlightConfigRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.flightConfigloading = false;
          if (action.payload) {
            state.flightConfigErrors = action.payload;
          }
        },
      )
      .addCase(SEARCH_ACTION.acceptFareChangePNRRequest, (state) => {
        state.acceptFareChangePNRPayload = undefined;
        state.acceptFareChangePNRloading = true;
      })
      .addCase(
        SEARCH_ACTION.acceptFareChangePNRRequestSuccess,
        (state, action: PayloadAction<any>) => {
          state.acceptFareChangePNRloading = false;
          if (action.payload) {
            state.acceptFareChangePNRPayload = action.payload;
          }
        },
      )
      .addCase(
        SEARCH_ACTION.acceptFareChangePNRRequestFailure,
        (state, action: PayloadAction<any>) => {
          state.acceptFareChangePNRloading = false;
          if (action.payload) {
            state.acceptFareChangePNRErrors = action.payload;
          }
        },
      );
  },
});

export interface flightSliceState {
  searchFlightPayload: undefined | [];
  searchFlightLoading: boolean;
  searchFlightErrors: {};
  searchAirportLoading: boolean;
  searchAirportPayload: [];
  searchAirportErrors: {};
  searchFlightAirlineList: [];
  searchFlightAirportInfoList: [];
  documentUploadPayload: [];
  documentUploadLoading: boolean;
  documentUploadErrors: {};
  pnrPayload: [];
  pnrLoading: boolean;
  pnrErrors: {};
  flightTicketPaymentPayload: [];
  flightTicketPaymentLoading: boolean;
  flightTicketPaymentErrors: {};
  fetchFlightListPayload: [];
  fetchFlightListLoading: boolean;
  fetchFlightListErrors: {};
  flightTicketFareRulePayload: [];
  flightTicketFareRuleLoading: boolean;
  flightTicketFareRuleErrors: {};
  pnrSessionSignoutPayload: [];
  pnrSessionSignoutLoading: boolean;
  pnrSessionSignoutErrors: {};
  flightTicketSingleDetailPayload: [];
  flightTicketSingleDetailLoading: boolean;
  flightTicketSingleDetailErrors: {};
  createFlightTicketPayload: [];
  createFlightTicketLoading: boolean;
  createFlightTicketErrors: {};
  twoFactorAuthenticationBeforeAfnuuBalancePaymentPayload: [];
  twoFactorAuthenticationBeforeAfnuuBalancePaymentLoading: boolean;
  twoFactorAuthenticationBeforeAfnuuBalancePaymentErrors: {};
  airlineImageLists: [];
  airlineImageListsLoading: boolean;
  airlineImageListsErrors: {};
  connectIpsTokenPayload: ConnectIpsState | undefined;
  connectIpsTokenLoading: boolean;
  connectIpsTokenErrors: {};
  connectIpsConfirmPaymentRequestLoading: boolean;
  connectIpsConfirmPaymentRequestErrors: {};
  connectIpsConfirmPaymentRequestPayload: [];
  connectIpsErrorPaymentRequestLoading: boolean;
  connectIpsErrorPaymentRequestErrors: {};
  connectIpsErrorPaymentRequestPayload: [];
  paymentMethodsRequestLoading: boolean;
  paymentMethodsRequestErrors: {};
  paymentMethodsRequestPayload: PaymentMethodsResponse | undefined;
  topUpAfnnuBalanceSuccessPayload: [];
  topUpAfnnuBalanceSuccessLoading: boolean;
  topUpAfnnuBalanceSuccessErrors: {};
  topUpAfnnuBalanceFailurePayload: [];
  topUpAfnnuBalanceFailureLoading: boolean;
  topUpAfnnuBalanceFailureErrors: {};
  flightConfigPayload: FlightConifgResponseProp | undefined;
  flightConfigloading: boolean;
  flightConfigErrors: {};
  acceptFareChangePNRPayload: [];
  acceptFareChangePNRloading: boolean;
  acceptFareChangePNRErrors: {};
}
