import { createAction } from "@reduxjs/toolkit";
import * as AUTH_ACTION_TYPES from "./types";

export const userEmailOrMobileNumberVerificationRequest = createAction(
  AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST,
);
export const userEmailOrMobileNumberVerificationRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST_SUCCESS,
);
export const userEmailOrMobileNumberVerificationRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_EMAIL_OR_MOBILE_NUMBER_VERIFICATION_REQUEST_ERROR,
);

export const userLoginRequest = createAction(
  AUTH_ACTION_TYPES.USER_LOGIN_REQUEST,
);

export const userLoginRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_LOGIN_REQUEST_SUCCESS,
);

export const userLoginRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_LOGIN_REQUEST_ERROR,
);

export const userSignUpRequest = createAction(
  AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST,
);

export const userSignUpRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST_SUCCESS,
);

export const userSignUpRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_SIGN_UP_REQUEST_ERROR,
);

export const userInfoFetchRequest = createAction(
  AUTH_ACTION_TYPES.USER_INFO_FETCH_REQUEST,
);

export const userInfoFetchRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_INFO_FETCH_REQUEST_SUCCESS,
);

export const userInfoFetchRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_INFO_FETCH_REQUEST_ERROR,
);

export const userInfoUpdateRequest = createAction(
  AUTH_ACTION_TYPES.USER_INFO_UPDATE_REQUEST,
);

export const userInfoUpdateRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_INFO_UPDATE_REQUEST_SUCCESS,
);

export const userInfoUpdateRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_INFO_UPDATE_REQUEST_ERROR,
);

export const userEmailVerifyViaOtpRequest = createAction(
  AUTH_ACTION_TYPES.USER_EMAIL_VERIFY_VIA_OTP_REQUEST,
);

export const userEmailVerifyViaOtpRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_EMAIL_VERIFY_VIA_OTP_REQUEST_SUCCESS,
);

export const userEmailVerifyViaOtpRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_EMAIL_VERIFY_VIA_OTP_REQUEST_ERROR,
);

export const userInvitationRequest = createAction(
  AUTH_ACTION_TYPES.USER_INVITATION_REQUEST,
);

export const userInvitationRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_INVITATION_REQUEST_SUCCESS,
);

export const userInvitationRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_INVITATION_REQUEST_ERROR,
);

export const userListFetchRequest = createAction(
  AUTH_ACTION_TYPES.USERS_LIST_REQUEST,
);

export const userListFetchRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USERS_LIST_REQUEST_SUCCESS,
);

export const userListFetchRequestFailure = createAction(
  AUTH_ACTION_TYPES.USERS_LIST_REQUEST_ERROR,
);

export const allUsersListFetchRequest = createAction(
  AUTH_ACTION_TYPES.ALL_USERS_LIST_REQUEST,
);

export const allUsersListFetchRequestSuccess = createAction(
  AUTH_ACTION_TYPES.ALL_USERS_LIST_REQUEST_SUCCESS,
);

export const allUsersListFetchRequestFailure = createAction(
  AUTH_ACTION_TYPES.ALL_USERS_LIST_REQUEST_ERROR,
);

export const userDetailUpdateRequest = createAction(
  AUTH_ACTION_TYPES.USER_DETAIL_UPDATE_REQUEST,
);

export const userDetailUpdateRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_DETAIL_UPDATE_REQUEST_SUCCESS,
);

export const userDetailUpdateRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_DETAIL_UPDATE_REQUEST_ERROR,
);

export const userTopUpBalanceUpsertRequest = createAction(
  AUTH_ACTION_TYPES.USER_TOPUP_BALANCE_UPSERT_REQUEST,
);

export const userTopUpBalanceUpsertRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_TOPUP_BALANCE_UPSERT_REQUEST_SUCCESS,
);

export const userTopUpBalanceUpsertRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_TOPUP_BALANCE_UPSERT_REQUEST_ERROR,
);

export const userBalanceFetchListRequest = createAction(
  AUTH_ACTION_TYPES.USER_BALANCE_FETCH_LIST_REQUEST,
);

export const userBalanceFetchListRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_BALANCE_FETCH_LIST_REQUEST_SUCCESS,
);

export const userBalanceFetchListRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_BALANCE_FETCH_LIST_REQUEST_ERROR,
);

export const agentUserUploadLogoRequest = createAction(
  AUTH_ACTION_TYPES.AGENT_USER_UPLOAD_LOGO_REQUEST,
);

export const agentUserUploadLogoRequestSuccess = createAction(
  AUTH_ACTION_TYPES.AGENT_USER_UPLOAD_LOGO_REQUEST_SUCCESS,
);

export const agentUserUploadLogoRequestFailure = createAction(
  AUTH_ACTION_TYPES.AGENT_USER_UPLOAD_LOGO_REQUEST_ERROR,
);

export const agentUserFetchLogoRequest = createAction(
  AUTH_ACTION_TYPES.AGENT_USER_FETCH_LOGO_REQUEST,
);

export const agentUserFetchLogoRequestSuccess = createAction(
  AUTH_ACTION_TYPES.AGENT_USER_FETCH_LOGO_REQUEST_SUCCESS,
);

export const agentUserFetchLogoRequestFailure = createAction(
  AUTH_ACTION_TYPES.AGENT_USER_FETCH_LOGO_REQUEST_ERROR,
);

export const userAuthErrorsPropsClean = createAction(
  AUTH_ACTION_TYPES.USER_AUTH_ERROR_PROPS_CLEAN,
);

export const userPaymentLogsRequest = createAction(
  AUTH_ACTION_TYPES.USER_PAYMENT_LOGS_REQUEST,
);

export const userPaymentLogsRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_PAYMENT_LOGS_REQUEST_SUCCESS,
);

export const userPaymentLogsRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_PAYMENT_LOGS_REQUEST_ERROR,
);

export const userForgotPasswordRequest = createAction(
  AUTH_ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST,
);
export const userForgotPasswordRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST_SUCCESS,
);
export const userForgotPasswordRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_FORGOT_PASSWORD_REQUEST_ERROR,
);
export const userResetPasswordRequest = createAction(
  AUTH_ACTION_TYPES.USER_RESET_PASSWORD_REQUEST,
);
export const userResetPasswordRequestSuccess = createAction(
  AUTH_ACTION_TYPES.USER_RESET_PASSWORD_REQUEST_SUCCESS,
);
export const userResetPasswordRequestFailure = createAction(
  AUTH_ACTION_TYPES.USER_RESET_PASSWORD_ERROR,
);
