/* eslint-disable */
// @ts-nocheck

import { Drawer, Modal, notification } from "antd";
import Image from "next/image";
import React, { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FormOutlined,
} from "@ant-design/icons";

import {
  AirplaneIcon,
  FilterIcon,
  LuggageIcon,
  NoFlightFound,
} from "@/app/assets/images";
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
  isUserAuthenticated,
  setLocalStorage,
  showCustomToastError,
  signoutBySessionId,
} from "@/app/utils/ui";
import {
  changeCabinClassName,
  checkAirlineImages,
  checkAirlineName,
  checkBaggageInfo,
  checkIfFlightHasMoreSegments,
  checkNumberOfStops,
  checkRefundStatus,
  convertFlightTime,
  convertPriceIntoStandardPriceFormat,
} from "./flightUtils";
import LoginModal from "./LoginModal";
import VerifyUserEmail from "./verifyUserEmail";
import { fetchFareRule, ReduxState, userInfoFetch } from "@/app/redux";
import {
  AIRLINE_STATUS,
  appConfig,
  ERROR_CODE,
  PNR_SESSION_TIME,
  PNR_SESSION_TIME_LIMIT,
  refundStatusConfig,
} from "@/app/constants/ui/app-config";
import CustomLabel from "../../../CustomLabel";
import DefaultAirlineImageView from "./defaultAirlineImageView";
import ImageWrapper from "./imageWrapper";
import FlightDetailsForMobileView from "./flightDetailsForMobileView";
import FlightDetails from "@/app/ui/components/Common/SearchedFlights/_helpers/flightDetails";

type NotificationType = "success" | "info" | "warning" | "error";

