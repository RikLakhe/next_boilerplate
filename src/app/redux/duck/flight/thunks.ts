/* eslint-disable */
// @ts-nocheck

import * as SEARCH_ACTION_TYPES from "./types";
import {
  APICore,
  setLocalStorage,
  showCustomToastError,
  showToastError,
} from "@/app/utils/ui";
import {
  handleCustomOrDefaultErrorMessage,
  handleErrorMessage,
} from "@/app/utils/ui/errorHandling";
import {
  AAFNUU_BALANCE_TOP_UP_FAILURE_URL,
  AAFNUU_BALANCE_TOP_UP_SUCCESS_URL,
  AAFNUU_FLIGHT_CONFIG_URL,
  ACCEPT_FARE_CHANGE_PNR_URL,
  CREATE_A_FLIGHT_TICKET_URL,
  CREATE_PNR,
  FETCH_CONNECTIPS_TOKEN,
  FLIGHT_BOOKING_LIST_URL,
  FLIGHT_SEARCH_URL,
  FLIGHT_TICKET_DETAIL_VIEW_URL,
  MAKE_FLIGHT_TICKET_PAYMENT_URL,
  PAYMENT_METHODS_LIST_URL,
  PNR_FARE_RULE,
  PNR_ID,
  PNR_SESSION_SIGNOUT_URL,
  TWO_FACTOR_AUTHENTICATION_URL,
  UPLOAD_DOCUMENT,
  UPSERT_CONNECTIPS_CONFIRM_PAYMENT,
  UPSERT_CONNECTIPS_PAYMENT_ERROR,
} from "@/app/constants/ui/api-constants";
import {
  PNR_SESSION_TIME,
  PNR_SESSION_TIME_LIMIT,
} from "@/app/constants/ui/app-config";
import { AxiosResponse } from "axios";

interface AirportListSearchFetchOptions {
  signal?: AbortSignal;
}

export const searchFlight = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.SEARCH_FLIGHT_REQUEST });

    return api
      .storeAPI(FLIGHT_SEARCH_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.SEARCH_FLIGHT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: SEARCH_ACTION_TYPES.SEARCH_FLIGHT_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const searchAirport = (
  query: string,
  options: AirportListSearchFetchOptions = {},
) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.SEARCH_AIRPORT_REQUEST });

    return api
      .fetchAPI(`/public/airports?query=${query}`)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.SEARCH_AIRPORT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.SEARCH_AIRPORT_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const uploadPassengerDocument = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.DOCUMENT_UPLOAD });

    return api
      .storeAPI(UPLOAD_DOCUMENT, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.DOCUMENT_UPLOAD_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.DOCUMENT_UPLOAD_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        return error;
      });
  };
};

export const createPNR = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.PNR_REQUEST });

    return api
      .storeAPI(CREATE_PNR, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.PNR_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.PNR_REQUEST_ERROR,
          payload: {
            message: error
              ? handleCustomOrDefaultErrorMessage(
                error?.response?.data?.code,
                error?.response?.data?.message,
              )
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        return error;
      });
  };
};

export const makeFlightTicketPayment = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_PAYMENT_REQUEST });

    return api
      .storeAPI(MAKE_FLIGHT_TICKET_PAYMENT_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_PAYMENT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        } else {
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_PAYMENT_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        return error;
      });
  };
};

export const fetchFlightBookingListWithCriteria = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.FETCH_FLIGHT_BOOKING_LIST_WITH_CRITERIA_REQUEST,
    });

    return api
      .storeAPI(FLIGHT_BOOKING_LIST_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.FETCH_FLIGHT_BOOKING_LIST_WITH_CRITERIA_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.FETCH_FLIGHT_BOOKING_LIST_WITH_CRITERIA_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};
export const fetchFareRule = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_FARE_RULE_REQUEST });

    return api
      .storeAPI(PNR_FARE_RULE, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_FARE_RULE_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          setLocalStorage(
            PNR_SESSION_TIME,
            JSON.stringify(PNR_SESSION_TIME_LIMIT),
          );
          return response;
        }
      })
      .catch((error: any) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_FARE_RULE_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        return error;
      });
  };
};

