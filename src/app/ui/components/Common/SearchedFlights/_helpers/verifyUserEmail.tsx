/* eslint-disable */
// @ts-nocheck

import { Button, Input } from "antd";
import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

import CustomLabel from "../../../CustomLabel";
import { appConfig, OTP } from "@/app/constants/ui/app-config";
import {
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
  showToastSuccess,
  unixTimeStampFormat,
} from "@/app/utils/ui";
import {
  ReduxState,
  userEmailVerification,
  verifyUserEmailViaOtp,
} from "@/app/redux";
import RenderCountdownTimer from "@/app/ui/components/CountdownTimer";

interface VerifyEmailProps {
  redirectToFlightDetail: any;
  toggleVerifyModal: any;
}

function VerifyUserEmail(props: VerifyEmailProps) {
  const { redirectToFlightDetail, toggleVerifyModal } = props;
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const [resendCounter, setResendCounter] = useState<number>(0);
  const [resendInviteCounter, setResendInviteCounter] = useState<number>(0);
  const [openOTPField, setOpenOTPField] = useState<boolean>(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const { userEmailOrMobileVerificationLoading, userEmailOtpVerifyLoading } =
    useSelector((state: any) => state.userAuth);

  const handleToSendOTP = () => {
    setOpenOTPField(true);
    const userEmail = getLocalStorage(appConfig?.USER_ID);
    dispatch(
      userEmailVerification({
        identifier: userEmail,
      }),
    ).then((res) => {
      if (res?.status === 200) {
        setLocalStorage(OTP.NAME, unixTimeStampFormat(OTP.TIMER_IN_SECONDS));
        setResendCounter((prevState) => prevState + 1);
        setResendInviteCounter(0);
        showToastSuccess(`OTP has been sent to ${userEmail} `);
      }
    });
  };

  const disableVerifyOTP = () => {
    return emailOTP?.length !== 6;
  };

  const verifyEmailOTP = () => {
    const userEmail = getLocalStorage(appConfig?.USER_ID);
    let formData = {
      identifier: userEmail,
      otp: emailOTP,
    };
    dispatch(verifyUserEmailViaOtp(formData)).then((res) => {
      if (res?.status === 200) {
        clearLocalStorage(OTP.NAME);
        toggleVerifyModal();
        redirectToFlightDetail();
      }
    });
  };

  return (
    <div>
      <p>You need to verify your email for further steps.</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a
          className={
            userEmailOrMobileVerificationLoading ? "disabled-link" : ""
          }
          onClick={() => {
            if (openOTPField) return;
            handleToSendOTP();
          }}
        >
          {!openOTPField ? (
            <>
              Click here to send an OTP to{" "}
              <strong>{getLocalStorage(appConfig?.USER_ID)}</strong>
            </>
          ) : (
            <>
              OTP send to <strong>{getLocalStorage(appConfig?.USER_ID)}</strong>
            </>
          )}
        </a>
        {userEmailOrMobileVerificationLoading && openOTPField && (
          <LoadingOutlined />
        )}
      </div>

      {openOTPField && (
        <div className={"otp_field"}>
          <CustomLabel label={"OTP"} required={false} />
          <div className="otp_field__input">
            <Input
              name="otp"
              maxLength={6}
              onChange={(e) => setEmailOTP(e.target.value)}
              placeholder="XXXXXX"
            />
            <Button
              className={`btn-primary`}
              onClick={() => verifyEmailOTP()}
              loading={userEmailOtpVerifyLoading}
              disabled={disableVerifyOTP() || userEmailOtpVerifyLoading}
            >
              Verify
            </Button>
          </div>
          <div className="resend-otp_container">
            <p>
              {resendInviteCounter <= 0 && (
                <RenderCountdownTimer
                  resendCounter={resendCounter}
                  setResendInviteCounter={setResendInviteCounter}
                  resendInviteCounter={resendInviteCounter}
                  setIsTimerRunning={setIsTimerRunning}
                />
              )}
            </p>
            {!isTimerRunning && (
              <>
                <a
                  className={
                    userEmailOrMobileVerificationLoading ? "disabled-link" : ""
                  }
                  onClick={() => handleToSendOTP()}
                >
                  Resend OTP
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyUserEmail;
