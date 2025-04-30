/* eslint-disable */
// @ts-nocheck

import Image from "next/image";
import type { MenuProps } from "antd";
import { Dropdown, Modal } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { cleanUserInfoFetchPayload, ReduxState } from "@/app/redux";

import { AfnuuIcon, AirlinePlaneImage } from "@/app/assets/images";
import { getLocalStorage, setLocalStorage } from "@/app/utils/ui/storageUtils";
import {
  appConfig,
  clientTypes,
  extraConfig,
  WARNING_MESSAGE,
} from "@/app/constants/ui/app-config";
import {
  clearUserLoggedStorage,
  convertDateIntoDayYearFormat,
  convertDateIntoTicketDownloadFormat,
  decodeBase64DataIntoJsonParsedData,
  getNamePascalCase,
  getSingleNameInitial,
  isEmpty,
} from "@/app/utils/ui";

const AuthorizedHeaderForMobileView = () => {
  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  const [clientFullName, setClientFullName] = useState("");
  const [flightSearchData, setFlightSearchData] = useState({});
  const [isThereFlightDataFromDashboard, setIsThereFlightDataFromDashboard] =
    useState<boolean>(false);
  const [isTheTripTwoWayOrNot, setIsTheTripTwoWayOrNot] = useState(false);

  const customerType =
    getLocalStorage(appConfig?.CLIENT_TYPE) &&
    getLocalStorage(appConfig?.CLIENT_TYPE)?.toUpperCase();
  const isProfileSectionPath =
    router.pathname.split("/")[1] === extraConfig.ACCOUNT;
  const { searchFlightAirportInfoList } = useSelector(
    (state: any) => state.flight,
  );
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

  const renderTravllerCount = (travllerCount) => {
    if (travllerCount === 1) {
      return "1 Traveller";
    } else {
      return `${travllerCount} Travellers`;
    }
  };

  const handleNavigation = (currentRoute) => {
    switch (currentRoute) {
      case "/flightList":
        router.push("/");
        break;
      case "/flightbook":
        router.push("/");
        break;
      case "/flightPayment":
        router.push("/");
        break;
      case "/flightTicket":
        router.push("/");
        break;
    }
  };

  const checkAirportLocationName = (airportCode: string = "") => {
    if (isThereFlightDataFromDashboard) {
      const airport = flightSearchData?.airportInfos?.find(
        (airport) => airport?.iataCode === airportCode,
      );
      return airport ? airport?.city : airportCode;
    } else {
      if (
        searchFlightAirportInfoList &&
        airportCode in searchFlightAirportInfoList
      ) {
        return getNamePascalCase(
          searchFlightAirportInfoList?.[airportCode]?.city,
        );
      } else {
        return airportCode;
      }
    }
  };
  const CheckTheFlightIsRoundTripOrNot = (segmentDetails) => {
    if (segmentDetails?.length === 1) {
      return checkAirportLocationName(segmentDetails?.[0]?.offPoint);
    } else {
      return checkAirportLocationName(
        segmentDetails?.[segmentDetails?.length - 1]?.boardPoint,
      );
    }
  };

  useEffect(() => {
    if (getLocalStorage(appConfig?.IS_CLIENT_FULL_NAME_CHANGED)) {
      setClientFullName(getLocalStorage(appConfig?.CLIENT_FULL_NAME));
      setLocalStorage(appConfig?.IS_CLIENT_FULL_NAME_CHANGED, String(false));
    }
  }, [getLocalStorage(appConfig?.IS_CLIENT_FULL_NAME_CHANGED)]);

  useEffect(() => {
    if (getLocalStorage(appConfig?.PNR_ID_FROM_DASHBOARD)) {
      const flightData = getLocalStorage(
        appConfig?.FLIGHT_DETAILS_FROM_DASHBOARD,
      );
      const parsedFlightDetailData =
        decodeBase64DataIntoJsonParsedData(flightData);
      if (parsedFlightDetailData) {
        setIsThereFlightDataFromDashboard(true);
        setFlightSearchData(parsedFlightDetailData);
        if (parsedFlightDetailData?.segmentInfos?.length > 1) {
          setIsTheTripTwoWayOrNot(true);
        } else {
          setIsTheTripTwoWayOrNot(false);
        }
      }
    } else {
      const searchedData = getLocalStorage(appConfig?.FLIGHT_SEARCH_INFO);
      if (!isEmpty(searchedData)) {
        setFlightSearchData(searchedData);
      }
    }
  }, [router?.query]);

  return (
    <div className="authorized-header__mobile-view">
      <div className="mobile-view__left-section">
        {router?.pathname === "/" ||
          router?.pathname.includes("/account") ||
          router?.pathname.includes("/dashboard") ? (
          <div>
            <Image
              className={"mobile-view__image"}
              src={AfnuuIcon}
              alt="Company logo"
              height={31}
              onClick={() => {
                router.push("/");
              }}
            />
          </div>
        ) : (
          <div className="mobile-view__navigation">
            <ArrowLeftOutlined
              style={{ fontSize: "18px" }}
              onClick={() => handleNavigation(router.pathname)}
            />
            <div className="navigation__flight-search-details">
              <div className="flight-search-details__airport-infos">
                <div className="flight-search-details__airport-names">
                  <p>
                    {isThereFlightDataFromDashboard
                      ? checkAirportLocationName(
                        flightSearchData?.segmentInfos?.[0]?.boardPoint,
                      )
                      : flightSearchData?.tripsDetail?.originLocation}
                  </p>
                </div>
                <Image src={AirlinePlaneImage} alt="airplane" />
                <div className="flight-search-details__airport-names">
                  <p>
                    {isThereFlightDataFromDashboard
                      ? CheckTheFlightIsRoundTripOrNot(
                        flightSearchData?.segmentInfos,
                      )
                      : flightSearchData?.tripsDetail?.destinationLocation}
                  </p>
                </div>
                {(flightSearchData?.dateInfo?.returning?.fullDate ||
                  isTheTripTwoWayOrNot) && (
                    <>
                      <Image src={AirlinePlaneImage} alt="airplane" />
                      <div className="flight-search-details__airport-names">
                        <p>
                          {isThereFlightDataFromDashboard
                            ? checkAirportLocationName(
                              flightSearchData?.segmentInfos?.[0]?.boardPoint,
                            )
                            : flightSearchData?.tripsDetail?.originLocation}
                        </p>
                      </div>
                    </>
                  )}
              </div>
              <div className="flight-search-details__date-infos">
                <div className="date-infos__departing-date">
                  <p>
                    {convertDateIntoDayYearFormat(
                      isThereFlightDataFromDashboard
                        ? flightSearchData?.segmentInfos?.[0]?.departureDate
                        : flightSearchData?.dateInfo?.departing?.fullDate,
                    )}
                  </p>
                </div>{" "}
                |
                {(flightSearchData?.dateInfo?.returning?.fullDate ||
                  isTheTripTwoWayOrNot) && (
                    <div className="date-infos__returning-date">
                      <p>
                        {convertDateIntoDayYearFormat(
                          isThereFlightDataFromDashboard
                            ? flightSearchData?.segmentInfos?.[
                              flightSearchData?.segmentInfos?.length - 1
                            ]?.arrivalDate
                            : flightSearchData?.dateInfo?.returning?.fullDate,
                        )}
                      </p>
                      <span>|</span>
                    </div>
                  )}
                <div className="date-infos__travller-count">
                  <p>
                    {renderTravllerCount(
                      isThereFlightDataFromDashboard
                        ? flightSearchData?.pnrInfo?.passengers?.length
                        : flightSearchData?.travellerInfo?.totalCount,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={"mobile-view__right-section"}>
        {router?.pathname === "/" && (
          <div
            className={"dashboard_display"}
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <a>
              {customerType === clientTypes.INDIVIDUAL
                ? "My Dashboard"
                : "Dashboard"}
            </a>
          </div>
        )}

        <div className="right-section__profile-details">
          <div className="profile-details__client">
            {checkIfUserEmailOrMobileNumberVerified() && (
              <div className="client__acount-status">Account Pending </div>
            )}
          </div>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div className={"user_badge"}>
              {getSingleNameInitial(
                clientFullName || getLocalStorage(appConfig?.CLIENT_FULL_NAME),
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default AuthorizedHeaderForMobileView;
