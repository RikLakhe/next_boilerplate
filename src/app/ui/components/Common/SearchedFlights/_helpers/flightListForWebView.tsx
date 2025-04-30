/* eslint-disable */
// @ts-nocheck

import { Modal, notification } from "antd";
import Image from "next/image";
import React, { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

import { AirplaneIcon, LuggageIcon, NoFlightFound } from "@/app/assets/images";
import {
  AllFlightDetailProps,
  AllFlightListDetailProps,
  SegmentInfo,
  TravelData,
} from "@/app/interfaces";
import {
  clearLocalStorage,
  convertTimeToStandardTime,
  decodeBase64DataIntoJsonParsedData,
  encodeStringifyDataIntoBase64Data,
  getLocalStorage,
  getNamePascalCase,
  isEmpty,
  isUserAuthenticated,
  setLocalStorage,
  showCustomToastError,
  signoutBySessionId,
} from "@/app/utils/ui";
import {
  changeCabinClassName,
  checkAirlineImages,
  checkBaggageInfo,
  checkIfFlightHasMoreSegments,
  checkNumberOfStops,
  convertFlightTime,
  convertPriceIntoStandardPriceFormat,
} from "./flightUtils";
import LoginModal from "./LoginModal";
import FlightDetails from "./flightDetails";
import VerifyUserEmail from "./verifyUserEmail";
import { fetchFareRule, ReduxState, userInfoFetch } from "@/app/redux";
import {
  AIRLINE_STATUS,
  appConfig,
  ERROR_CODE,
  FLIGHT_INFO_TYPE,
  PNR_SESSION_TIME,
  PNR_SESSION_TIME_LIMIT,
  refundStatusConfig,
} from "@/app/constants/ui/app-config";
import CustomLabel from "../../../CustomLabel";
import FlightType from "@/app/ui/components/Common/FlightDetailHeader/FlightType";
import DefaultAirlineImageView from "./defaultAirlineImageView";
import ImageWrapper from "./imageWrapper";
import { FlightListTwoWay } from "@/app/ui/components/Common/SearchedFlights/_helpers/flightListTwoWay";
import { FlightListOneWay } from "@/app/ui/components/Common/SearchedFlights/_helpers/FlightListOneWay";

type NotificationType = "success" | "info" | "warning" | "error";

const FlightListsForWebView: React.FC<AllFlightListDetailProps> = (props) => {
  const {
    flightDetailLists,
    handleFlightPriceSort,
    flightPriceSort,
    searchFlightAirlineList,
    searchFlightAirportInfoList,
    noFlightFound,
    airlineImageLists,
    flightAds,
    isFlightPriceSortEmpty,
    openMultipleFlightDetail,
    singleFlightDetailForStorage,
    setSingleFlightDetailForStorage,
    fareChangeData,
    setFareChangeData,
    handleFlightBookEvenAfterPriceChange,
    checkAirportLocationName,
    checkIfAirlineIsOpenForBooking,
    redirectToFlightDetail,
    handleBookFlight,
    checkAirlineImageLink,
    FlightDetailView,
    handleFlightDetailView,
    handleRoundTripFlightDetailView,
    oldFareData,
    setOldFareData,
    newFareData,
    setNewFareData,
    openFlightDetail,
    setFlightRefs,
    flightRefs,
  } = props;

  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Warning",
      description:
        "Please reach out to the support team to proceed with the booking.",
    });
  };

  return (
    <div className="flight-details-web" style={{ width: "100%" }}>
      {noFlightFound || isFlightPriceSortEmpty ? (
        <div className="no-flight-found">
          <Image src={NoFlightFound} alt="no flight" />
          <h1>No flights found</h1>
        </div>
      ) : (
        <div
          className="flight-details"
          style={{ width: isEmpty(flightAds) ? "78%" : "100%" }}
        >
          {contextHolder}
          <div className="flight-details__top-section">
            <h5>DESTINATION</h5>
            <div
              className="top-section__price"
              onClick={() => handleFlightPriceSort()}
            >
              <h5>PRICE</h5>
              {flightPriceSort ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </div>
          </div>
          <div className="flight-details__main-section">
            {flightDetailLists?.map(
              (flight: TravelData, flightIndex: number) =>
                checkIfFlightHasMoreSegments(flight) ? (
                  <FlightListTwoWay
                    flight={flight}
                    flightIndex={flightIndex}
                    openMultipleFlightDetail={openMultipleFlightDetail}
                    flightRefs={flightRefs}
                    handleRoundTripFlightDetailView={
                      handleRoundTripFlightDetailView
                    }
                    checkAirlineImageLink={checkAirlineImageLink}
                    airlineImageLists={airlineImageLists}
                    searchFlightAirlineList={searchFlightAirlineList}
                    checkAirportLocationName={checkAirportLocationName}
                    FlightDetailView={FlightDetailView}
                  />
                ) : (
                  <FlightListOneWay
                    flight={flight}
                    flightIndex={flightIndex}
                    openFlightDetail={openFlightDetail}
                    flightRefs={flightRefs}
                    handleFlightDetailView={handleFlightDetailView}
                    checkAirlineImageLink={checkAirlineImageLink}
                    airlineImageLists={airlineImageLists}
                    searchFlightAirlineList={searchFlightAirlineList}
                    checkAirportLocationName={checkAirportLocationName}
                    FlightDetailView={FlightDetailView}
                  />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightListsForWebView;
