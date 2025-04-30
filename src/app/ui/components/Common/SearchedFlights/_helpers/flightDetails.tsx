/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  DesktopOutlined,
  LoadingOutlined,
  TagOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

import {
  checkAirlineImages,
  checkAirlineName,
  checkIfFlightHasMoreSegments,
  convertFlightTime,
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
  TravelData,
} from "@/app/interfaces";
import { PowerOutletIcon } from "@/app/assets/images";
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
}

function FlightDetails(props: FlightDetailProps) {
  const { flightDetails, handleBookFlight } = props;
  const router = useRouter();

  const [isTheFlightDomesticOrNot, setIsTheFlightDomesticOrNot] =
    useState(false);

  const { userInfoFetchLoading } = useSelector((state: any) => state.userAuth);
  const {
    flightTicketFareRuleLoading,
    searchFlightAirportInfoList,
    searchFlightAirlineList,
    airlineImageLists,
    flightConfigPayload,
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
  useEffect(() => {
    if (!isEmpty(flightDetails)) {
      const originCountry =
        flightDetails?.segmentInfos?.[0]?.flightInfos[0]?.origin?.country;
      const destinationCountry =
        flightDetails?.segmentInfos?.[flightDetails?.segmentInfos?.length - 1]
          ?.flightInfos[0]?.destination?.country;

      if (
        originCountry === countryConfig?.NEPAL &&
        destinationCountry === countryConfig?.NEPAL
      ) {
        setIsTheFlightDomesticOrNot(true);
      } else {
        setIsTheFlightDomesticOrNot(false);
      }
    }
  }, [flightDetails]);

  const displayFlightAmenities = (flightAmenities: string[]) => {
    return flightAmenities?.map((amenities: string, amenitiesIndex: number) => (
      <div className="right-section__amenities-info" key={amenitiesIndex}>
        {(() => {
          switch (amenities?.toUpperCase()) {
            case amenitiesConfig.MOVIE:
              return (
                <>
                  <DesktopOutlined />
                  <div className="amenities-info__detail">Movie</div>
                </>
              );
            case amenitiesConfig.INTERNET:
            case amenitiesConfig.WIFI:
              return (
                <>
                  <WifiOutlined />
                  <div className="amenities-info__detail">Wi-fi</div>
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
                  <div className="amenities-info__detail">Power Outlet</div>
                </>
              );
            case amenitiesConfig.DUTY_FREE:
              return (
                <>
                  <TagOutlined />
                  <div className="amenities-info__detail">Duty Free Sales</div>
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
    <div className="flight-details__web-view">
      {checkIfFlightHasMoreSegments(flightDetails) ? (
        flightDetails?.segmentInfos?.map(
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
                      {flightDetails?.tripType === "MULTI_CITY"
                        ? "Depart"
                        : segmentDetail?.segRef === 1
                          ? "Depart"
                          : "Return"}
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
                <div className="view-section__flight-stop-details-web">
                  {segmentDetail?.flightInfos?.map(
                    (flightStop: FlightInfo, flightStopIndex: number) => (
                      <div key={flightStopIndex}>
                        <div className="flight-stop-details">
                          <div className="left-section">
                            {checkAirlineImageLink(
                              airlineImageLists,
                              flightStop?.airline,
                            )}
                            <p className="airline-name">
                              {checkAirlineName(
                                searchFlightAirlineList,
                                flightStop?.airline,
                              )}
                            </p>
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
                                  <p className="airport-name">
                                    {" "}
                                    {checkAirportName(flightStop?.origin?.code)}
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
                                  <p className="airport-name">
                                    {" "}
                                    {checkAirportName(
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
                          <div
                            className={
                              isForFlightBook()
                                ? "transit-info-book"
                                : "transit-info-web"
                            }
                          >
                            <p className="transit-location">
                              {`Change plane at ${checkAirportLocationName(
                                flightStop?.destination?.code,
                              )}`}
                            </p>
                            <p className="transit-time">{`Transist time: ${convertTimeToStandardTime(
                              flightStop?.transitTime,
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
                      : "book-btn"
                  }
                >
                  <Button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookFlight();
                    }}
                    loading={
                      flightTicketFareRuleLoading || userInfoFetchLoading
                    }
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ),
        )
      ) : (
        <div className="flight-details__view-section">
          <div
            className={
              isForFlightBook()
                ? "view-section__flight-detail-book"
                : "view-section__flight-detail"
            }
          >
            <div className="flight-detail__departing">
              <strong>Depart-</strong>{" "}
              {convertDateIntoDayFormat(
                flightDetails?.segmentInfos?.[0]?.flightInfos[0]?.timeInfo
                  ?.dateOfDeparture,
              )}
            </div>
            <div className="flight-detail__location">
              <p className="location__departing_code">
                {
                  flightDetails?.segmentInfos?.[0]?.flightInfos?.[0]?.origin
                    ?.code
                }
              </p>{" "}
              &nbsp; <p>-</p> &nbsp;
              <p className="location__destination-code">
                {
                  flightDetails?.segmentInfos?.[0]?.flightInfos[
                    flightDetails?.segmentInfos?.[0]?.flightInfos?.length - 1
                  ]?.destination?.code
                }
              </p>
            </div>
            <div className="flight-detail__arriving">
              <strong>Arrives -</strong>{" "}
              {convertDateIntoDayFormat(
                flightDetails?.segmentInfos?.[0]?.flightInfos[
                  flightDetails?.segmentInfos?.[0]?.flightInfos?.length - 1
                ]?.timeInfo?.dateOfArrival,
              )}{" "}
            </div>
          </div>
          <div className="view-section__flight-stop-details-web">
            {flightDetails?.segmentInfos?.[0]?.flightInfos.map(
              (flightStop: FlightInfo, flightStopIndex: number) => (
                <div key={flightStopIndex}>
                  <div className="flight-stop-details">
                    <div className="left-section">
                      {checkAirlineImageLink(
                        airlineImageLists,
                        flightStop?.airline,
                      )}
                      <p className="airline-name">
                        {checkAirlineName(
                          searchFlightAirlineList,
                          flightStop?.airline,
                        )}
                      </p>
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
                            <p className="airport-name">
                              {" "}
                              {checkAirportName(flightStop?.origin?.code)}
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
                            <p className="airport-name">
                              {" "}
                              {checkAirportName(flightStop?.destination?.code)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="stop-flight-time">
                        <div className="circle" />
                        <div className="flying-time-section">
                          <div className="middle-line" />
                          <p>
                            {convertTimeToStandardTime(flightStop?.flyingTime)}
                          </p>
                        </div>
                        <div className="circle" />
                      </div>
                    </div>
                    {!isEmpty(flightStop?.amenities) && (
                      <div
                        className={
                          isForFlightBook()
                            ? "right-section-book"
                            : "right-section"
                        }
                      >
                        {displayFlightAmenities(flightStop?.amenities)}
                      </div>
                    )}
                  </div>
                  {flightStop?.transitTime !== 0 && (
                    <div
                      className={
                        isForFlightBook()
                          ? "transit-info-book"
                          : "transit-info-web"
                      }
                    >
                      <p className="transit-location">
                        {`Change plane at ${checkAirportLocationName(
                          flightStop?.destination?.code,
                        )}`}
                      </p>
                      <p className="transit-time">{`Transist time : ${convertTimeToStandardTime(
                        flightStop?.transitTime,
                      )}`}</p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
          <div className={isForFlightBook() ? "button-section-hidden" : ""}>
            <div className="book-btn">
              <Button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookFlight();
                }}
                loading={flightTicketFareRuleLoading || userInfoFetchLoading}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDetails;
