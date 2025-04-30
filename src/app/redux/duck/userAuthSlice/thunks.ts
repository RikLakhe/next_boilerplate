/* Instruments */
/* eslint-disable */
// @ts-nocheck

import { APICore, getLocalStorage } from "@/app/utils/ui";
import * as USER_AUTH_ACTION_TYPES from "./types";
import { showCustomToastError } from "@/app/utils/ui/commonUtils";
import { handleErrorMessage } from "@/app/utils/ui/errorHandling";
import {
  AAFNUU_USER_FORGOT_PASSWORD_URL,
  AAFNUU_USER_RESET_PASSWORD_URL,
  ADMIN_DETAIL_UPDATE_URL,
  FETCH_AGENT_LOGO_URL,
  INVITE_USER_URL,
  PAYMENT_LOGS_LIST_URL,
  UPLOAD_AGENT_LOGO_URL,
  USER_AFNUU_BALANCE_FETCH_LIST_URL,
  USER_AFNUU_BALANCE_TOPUP_URL,
  USER_ALL_LIST_URL,
  USER_DETAIL_FETCH_URL,
  USER_EMAIL_OR_MOBILE_VERIFICATION_URL,
  USER_EMAIL_VERIFICATION_URL,
  USER_EMAIL_VERIFY_WITH_OTP_URL,
  USER_ID,
  USER_INFO_UPDATE_URL,
  USER_LOGIN_URL,
  USER_REGISTER_URL,
  USERS_LIST_WITH_CRITERIA_URL,
} from "@/app/constants/ui/api-constants";
import { OTP } from "@/app/constants/ui/app-config";

export const userEmailOrMobileNumberVerification = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST,
    });
    return api
      .storeAPI(USER_EMAIL_OR_MOBILE_VERIFICATION_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST_ERROR,
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

export const userLogin = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: USER_AUTH_ACTION_TYPES.USER_LOGIN_REQUEST });

    return api
      .storeAPI(USER_LOGIN_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_LOGIN_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_LOGIN_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const userSignUp = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: USER_AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST });

    return api
      .storeAPI(USER_REGISTER_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const userInfoFetch = (id: string) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: USER_AUTH_ACTION_TYPES.USER_INFO_FETCH_REQUEST });

    return api
      .fetchAPIWithURL(USER_DETAIL_FETCH_URL.replace(USER_ID, id))
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_INFO_FETCH_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_INFO_FETCH_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const userInfoUpdate = (userId: string, formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: USER_AUTH_ACTION_TYPES.USER_INFO_UPDATE_REQUEST });

    return api
      .updateAPI(USER_INFO_UPDATE_URL.replace(USER_ID, userId), formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_INFO_UPDATE_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_INFO_UPDATE_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const userEmailVerification = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST,
    });
    return api
      .storeAPI(USER_EMAIL_VERIFICATION_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        if (!getLocalStorage(OTP.NAME)) {
          showCustomToastError(error);
        }
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const verifyUserEmailViaOtp = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_EMAIL_VERIFY_VIA_OTP_REQUEST,
    });
    return api
      .storeAPI(USER_EMAIL_VERIFY_WITH_OTP_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_EMAIL_VERIFY_VIA_OTP_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_EMAIL_VERIFY_VIA_OTP_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const inviteUserViaEmail = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_INVITATION_REQUEST,
    });
    return api
      .storeAPI(INVITE_USER_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_INVITATION_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_INVITATION_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const fetchUsersListWithCriteria = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USERS_LIST_REQUEST,
    });
    return api
      .storeAPI(USERS_LIST_WITH_CRITERIA_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USERS_LIST_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USERS_LIST_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const fetchAllUsersList = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.ALL_USERS_LIST_REQUEST,
    });
    return api
      .storeAPI(USER_ALL_LIST_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.ALL_USERS_LIST_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.ALL_USERS_LIST_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const adminUserDetailUpdate = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({ type: USER_AUTH_ACTION_TYPES.USER_DETAIL_UPDATE_REQUEST });

    return api
      .updateAPI(ADMIN_DETAIL_UPDATE_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_DETAIL_UPDATE_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_DETAIL_UPDATE_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const topUpAfnuuBalance = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_TOPUP_BALANCE_UPSERT_REQUEST,
    });
    return api
      .storeAPI(USER_AFNUU_BALANCE_TOPUP_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_TOPUP_BALANCE_UPSERT_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_TOPUP_BALANCE_UPSERT_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const fetchUserAfnuuBalanceTransactionList = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_BALANCE_FETCH_LIST_REQUEST,
    });
    return api
      .storeAPI(USER_AFNUU_BALANCE_FETCH_LIST_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_BALANCE_FETCH_LIST_REQUEST_SUCCESS,
            payload: response.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_BALANCE_FETCH_LIST_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const uploadLogo = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.AGENT_USER_UPLOAD_LOGO_REQUEST,
    });
    return api
      .updateAPI(UPLOAD_AGENT_LOGO_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.AGENT_USER_UPLOAD_LOGO_REQUEST_SUCCESS,
            payload: response.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.AGENT_USER_UPLOAD_LOGO_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const fetchLogo = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.AGENT_USER_FETCH_LOGO_REQUEST,
    });
    return api
      .fetchAPI(FETCH_AGENT_LOGO_URL)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.AGENT_USER_FETCH_LOGO_REQUEST_SUCCESS,
            payload: response.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.AGENT_USER_FETCH_LOGO_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const fetchPaymentLogs = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_PAYMENT_LOGS_REQUEST,
    });
    return api
      .storeAPI(PAYMENT_LOGS_LIST_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_PAYMENT_LOGS_REQUEST_SUCCESS,
            payload: response.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_PAYMENT_LOGS_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const userForgotPassword = (data: object) => {
  return async (dispatch: any) => {
    const api = new APICore();
    dispatch({
      type: USER_AUTH_ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST,
    });
    return api
      .storeAPI(AAFNUU_USER_FORGOT_PASSWORD_URL, data)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST_SUCCESS,
            payload: response.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};

export const userResetPasword = (formData: object) => {
  return async (dispatch: any) => {
    const api = new APICore();

    dispatch({ type: USER_AUTH_ACTION_TYPES.USER_RESET_PASSWORD_REQUEST });

    return api
      .storeAPI(AAFNUU_USER_RESET_PASSWORD_URL, formData)
      .then((response) => {
        if (response && response.status === 200) {
          dispatch({
            type: USER_AUTH_ACTION_TYPES.USER_RESET_PASSWORD_REQUEST_SUCCESS,
            payload: response.data.data,
          });
          return response;
        }
      })
      .catch((error) => {
        showCustomToastError(error);
        dispatch({
          type: USER_AUTH_ACTION_TYPES.USER_RESET_PASSWORD_ERROR,
          payload: {
            message: error
              ? error?.response?.data?.message
              : handleErrorMessage(error?.response?.data?.code),
          },
        });
      });
  };
};