export const pnrSessionSignout = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.PNR_SESSION_SIGNOUT_REQUEST });

    return api
      .storeAPI(PNR_SESSION_SIGNOUT_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.PNR_SESSION_SIGNOUT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.PNR_SESSION_SIGNOUT_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const fetchFlightTicketDetailByPNRId = (PNRId: string) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_VIEW_REQUEST });

    return api
      .fetchAPIWithURL(FLIGHT_TICKET_DETAIL_VIEW_URL.replace(PNR_ID, PNRId))
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_VIEW_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: SEARCH_ACTION_TYPES.FLIGHT_TICKET_VIEW_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const createFlightTicket = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: SEARCH_ACTION_TYPES.CREATE_FLIGHT_TICKET_REQUEST });

    return api
      .storeAPI(CREATE_A_FLIGHT_TICKET_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.CREATE_FLIGHT_TICKET_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.CREATE_FLIGHT_TICKET_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const verifyTwoFactorAuthenticationBeforeAfnuuBalancePayment = (
  formData: object,
) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.TWO_FACTOR_AUTHENTICATION_BEFORE_AFNUU_BALANCE_PAYMENT_REQUEST,
    });

    return api
      .storeAPI(TWO_FACTOR_AUTHENTICATION_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.TWO_FACTOR_AUTHENTICATION_BEFORE_AFNUU_BALANCE_PAYMENT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: SEARCH_ACTION_TYPES.TWO_FACTOR_AUTHENTICATION_BEFORE_AFNUU_BALANCE_PAYMENT_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const initatePaymentRequestForNCHL = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.CONNECT_IPS_INITATE_TOKEN_REQUEST,
    });

    return api
      .storeAPI(FETCH_CONNECTIPS_TOKEN, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.CONNECT_IPS_INITATE_TOKEN_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: SEARCH_ACTION_TYPES.CONNECT_IPS_INITATE_TOKEN_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const connectIpsPaymentSuccess = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.CONNECT_IPS_CONFIRM_PAYMENT_REQUEST,
    });

    return api
      .storeAPI(UPSERT_CONNECTIPS_CONFIRM_PAYMENT, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.CONNECT_IPS_CONFIRM_PAYMENT_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.CONNECT_IPS_CONFIRM_PAYMENT_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        showToastError(error?.response?.data?.message);
      });
  };
};

export const connectIpsPaymentFailure = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.CONNECT_IPS_FAILURE_PAYMENT_REQUEST,
    });

    return api
      .storeAPI(UPSERT_CONNECTIPS_PAYMENT_ERROR, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.CONNECT_IPS_FAILURE_PAYMENT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.CONNECT_IPS_FAILURE_PAYMENT_REQEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        showToastError(error?.response?.data?.message);
      });
  };
};

export const fetchPaymentMethodsList = () => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.PAYMENT_METHODS_REQUEST,
    });

    return api
      .fetchAPI(PAYMENT_METHODS_LIST_URL)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.PAYMENT_METHODS_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.PAYMENT_METHODS_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const aafnuuBalanceTopUpSuccess = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_SUCCESS_REQUEST,
    });

    return api
      .storeAPI(AAFNUU_BALANCE_TOP_UP_SUCCESS_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_SUCCESS_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_SUCCESS_REQUEST_FAILURE,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        showToastError(error?.response?.data?.message);
      });
  };
};

export const aafnuuBalanceTopUpFailure = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_FAILURE_REQUEST,
    });

    return api
      .storeAPI(AAFNUU_BALANCE_TOP_UP_FAILURE_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_FAILURE_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.TOP_UP_AAFNUU_BALANCE_FAILURE_REQUEST_FAILURE,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
        showToastError(error?.response?.data?.message);
      });
  };
};

export const afnuuFlightConifgList = () => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.FLIGHT_CONFIG_REQUEST,
    });

    return api
      .fetchAPI(AAFNUU_FLIGHT_CONFIG_URL)
      .then((response: AxiosResponse<FlightConifgResponseProp, void>) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.FLIGHT_CONFIG_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.FLIGHT_CONFIG_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const acceptFareChangeFromPNR = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: SEARCH_ACTION_TYPES.ACCEPT_FARE_CHANGE_PNR_REQUEST,
    });

    return api
      .storeAPI(ACCEPT_FARE_CHANGE_PNR_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: SEARCH_ACTION_TYPES.ACCEPT_FARE_CHANGE_PNR_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_ACTION_TYPES.ACCEPT_FARE_CHANGE_PNR_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};
