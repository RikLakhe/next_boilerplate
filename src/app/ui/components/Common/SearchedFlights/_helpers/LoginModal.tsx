/* eslint-disable */
// @ts-nocheck

import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal, Select, Spin } from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";

import SignUpModal from "./SignUpModal";
import CustomLabel from "../../../CustomLabel";
import VerifyUserEmail from "./verifyUserEmail";
import {
  appConfig,
  DEFAULT_PRIVACY_AND_POLICY_URL,
  DEFAULT_TERMS_AND_CONDITION_URL,
} from "@/app/constants/ui/app-config";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { countriesCode } from "@/app/utils/countryCodeUtlis";
import { ReduxState, fetchFareRule, userLogin } from "@/app/redux";
import { FETCH_GEO_LOCATION_URL } from "@/app/constants/ui/api-constants";
import {
  decodeBase64DataIntoJsonParsedData,
  encodeStringifyDataIntoBase64Data,
  getLocalStorage,
  isUserAuthenticated,
  setLocalStorage,
  showCustomToastError,
  userLoginSuccess,
} from "@/app/utils/ui";

interface loginInterface {
  email?: string;
  mobileNumber?: string;
  password?: string;
  countryCode?: string;
}

function LoginModal(props: any) {
  const { toggleLoginModal, singleFlightDetailForStorage } = props;
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [openSignupModal, setSignupModal] = useState<boolean>(false);
  const [inputAddonBeforeType, setInputAddonBeforeType] = useState("");
  const [openEmailVerifyModal, setOpenEmailVerifyModal] =
    useState<boolean>(false);

  const { userLoginLoading } = useSelector((state: any) => state.userAuth);
  const { flightTicketFareRuleLoading, flightConfigPayload } = useSelector(
    (state: any) => state.flight,
  );

  const selectBefore = (
    <Select
      showSearch
      defaultValue={selectedCountryCode}
      options={countriesCode?.map((country) => ({
        label: country.code,
        value: country.name,
      }))}
      onChange={(selectedOption, selectedData: any) => {
        setSelectedCountryCode(selectedData?.label);
      }}
    />
  );

  const redirectToFlightDetail = () => {
    const flightDataToString = JSON.stringify(singleFlightDetailForStorage);
    const base64EncodedData =
      encodeStringifyDataIntoBase64Data(flightDataToString);
    setLocalStorage(appConfig.FLIGHT_DETAILS, base64EncodedData);
    const flightDetail = getLocalStorage(appConfig?.FLIGHT_DETAILS);
    const parsedBase64DecodedFlightDetailData =
      decodeBase64DataIntoJsonParsedData(flightDetail);
    dispatch(fetchFareRule(parsedBase64DecodedFlightDetailData)).then((res) => {
      if (res?.status === 200) {
        setLocalStorage(appConfig?.PNR_SESSION_ID, res?.data?.data?.sessionId);
        router.push("/flightbook");
      } else {
        showCustomToastError("Server Error. Please try again");
      }
    });
  };

  const handleUserNameSubmitForLogin = () => {
    let formData: loginInterface = {};
    if (inputAddonBeforeType === "email") {
      formData.email = username?.toLowerCase();
    } else {
      formData.mobileNumber = username;
      formData.countryCode = selectedCountryCode;
    }
    formData.password = password;
    dispatch(userLogin(formData)).then((res) => {
      if (res?.status === 200) {
        const emailVerified = res?.data?.data?.emailVerified;
        userLoginSuccess(res?.data?.data);
        if (isUserAuthenticated()) {
          if (emailVerified) {
            toggleLoginModal();
            redirectToFlightDetail();
          } else {
            setOpenEmailVerifyModal(true);
          }
        }
      }
    });
  };

  const checkUserNameValidation = (checkValue: string) => {
    if (inputAddonBeforeType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(checkValue)) {
        setUsernameError("");
      } else {
        setUsernameError("Invalid email");
      }
    }
    if (inputAddonBeforeType === "number") {
      if (checkValue.length < 10) {
        setUsernameError("At least 10 digit required");
        return false;
      }
      if (checkValue.length > 10) {
        setUsernameError("Should not exceed 10 digit");
        return false;
      }
      if (checkValue.length === 10) {
        setUsernameError("");
        return true;
      }
      setUsername(checkValue);
    }
  };

  const handleSiginUserPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setUserPasswordError("Required");
    } else {
      setUserPasswordError("");
    }
    setPassword(value);
  };

  const handleSigninCredential = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 0) {
      setInputAddonBeforeType("");
    } else {
      const firstCharacter = value.charAt(0);

      if (!Number.isNaN(Number(firstCharacter))) {
        setInputAddonBeforeType("number");
      } else {
        setInputAddonBeforeType("email");
      }
    }
    setUsername(value);
    checkUserNameValidation(value);
  };

  const handleValidation = () => {
    if (username === "" && password === "") {
      setUsernameError("Required");
      setUserPasswordError("Required");
      return false;
    }
    if (username === "") {
      setUsernameError("Required");
      return false;
    } else {
      checkUserNameValidation(username);
    }
    if (password === "") {
      setUserPasswordError("Required");
      return false;
    } else {
      return true;
    }
  };

  const handleLogin = () => {
    if (handleValidation()) {
      handleUserNameSubmitForLogin();
    }
  };

  const handleSignUpModal = () => {
    setSignupModal(true);
  };

  const toggleSignUpModal = () => {
    setSignupModal((prevState) => !prevState);
  };

  const toggleVerifyModal = () => {
    setOpenEmailVerifyModal((prevState) => !prevState);
  };

  const checkAddOnBefore = () => {
    if (inputAddonBeforeType === "") {
      return "enter";
    } else if (inputAddonBeforeType === "email") {
      return "email";
    } else {
      return selectBefore;
    }
  };

  useEffect(() => {
    axios
      .get(FETCH_GEO_LOCATION_URL)
      .then((response) => {
        let data = response?.data;
        setSelectedCountryCode(data.country_calling_code);
      })
      .catch((error) => {
        setSelectedCountryCode("+977");
      });
  }, []);

  return (
    <div>
      <Spin
        spinning={userLoginLoading || flightTicketFareRuleLoading}
        tip="Loading..."
      >
        <div>
          <CustomLabel label={"Email Address / Mobile Number"} required />
          <div>
            <Input
              className="form__fields_phone_number"
              name="username"
              value={username}
              maxLength={inputAddonBeforeType === "number" ? 10 : 255}
              onKeyDown={(e) => {
                const inputValue = e.key;
                if (inputAddonBeforeType === "number") {
                  if (!/^\d$/.test(inputValue) && inputValue !== "Backspace") {
                    e.preventDefault(); // Prevent non-numeric characters from being typed
                  }
                }
              }}
              addonBefore={checkAddOnBefore()}
              onChange={(e) => {
                handleSigninCredential(e);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
            {usernameError && <span className="errors">{usernameError}</span>}
          </div>
        </div>
        <div>
          <CustomLabel label={"Password"} required />
          <div className="login-modal__password">
            <Input.Password
              name="password"
              value={password}
              onChange={(e) => handleSiginUserPassword(e)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
            {userPasswordError && (
              <span className="errors">{userPasswordError}</span>
            )}
          </div>
        </div>
        <div className="login_form__terms_and_condition">
          <p>
            By signing, I accept the{" "}
            <a
              href={
                flightConfigPayload?.term
                  ? flightConfigPayload?.term
                  : DEFAULT_TERMS_AND_CONDITION_URL
              }
              target="_blank"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href={
                flightConfigPayload?.policy
                  ? flightConfigPayload?.policy
                  : DEFAULT_PRIVACY_AND_POLICY_URL
              }
              target="_blank"
            >
              {" "}
              Privacy Policy
            </a>{" "}
            of afnuu.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              className="btn-primary"
              onClick={() => {
                handleLogin();
              }}
            >
              Sign in
            </Button>
            {/* Need this after pilot Phase */}
            {/* <p>
              {` Didn't have an account?`}
              <a onClick={() => handleSignUpModal()}> Sign up </a>
            </p> */}
          </div>
        </div>
      </Spin>
      <Modal
        title="Sign up"
        open={openSignupModal}
        onCancel={toggleSignUpModal}
        footer={null}
        width={700}
      >
        <SignUpModal
          toggleSignUpModal={toggleSignUpModal}
          singleFlightDetailForStorage={singleFlightDetailForStorage}
          toggleLoginModal={toggleLoginModal}
        />
      </Modal>
      {openEmailVerifyModal && (
        <Modal
          title="Email not verified"
          open={openEmailVerifyModal}
          onCancel={toggleVerifyModal}
          footer={null}
        >
          <VerifyUserEmail
            redirectToFlightDetail={redirectToFlightDetail}
            toggleVerifyModal={toggleVerifyModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default LoginModal;
