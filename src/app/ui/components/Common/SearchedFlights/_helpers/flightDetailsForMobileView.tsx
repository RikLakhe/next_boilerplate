/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ArrowRightOutlined,
  DesktopOutlined,
  LoadingOutlined,
  TagOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

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
import {
  convertDateIntoDayFormat,
  convertTimeToStandardTime,
  getNamePascalCase,
  isEmpty,
} from "@/app/utils/ui";
import {
  FlightAirlineInfo,
  FlightAirportInfo,
  FlightInfo,
  SegmentInfo,
  TravelData,
} from "@/app/interfaces";
import { LuggageIcon, PowerOutletIcon } from "@/app/assets/images";
import {
  amenitiesConfig,
  countryConfig,
  DOMESTIC_AIRLINES_POLICY_URL,
  PATH,
} from "@/app/constants/ui/app-config";
import DefaultAirlineImageView from "./defaultAirlineImageView";
import ImageWrapper from "./imageWrapper";

interface FlightDetailProps {
  flightDetails: TravelData | any;
  searchFlightAirportInfoList?: FlightAirportInfo;
  searchFlightAirlineList?: FlightAirlineInfo;
  handleBookFlight?: () => void;
  from?: string;
  setOpenFlightDetail?: any;
}

function FlightDetailsForMobileView(props: FlightDetailProps) {
  const { flightDetails, handleBookFlight, from, setOpenFlightDetail } = props;
  const router = useRouter();

  const { userInfoFetchLoading } = useSelector((state: any) => state.userAuth);
  const {
    flightTicketFareRuleLoading,
    searchFlightAirportInfoList,
    searchFlightAirlineList,
    airlineImageLists,
  } = useSelector((state: any) => state.flight);

  const checkAirportLocationName = (airportCode: string) => {
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
  };

  const checkAirportName = (airportCode: string) => {
    if (
      searchFlightAirportInfoList &&
      airportCode in searchFlightAirportInfoList
    ) {
      return getNamePascalCase(
        searchFlightAirportInfoList?.[airportCode]?.detailedName,
      );
    } else {
      return airportCode;
    }
  };

  const isForFlightBook = () => {
    return router.route === "/flightbook";
  };

  const isCurrentPathFlightBook = () => {
    return router?.pathname?.split("/")[1] === PATH.FLIGHTBOOK;
  };

  const checkAirlineImageLink = (
    airlineImageLists: [],
    airlineCode: string | any,
  ) => {
    if (checkAirlineImages(airlineImageLists, airlineCode)) {
      return (
        <ImageWrapper
          imageUrl={checkAirlineImages(airlineImageLists, airlineCode)}
          airlineCode={airlineCode}
        />
      );
    } else {
      return <DefaultAirlineImageView airlineCode={airlineCode} />;
    }
  };

  const displayFlightAmenities = (flightAmenities: string[]) => {
    return flightAmenities?.map((amenities: string, amenitiesIndex: number) => (
      <div className="right-section__amenities-info" key={amenitiesIndex}>
        {(() => {
          switch (amenities?.toUpperCase()) {
            case amenitiesConfig.MOVIE:
              return (
                <>
                  <DesktopOutlined />
                </>
              );
            case amenitiesConfig.INTERNET:
            case amenitiesConfig.WIFI:
              return (
                <>
                  <WifiOutlined />
                </>
              );
            case amenitiesConfig.POWER_SOURCE:
              return (
                <>
                  <Image
                    src={PowerOutletIcon}
                    alt="image"
                    width={13}
                    height={15}
                  />
                </>
              );
            case amenitiesConfig.DUTY_FREE:
              return (
                <>
                  <TagOutlined />
                </>
              );
            //no default
          }
        })()}
      </div>
    ));
  };

  const renderDestinationCode = (segment) => {
    return segment?.flightInfos?.[segment?.flightInfos?.length - 1]?.destination
      ?.code;
  };

  return (
    <div className="flight-detail-mobile-view">
      {from === "flightlist" && (
        <div className="trip-detail__top-section">
          <div className="single-trip-detail__main-section">
            {flightDetails?.segmentInfos?.map(
              (flightDetail: SegmentInfo, flightIndex: number) => (
                <div key={flightIndex}>
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
                            flightDetails.segmentInfos?.[0]
                              ?.cabinClassInfos?.[0]?.cabinClass,
                          )}
                        </p>{" "}
                        <p className="price-details__refundable">
                          {checkRefundStatus(
                            flightDetails?.fareInfo?.refundStatus,
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
                          {Array(flightDetail?.flightInfos?.length - 1)
                            .fill(null)
                            .map((_, i) => (
                              <div className="stop-info__detail" key={i} />
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
                                  flightDetail?.flightInfos?.[0]?.baggageInfo,
                                )}
                              </p>
                            </div>
                          )}
                      </div>
                      <div className="bottom__price-section">
                        <div className="price-section__currency">
                          <p className="currency__type">
                            {flightDetails?.fareInfo?.currency}
                          </p>

                          <p className="currency__total-price">
                            {convertPriceIntoStandardPriceFormat(
                              flightDetails?.fareInfo?.totalFinalFare,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <div
        className={
          from === "flightlist"
            ? "trip-detail__bottom-section-flightlist"
            : "trip-detail__bottom-section"
        }
      >
        {flightDetails?.segmentInfos?.map(
          (segmentDetail: any, segmentDetailIndex: number) => (
            <div key={segmentDetailIndex}>
              <div className="flight-details__view-section">
                <div
                  className={
                    isForFlightBook()
                      ? "view-section__flight-detail-book"
                      : "view-section__flight-detail"
                  }
                >
                  <div className="flight-detail__departing">
                    <strong>
                      {segmentDetail?.segRef === 1 ? "Depart" : "Return"}
                    </strong>{" "}
                    {convertDateIntoDayFormat(
                      segmentDetail?.flightInfos?.[0]?.timeInfo
                        ?.dateOfDeparture,
                    )}
                  </div>
                  <div className="flight-detail__location">
                    <p className="location__departing_code">
                      {segmentDetail?.flightInfos?.[0]?.origin?.code}
                    </p>{" "}
                    &nbsp; <p>-</p> &nbsp;
                    <p className="location__destination-code">
                      {renderDestinationCode(segmentDetail)}
                    </p>
                  </div>
                  <div className="flight-detail__arriving">
                    <strong>Arrives -</strong>{" "}
                    {convertDateIntoDayFormat(
                      segmentDetail?.flightInfos[
                        segmentDetail?.flightInfos?.length - 1
                      ]?.timeInfo?.dateOfArrival,
                    )}{" "}
                  </div>
                </div>
                <div className="view-section__flight-stop-details-mobile">
                  {segmentDetail?.flightInfos?.map(
                    (flightStop: FlightInfo, flightStopIndex: number) => (
                      <div key={flightStopIndex}>
                        <div className="flight-stop-details">
                          <div className="left-section">
                            {checkAirlineImageLink(
                              airlineImageLists,
                              flightStop?.airline,
                            )}

                            <p>
                              {flightStop?.airline} - {flightStop?.flightNumber}
                            </p>
                          </div>
                          <div className="middle-section">
                            <div className="stop-departure">
                              <div className="departure-datetime">
                                <p className="date">
                                  {convertDateIntoDayFormat(
                                    flightStop?.timeInfo?.dateOfDeparture,
                                  )}
                                </p>
                                <p className="time">
                                  {convertFlightTime(
                                    flightStop?.timeInfo?.timeOfDeparture,
                                  )}
                                </p>
                              </div>
                              <div className="departure-location">
                                <p className="location-code">
                                  {flightStop?.origin?.code}
                                </p>
                                <div className="location-name">
                                  <p>
                                    {checkAirportLocationName(
                                      flightStop?.origin?.code,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="stop-destination">
                              <div className="destination-datetime">
                                <p className="date">
                                  {convertDateIntoDayFormat(
                                    flightStop?.timeInfo?.dateOfArrival,
                                  )}
                                </p>
                                <p className="time">
                                  {convertFlightTime(
                                    flightStop?.timeInfo?.timeOfArrival,
                                  )}
                                </p>
                              </div>
                              <div className="destination-location">
                                <p className="location-code">
                                  {flightStop?.destination?.code}
                                </p>
                                <div className="location-name">
                                  <p>
                                    {checkAirportLocationName(
                                      flightStop?.destination?.code,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="stop-flight-time">
                              <div className="circle" />
                              <div className="flying-time-section">
                                <div className="middle-line" />
                                <p>
                                  {convertTimeToStandardTime(
                                    flightStop?.flyingTime,
                                  )}
                                </p>
                              </div>
                              <div className="circle" />
                            </div>
                          </div>
                          <div
                            className={
                              isForFlightBook()
                                ? "right-section-book"
                                : "right-section"
                            }
                          >
                            {displayFlightAmenities(flightStop?.amenities)}
                          </div>
                        </div>
                        {flightStop?.transitTime !== 0 && (
                          <div className={"transit-info-mobile"}>
                            <p className="transit-time">{`Transist time: ${convertTimeToStandardTime(
                              flightStop?.transitTime,
                            )} in ${checkAirportLocationName(
                              flightStop?.destination?.code,
                            )}`}</p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className={isForFlightBook() ? "button-section-hidden" : ""}>
                <div
                  className={
                    segmentDetailIndex !==
                      flightDetails?.segmentInfos?.length - 1
                      ? "book-btn-hidden"
                      : "book-btn-mobile"
                  }
                >
                  <Button
                    className="btn-primary-alternate "
                    onClick={() => setOpenFlightDetail(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookFlight && handleBookFlight();
                    }}
                    loading={
                      flightTicketFareRuleLoading || userInfoFetchLoading
                    }
                  >
                    Book Now
                    <ArrowRightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default FlightDetailsForMobileView;
