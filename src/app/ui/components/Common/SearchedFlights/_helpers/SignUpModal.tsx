/* eslint-disable */
// @ts-nocheck

import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Input, Modal, Row, Spin, Tooltip } from "antd";

import { TravelData } from "@/app/interfaces";
import CustomLabel from "../../../CustomLabel";
import VerifyUserEmail from "./verifyUserEmail";
import PasswordPolicy from "../../PasswordPolicy";
import {
  appConfig,
  DEFAULT_PRIVACY_AND_POLICY_URL,
  DEFAULT_TERMS_AND_CONDITION_URL,
} from "@/app/constants/ui/app-config";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import CustomPhoneNumberField from "../../../CustomPhoneNumber";
import { fetchFareRule, ReduxState, userLogin, userSignUp } from "@/app/redux";
import {
  decodeBase64DataIntoJsonParsedData,
  encodeStringifyDataIntoBase64Data,
  getLocalStorage,
  isUserAuthenticated,
  setLocalStorage,
  showCustomToastError,
  showToastSuccess,
  userLoginSuccess,
} from "@/app/utils/ui";

interface SignUpProps {
  toggleSignUpModal: any;
  toggleLoginModal: any;
  singleFlightDetailForStorage: TravelData;
}

interface signupDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
}

function SignUpModal(props: SignUpProps) {
  const { toggleSignUpModal, singleFlightDetailForStorage } = props;
  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [openEmailVerifyModal, setOpenEmailVerifyModal] =
    useState<boolean>(false);

  const { userSignUpLoading, userLoginLoading } = useSelector(
    (state: any) => state.userAuth,
  );
  const { flightTicketFareRuleLoading, flightConfigPayload } = useSelector(
    (state: any) => state.flight,
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

  const formik = useFormik<signupDetails>({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      countryCode: "",
      email: getLocalStorage(appConfig.CLIENT_SIGNUP_EMAIL) || "",
      mobileNumber:
        getLocalStorage(appConfig.CLIENT_SIGNUP_MOBILE_NUMBER) || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object<signupDetails>({
      firstName: Yup.string()
        .required("Required")
        .min(2, "At least 2 characters required")
        .max(50, "Should not exceed 50 characters"),
      middleName: Yup.string()
        .min(2, "At least 2 characters required")
        .max(50, "Should not exceed 50 characters"),
      lastName: Yup.string()
        .required("Required")
        .min(2, "At least 2 characters required")
        .max(50, "Should not exceed 50 characters"),
      email: Yup.string().required("Required").email("Enter a valid email"),
      mobileNumber: Yup.string()
        .required("Required")
        .min(10, "At least 10 digit required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password")], "Password does not match"),
    }),
    onSubmit: (values: signupDetails) => {
      let formData = {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        countryCode: "",
        password: "",
        confirmPassword: "",
      };
      formData.firstName = values.firstName;
      formData.middleName = values.middleName;
      formData.lastName = values.lastName;
      formData.email = values.email?.toLowerCase();
      formData.countryCode = selectedCountryCode;
      formData.mobileNumber = values.mobileNumber;
      formData.password = values.password;
      formData.confirmPassword = values.confirmPassword;

      dispatch(userSignUp(formData)).then((res) => {
        if (res!?.status === 200) {
          showToastSuccess("Sign up complete");
          dispatch(
            userLogin({ email: formData.email, password: formData.password }),
          ).then((res: any) => {
            if (res?.status === 200) {
              userLoginSuccess(res?.data?.data);
              const emailVerified = res?.data?.data?.emailVerified;
              if (isUserAuthenticated()) {
                if (emailVerified) {
                  redirectToFlightDetail();
                } else {
                  setOpenEmailVerifyModal(true);
                }
              }
            }
          });
        }
      });
    },
  });

  const toggleVerifyModal = () => {
    setOpenEmailVerifyModal((prevState) => !prevState);
  };

  const openLoginModal = () => {
    toggleSignUpModal();
  };

  return (
    <div>
      <Spin
        spinning={
          userSignUpLoading || userLoginLoading || flightTicketFareRuleLoading
        }
        tip={userSignUpLoading ? "Signing up" : "Signing in"}
      >
        <form>
          <div>
            <Row gutter={16}>
              <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                <CustomLabel label={"First Name"} required />
                <Input
                  name="firstName"
                  style={{ width: "210px" }}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
                {formik.errors.firstName && formik.touched.firstName && (
                  <span className="errors">{formik.errors.firstName}</span>
                )}
              </Col>
              <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                <CustomLabel label={"Middle Name"} required />
                <Input
                  name="middleName"
                  style={{ width: "210px" }}
                  onChange={formik.handleChange}
                  value={formik.values.middleName}
                />
                {formik.errors.middleName && formik.touched.middleName && (
                  <span className="errors">{formik.errors.middleName}</span>
                )}
              </Col>
              <Col xs={{ span: 12 }} md={{ span: 8 }} lg={{ span: 8 }}>
                <CustomLabel label={"Last Name"} required />
                <Input
                  name="lastName"
                  style={{ width: "190px" }}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
                {formik.errors.lastName && formik.touched.lastName && (
                  <span className="errors">{formik.errors.lastName}</span>
                )}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <CustomLabel label={"Email"} required />
                <Input
                  name="email"
                  style={{ width: "318px" }}
                  onChange={formik.handleChange}
                  value={formik.values.email || ""}
                  disabled={getLocalStorage(appConfig.CLIENT_SIGNUP_EMAIL)}
                />
                {formik.errors.email && formik.touched.email && (
                  <span className="errors">{formik.errors.email}</span>
                )}
              </Col>
              <Col span={12}>
                <CustomPhoneNumberField
                  formik={formik}
                  selectedCountryCode={selectedCountryCode}
                  setSelectedCountryCode={setSelectedCountryCode}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <CustomLabel label={"Password"} required />
                <Tooltip title={<PasswordPolicy />} color="#ffffff">
                  <Input.Password
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </Tooltip>

                {formik.errors.password && formik.touched.password && (
                  <span className="errors">{formik.errors.password}</span>
                )}
              </Col>
              <Col span={12}>
                <CustomLabel label={"Confirm Password"} required />
                <Tooltip title={<PasswordPolicy />} color="#ffffff">
                  <Input.Password
                    name="confirmPassword"
                    style={{ width: "300px" }}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                  />
                </Tooltip>
                {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword && (
                    <span className="errors">
                      {formik.errors.confirmPassword}
                    </span>
                  )}
              </Col>
            </Row>
          </div>

          <div className={"signup_form__bottom_section"}>
            <p className={"signup_form__terms_and_condition"}>
              By registering, I accept the{" "}
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
                onClick={() => formik.handleSubmit()}
              >
                Register
              </Button>

              <p>
                Already have an account?{" "}
                <a onClick={() => openLoginModal()}>Login</a>
              </p>
            </div>
          </div>
        </form>
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
      </Spin>
    </div>
  );
}

export default SignUpModal;