const FlightListsForMobileView: React.FC<AllFlightListDetailProps> = (
  props,
) => {
  const {
    flightDetailLists,
    handleFlightPriceSort,
    flightPriceSort,
    searchFlightAirlineList,
    searchFlightAirportInfoList,
    noFlightFound,
    airlineImageLists,
    setOpenFlightFilterDrawer,
    setOpenSearchFlightForSmallScreenSize,
    isFlightPriceSortEmpty,
    flightAds,
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
    oldFareData,
    setOldFareData,
    newFareData,
    setNewFareData,
  } = props;

  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const [flightRefs, setFlightRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [openFlightDetailMobileView, setOpenFlightDetailMobileView] = useState<
    number | null
  >(null);

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Warning",
      description:
        "Please reach out to the support team to proceed with the booking.",
    });
  };
  const FlightDetailViewForMobile = (props: any) => {
    const { flightDetails, setOpenFlightDetailMobileView } = props;

    setSingleFlightDetailForStorage(flightDetails);
    setOldFareData(flightDetails?.fareInfo?.totalFinalFare);

    return (
      <FlightDetailsForMobileView
        flightDetails={flightDetails}
        searchFlightAirportInfoList={searchFlightAirportInfoList}
        searchFlightAirlineList={searchFlightAirlineList}
        handleBookFlight={handleBookFlight}
        from="flightlist"
        setOpenFlightDetail={setOpenFlightDetailMobileView}
      />
    );
  };

  const handleFlightDetailView = (flightIndex: number) => {
    if (flightIndex === openFlightDetailMobileView)
      setOpenFlightDetailMobileView(null);
    else {
      setOpenFlightDetailMobileView(flightIndex);
      const selectedDiv = flightRefs[flightIndex]?.current;
      if (selectedDiv) {
        selectedDiv.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <div className="flight-details__mobile-view">
      {noFlightFound || isFlightPriceSortEmpty ? (
        <div className="no-flight-found">
          <Image src={NoFlightFound} alt="no flight" />
          <h1>No flights found</h1>
        </div>
      ) : (
        <div className="flight-details-mobile">
          {contextHolder}
          <div className="flight-details-filter-modify-headers">
            <div onClick={() => setOpenSearchFlightForSmallScreenSize(true)}>
              <FormOutlined style={{ color: "#A4A4A4" }} />
              <p>Modify</p>
            </div>
            <div
              onClick={() => {
                setOpenFlightFilterDrawer(true);
              }}
            >
              <p>Filter</p>
              <Image src={FilterIcon} width={14} height={14} />
            </div>
          </div>
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
                  <div
                    className={
                      openFlightDetailMobileView === flightIndex
                        ? "flight-details__single-trip-detail-active"
                        : "flight-details__single-trip-detail"
                    }
                    key={flightIndex}
                    onClick={() => handleFlightDetailView(flightIndex)}
                    ref={flightRefs[flightIndex]}
                  >
                    <div className="single-trip-detail__main-section">
                      {flight?.segmentInfos?.map(
                        (flightDetail: SegmentInfo, flightIndex) => (
                          <>
                            <div className="main-section__top">
                              <div className="top__airline-section">
                                <div className="airline-section__airline-image">
                                  {checkAirlineImageLink(
                                    airlineImageLists,
                                    flightDetail?.flightInfos?.[0].airline,
                                  )}
                                </div>
                                <div className="airline-section__airline-name">
                                  {checkAirlineName(
                                    searchFlightAirlineList,
                                    flightDetail?.flightInfos?.[0].airline,
                                  )}
                                </div>
                              </div>
                              {flightIndex === 0 && (
                                <div className="top__flight-class-section">
                                  <p className="flight-class-section__class-type">
                                    {" "}
                                    {changeCabinClassName(
                                      flight.segmentInfos?.[0]
                                        ?.cabinClassInfos?.[0]?.cabinClass,
                                    )}
                                  </p>{" "}
                                  <p className="price-details__refundable">
                                    {checkRefundStatus(
                                      flight?.fareInfo?.refundStatus,
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div
                              className={"main-section__middle"}
                              style={{
                                borderBottom:
                                  flightIndex !== 0
                                    ? "1px solid #e6ebef"
                                    : "1px dashed #e6ebef",
                              }}
                            >
                              <div className="middle__origin-detail">
                                <p className="origin-detail__flight-time">
                                  {convertFlightTime(
                                    flightDetail?.flightInfos?.[0].timeInfo
                                      ?.timeOfDeparture,
                                  )}
                                </p>
                                <div className="origin-detail__flight-location">
                                  <p className="flight-location__location-code">
                                    {flightDetail.flightInfos[0].origin.code}
                                  </p>
                                </div>
                              </div>
                              <div className="middle__stop-detail">
                                <div className="stop-detail__more-info">
                                  <p>
                                    {convertTimeToStandardTime(
                                      flightDetail?.elapsedFlyingTime,
                                    )}
                                  </p>
                                  <div className="stop-info"></div>
                                  <div className="stop-info__icon-section">
                                    {Array(
                                      flightDetail?.flightInfos?.length - 1,
                                    )
                                      .fill(null)
                                      .map((_, i) => (
                                        <div
                                          className="stop-info__detail"
                                          key={i}
                                        />
                                      ))}
                                  </div>
                                  <p>{checkNumberOfStops(flightDetail)}</p>
                                </div>
                              </div>
                              <div className="middle__destination-detail">
                                <p className="destination-detail__flight-time">
                                  {convertFlightTime(
                                    flightDetail?.flightInfos[
                                      flightDetail?.flightInfos?.length - 1
                                    ].timeInfo?.timeOfArrival,
                                  )}
                                </p>
                                <div className="destination-detail__flight-location">
                                  <p className="flight-location__location-code">
                                    {
                                      flightDetail.flightInfos[
                                        flightDetail?.flightInfos?.length - 1
                                      ].destination.code
                                    }
                                  </p>
                                  <p className="flight-location__location-name">
                                    {checkAirportLocationName(
                                      flightDetail?.flightInfos?.[
                                        flightDetail?.flightInfos?.length - 1
                                      ].destination?.code,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {flightIndex !== 0 && (
                              <div className="main-section__bottom">
                                <div className="bottom__luggage-info">
                                  {flightDetail?.flightInfos?.[0].baggageInfo
                                    ?.checkedBaggage && (
                                      <div className="luggage-info__check-baggage">
                                        <Image src={LuggageIcon} alt="luggae" />
                                        <p>
                                          {checkBaggageInfo(
                                            flightDetail?.flightInfos?.[0]
                                              ?.baggageInfo,
                                          )}
                                        </p>
                                      </div>
                                    )}
                                </div>
                                <div className="bottom__price-section">
                                  <div className="price-section__currency">
                                    <p className="currency__type">
                                      {flight?.fareInfo?.currency}
                                    </p>

                                    <p className="currency__total-price">
                                      {convertPriceIntoStandardPriceFormat(
                                        flight?.fareInfo?.totalFinalFare,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ),
                      )}
                    </div>
                    {openFlightDetailMobileView === flightIndex && (
                      <Drawer
                        open={openFlightDetailMobileView === flightIndex}
                        placement="bottom"
                      >
                        <FlightDetailViewForMobile
                          flightDetails={flight}
                          setOpenFlightDetailMobileView={
                            setOpenFlightDetailMobileView
                          }
                        />
                      </Drawer>
                    )}
                  </div>
                ) : (
                  <div
                    className={
                      openFlightDetailMobileView === flightIndex
                        ? "flight-details__single-trip-detail-active"
                        : "flight-details__single-trip-detail"
                    }
                    key={flightIndex}
                    onClick={() => handleFlightDetailView(flightIndex)}
                    ref={flightRefs[flightIndex]}
                  >
                    <div className="single-trip-detail__main-section">
                      {flight?.segmentInfos?.map(
                        (flightDetail: SegmentInfo, flightIndex) => (
                          <>
                            <div className="main-section__top">
                              <div className="top__airline-section">
                                <div className="airline-section__airline-image">
                                  {checkAirlineImageLink(
                                    airlineImageLists,
                                    flightDetail?.flightInfos?.[0].airline,
                                  )}
                                </div>
                                <div className="airline-section__airline-name">
                                  {checkAirlineName(
                                    searchFlightAirlineList,
                                    flightDetail?.flightInfos?.[0].airline,
                                  )}
                                </div>
                              </div>
                              <div className="top__flight-class-section">
                                <p className="flight-class-section__class-type">
                                  {" "}
                                  {changeCabinClassName(
                                    flight.segmentInfos?.[0]
                                      ?.cabinClassInfos?.[0]?.cabinClass,
                                  )}
                                </p>{" "}
                                <p className="price-details__refundable">
                                  {checkRefundStatus(
                                    flight?.fareInfo?.refundStatus,
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="main-section__middle ">
                              <div className="middle__origin-detail">
                                <p className="origin-detail__flight-time">
                                  {convertFlightTime(
                                    flightDetail?.flightInfos?.[0].timeInfo
                                      ?.timeOfDeparture,
                                  )}
                                </p>
                                <div className="origin-detail__flight-location">
                                  <p className="flight-location__location-code">
                                    {flightDetail.flightInfos[0].origin.code}
                                  </p>
                                </div>
                              </div>
                              <div className="middle__stop-detail">
                                <div className="stop-detail__more-info">
                                  <p>
                                    {convertTimeToStandardTime(
                                      flightDetail?.elapsedFlyingTime,
                                    )}
                                  </p>
                                  <div className="stop-info"></div>
                                  <div className="stop-info__icon-section">
                                    {Array(
                                      flightDetail?.flightInfos?.length - 1,
                                    )
                                      .fill(null)
                                      .map((_, i) => (
                                        <div
                                          className="stop-info__detail"
                                          key={i}
                                        />
                                      ))}
                                  </div>
                                  <p>{checkNumberOfStops(flightDetail)}</p>
                                </div>
                              </div>
                              <div className="middle__destination-detail">
                                <p className="destination-detail__flight-time">
                                  {convertFlightTime(
                                    flightDetail?.flightInfos[
                                      flightDetail?.flightInfos?.length - 1
                                    ].timeInfo?.timeOfArrival,
                                  )}
                                </p>
                                <div className="destination-detail__flight-location">
                                  <p className="flight-location__location-code">
                                    {
                                      flightDetail.flightInfos[
                                        flightDetail?.flightInfos?.length - 1
                                      ].destination.code
                                    }
                                  </p>
                                  <p className="flight-location__location-name">
                                    {checkAirportLocationName(
                                      flightDetail?.flightInfos?.[
                                        flightDetail?.flightInfos?.length - 1
                                      ].destination?.code,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="main-section__bottom">
                              <div className="bottom__luggage-info">
                                {flightDetail?.flightInfos?.[0].baggageInfo
                                  ?.checkedBaggage && (
                                    <div className="luggage-info__check-baggage">
                                      <Image src={LuggageIcon} alt="luggae" />
                                      <p>
                                        {checkBaggageInfo(
                                          flightDetail?.flightInfos?.[0]
                                            ?.baggageInfo,
                                        )}
                                      </p>
                                    </div>
                                  )}
                              </div>
                              <div className="bottom__price-section">
                                <div className="price-section__currency">
                                  <p className="currency__type">
                                    {flight?.fareInfo?.currency}
                                  </p>

                                  <p className="currency__total-price">
                                    {convertPriceIntoStandardPriceFormat(
                                      flight?.fareInfo?.totalFinalFare,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ),
                      )}
                    </div>
                    {openFlightDetailMobileView === flightIndex && (
                      <Drawer
                        open={openFlightDetailMobileView === flightIndex}
                        placement="bottom"
                      >
                        <FlightDetailViewForMobile
                          flightDetails={flight}
                          setOpenFlightDetailMobileView={
                            setOpenFlightDetailMobileView
                          }
                        />
                      </Drawer>
                    )}
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightListsForMobileView;
