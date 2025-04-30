/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import Image from "next/image";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { useRouter } from "next/router";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { cleanUserInfoFetchPayload, ReduxState } from "@/app/redux";
import { useDispatch } from "react-redux";

import globalHeaderClass from "./globalHeader.module.css";

import { AfnuuIcon } from "@/app/assets/images";
import { getLocalStorage, setLocalStorage } from "@/app/utils/ui/storageUtils";
import {
  appConfig,
  clientTypes,
  extraConfig,
  WARNING_MESSAGE,
} from "@/app/constants/ui/app-config";
import { clearUserLoggedStorage, getSingleNameInitial } from "@/app/utils/ui";

const AuthorizedHeader = () => {
  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  const [clientFullName, setClientFullName] = useState("");
  const customerType =
    getLocalStorage(appConfig?.CLIENT_TYPE) &&
    getLocalStorage(appConfig?.CLIENT_TYPE)?.toUpperCase();
  const isProfileSectionPath =
    router.pathname.split("/")[1] === extraConfig.ACCOUNT;

  const userLogout = () => {
    clearUserLoggedStorage();
    dispatch(cleanUserInfoFetchPayload());
    setLocalStorage(appConfig.CLIENT_LOGOUT_EVENT, String(Math.random()));
    if (router.query.from || router.query.to || router.query.traveller) {
      router.push("/");
    } else if (router?.route === "/") {
      router.reload();
    } else {
      router.push("/");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <a onClick={() => router.push("/account/personalInfo")}>Account</a>
      ),
      key: "0",
    },
    {
      label: <a onClick={userLogout}>Sign out</a>,
      key: "1",
    },
  ];

  const checkIfUserEmailOrMobileNumberVerified = () => {
    return (
      !getLocalStorage(appConfig?.CLIENT_EMAIL_VERIFIED) ||
      !getLocalStorage(appConfig?.CLIENT_MOBILE_NUMBER_VERIFIED)
    );
  };

  useEffect(() => {
    if (getLocalStorage(appConfig?.IS_CLIENT_FULL_NAME_CHANGED))
      setClientFullName(getLocalStorage(appConfig?.CLIENT_FULL_NAME));
    setLocalStorage(appConfig?.IS_CLIENT_FULL_NAME_CHANGED, String(false));
  }, [getLocalStorage(appConfig?.IS_CLIENT_FULL_NAME_CHANGED)]);

  return (
    <>
      <div className={globalHeaderClass.authorized_btn_section}>
        <div className={globalHeaderClass.main_logo}>
          <Image
            className={globalHeaderClass.logo_only}
            src={AfnuuIcon}
            alt="Company logo"
            height={31}
            onClick={() => {
              if (
                router.pathname === "/flightPayment" ||
                router.pathname === "/flightTicket"
              ) {
                const okay = confirm(WARNING_MESSAGE);
                if (okay) {
                  router.push("/");
                } else {
                  return;
                }
              }
              router.push("/");
            }}
          />
        </div>
        <div className={globalHeaderClass.right_side_detail}>
          <div
            className={globalHeaderClass.dashboard_display}
            onClick={() => {
              if (
                router.pathname === "/flightPayment" ||
                router.pathname === "/flightTicket"
              ) {
                const okay = confirm(WARNING_MESSAGE);
                if (okay) {
                  router.push("/dashboard");
                }
              } else {
                router.push("/dashboard");
              }
            }}
          >
            <a>
              {customerType === clientTypes.INDIVIDUAL
                ? "My Dashboard"
                : "Dashboard"}
            </a>
          </div>
          <div className={globalHeaderClass.user_info}>
            <div className={globalHeaderClass.user_account_info}>
              <div className={globalHeaderClass.user_fullname}>
                {clientFullName || getLocalStorage(appConfig?.CLIENT_FULL_NAME)}
              </div>
              {checkIfUserEmailOrMobileNumberVerified() && (
                <div className={globalHeaderClass.user_account_status}>
                  Account Pending{" "}
                </div>
              )}
            </div>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div className={"user_badge"}>
                {getSingleNameInitial(
                  clientFullName ||
                  getLocalStorage(appConfig?.CLIENT_FULL_NAME),
                )}
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <div
        className={
          isProfileSectionPath
            ? globalHeaderClass.big_bottom_section
            : globalHeaderClass.authHeader_bottom_section
        }
      />
    </>
  );
};

export default AuthorizedHeader;
