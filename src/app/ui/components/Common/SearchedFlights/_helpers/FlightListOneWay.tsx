/* eslint-disable */
// @ts-nocheck

import React, { useEffect } from "react";
import Image from "next/image";

import { SegmentInfo } from "@/app/interfaces";
import { LuggageIcon } from "@/app/assets/images";
import { convertTimeToStandardTime, isEmpty } from "@/app/utils/ui";
import {
  changeCabinClassName,
  checkAirlineName,
  checkBaggageInfo,
  checkNumberOfStops,
  checkRefundStatus,
  convertFlightTime,
  convertPriceIntoStandardPriceFormat,
} from "@/app/ui/components/Common/SearchedFlights/_helpers/flightUtils";
import { countryConfig } from "@/app/constants/ui/app-config";

interface FlightListOneWayInterfaces {
  flight: any;
  flightIndex: number;
  openFlightDetail: booelan;
  flightRefs: any;
  handleFlightDetailView: any;
  checkAirlineImageLink: any;
  airlineImageLists: any;
  searchFlightAirlineList: any;
  checkAirportLocationName: any;
  FlightDetailView: any;
}

export const FlightListOneWay = (props: FlightListOneWayInterfaces) => {
  const {
    flight,
    flightIndex,
    openFlightDetail,
    flightRefs,
    handleFlightDetailView,
    checkAirlineImageLink,
    airlineImageLists,
    searchFlightAirlineList,
    checkAirportLocationName,
    FlightDetailView,
  } = props;

  return (
    <div
      className={
        openFlightDetail === flightIndex
          ? "flight-details__single-trip-detail-active"
          : "flight-details__single-trip-detail"
      }
      key={flightIndex}
      onClick={() => handleFlightDetailView(flightIndex)}
      ref={flightRefs[flightIndex]}
    >
      <div className="single-trip-detail__main-section">
        <div className="single-trip-details__left-section">
          {flight?.segmentInfos?.map(
            (flightDetail: SegmentInfo, flightIndex) => (
              <div
                className="single-trip-detail__main-detail"
                key={flightIndex}
              >
                {flightDetail?.flightInfos?.length > 1 ? (
                  <div className="main-details__more-stops">
                    <div className="more-stops__left-section">
                      <div className="left-section__airline-detail">
                        {checkAirlineImageLink(
                          airlineImageLists,
                          flightDetail?.flightInfos?.[0].airline,
                        )}

                        <p>
                          {checkAirlineName(
                            searchFlightAirlineList,
                            flightDetail?.flightInfos?.[0].airline,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="more-stops__middle-section">
                      <div className="middle-section__origin-detail">
                        <p className="origin-detail__flight-time">
                          {convertFlightTime(
                            flightDetail?.flightInfos?.[0].timeInfo
                              ?.timeOfDeparture,
                          )}
                        </p>
                        <div className="origin-detail__flight-location">
                          <p className="flight-location__location-name">
                            {checkAirportLocationName(
                              flightDetail?.flightInfos?.[0].origin.code,
                            )}
                          </p>
                          <p className="flight-location__location-code">
                            {flightDetail.flightInfos[0].origin.code}
                          </p>
                        </div>
                      </div>
                      <div className="middle-section__stop-detail">
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
                        <div className="stop-detail__luggage-info">
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
                      </div>
                      <div className="middle-section__destination-detail">
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
                  </div>
                ) : (
                  <div className="main-details__non-stop">
                    <div className="non-stop__left-section">
                      <div className="left-section__airline-detail">
                        {checkAirlineImageLink(
                          airlineImageLists,
                          flightDetail?.flightInfos?.map(
                            (flightInfo) => flightInfo?.airline,
                          ),
                        )}

                        <p>
                          {flightDetail?.flightInfos?.map((flightInfo) =>
                            checkAirlineName(
                              searchFlightAirlineList,
                              flightInfo?.airline,
                            ),
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="non-stop__middle-section">
                      <div className="middle-section__origin-detail">
                        <p className="origin-detail__flight-time">
                          {flightDetail?.flightInfos?.map((flightInfo) =>
                            convertFlightTime(
                              flightInfo?.timeInfo?.timeOfDeparture,
                            ),
                          )}
                        </p>
                        <div className="origin-detail__flight-location">
                          <p className="flight-location__location-name">
                            {flightDetail?.flightInfos?.map((flightInfo) =>
                              checkAirportLocationName(
                                flightInfo?.origin?.code,
                              ),
                            )}
                          </p>
                          <p className="flight-location__location-code">
                            {flightDetail?.flightInfos?.map(
                              (flightInfo) => flightInfo?.origin?.code,
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="middle-section__stop-detail">
                        <div className="stop-detail__more-info">
                          <p>
                            {convertTimeToStandardTime(
                              flightDetail?.elapsedFlyingTime,
                            )}
                          </p>
                          <div className="stop-info"></div>
                          <p>Nonstop</p>
                        </div>
                        <div className="stop-detail__luggage-info">
                          {flightDetail?.flightInfos?.map(
                            (flightInfo, flightInfoIndex) =>
                              flightInfo?.baggageInfo?.checkedBaggage && (
                                <div
                                  className="luggage-info__check-baggage"
                                  key={flightInfoIndex}
                                >
                                  <Image src={LuggageIcon} alt="luggae" />
                                  <p>
                                    {checkBaggageInfo(flightInfo?.baggageInfo)}
                                  </p>
                                </div>
                              ),
                          )}
                        </div>
                      </div>
                      <div className="middle-section__destination-detail">
                        <p className="destination-detail__flight-time">
                          {flightDetail?.flightInfos?.map((flightInfo) =>
                            convertFlightTime(
                              flightInfo?.timeInfo?.timeOfArrival,
                            ),
                          )}
                        </p>
                        <div className="destination-detail__flight-location">
                          <p className="flight-location__location-code">
                            {flightDetail?.flightInfos?.map(
                              (flightInfo) => flightInfo?.destination?.code,
                            )}
                          </p>
                          <p className="flight-location__location-name">
                            {flightDetail?.flightInfos?.map((flightInfo) =>
                              checkAirportLocationName(
                                flightInfo?.destination?.code,
                              ),
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
        <div className="non-stop__right-section">
          <div className="right-section__price-details">
            <div className="price-details__flight-class-type">
              <p>
                {changeCabinClassName(
                  flight.segmentInfos?.[0]?.cabinClassInfos?.[0]?.cabinClass,
                )}
              </p>
            </div>
            <div className="price-details__currency">
              <p className="currency__type">{flight?.fareInfo?.currency}</p>

              <p className="currency__total-price">
                {convertPriceIntoStandardPriceFormat(
                  flight?.fareInfo?.totalFinalFare,
                )}
              </p>
            </div>
            <p className="price-details__refundable">
              {checkRefundStatus(flight?.fareInfo?.refundStatus)}
            </p>
          </div>
        </div>
      </div>
      {openFlightDetail === flightIndex && (
        <FlightDetailView flightDetails={flight} />
      )}
      {openFlightDetail === flightIndex ? (
        <div className="flight-details__view-hide-detail">
          <p>Hide Details</p>
        </div>
      ) : (
        <div className="flight-details__view-hide-detail">
          <p>Flight Details</p>
        </div>
      )}
    </div>
  );
};
