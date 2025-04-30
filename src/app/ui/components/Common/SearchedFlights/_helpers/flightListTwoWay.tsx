/* eslint-disable */
// @ts-nocheck

import React from "react";
import Image from "next/image";

import { LuggageIcon } from "@/app/assets/images";
import { convertTimeToStandardTime } from "@/app/utils/ui";
import { FLIGHT_INFO_TYPE } from "@/app/constants/ui/app-config";
import FlightType from "@/app/ui/components/Common/FlightDetailHeader/FlightType";
import {
  changeCabinClassName,
  checkAirlineName,
  checkBaggageInfo,
  checkNumberOfStops,
  checkRefundStatus,
  convertFlightTime,
  convertPriceIntoStandardPriceFormat,
} from "@/app/ui/components/Common/SearchedFlights/_helpers/flightUtils";

interface FlightListTwoWayInterfaces {
  flight: any;
  flightIndex: number;
  openMultipleFlightDetail: booelan;
  flightRefs: any;
  handleRoundTripFlightDetailView: any;
  checkAirlineImageLink: any;
  airlineImageLists: any;
  searchFlightAirlineList: any;
  checkAirportLocationName: any;
  FlightDetailView: any;
}

export const FlightListTwoWay = (props: FlightListTwoWayInterfaces) => {
  const {
    flight,
    flightIndex,
    openMultipleFlightDetail,
    flightRefs,
    handleRoundTripFlightDetailView,
    checkAirlineImageLink,
    airlineImageLists,
    searchFlightAirlineList,
    checkAirportLocationName,
    FlightDetailView,
  } = props;
  return (
    <div
      className={
        openMultipleFlightDetail === flightIndex
          ? "flight-details__round-trip-main-section-active"
          : "flight-details__round-trip-main-section"
      }
      key={flightIndex}
      onClick={() => handleRoundTripFlightDetailView(flightIndex)}
      ref={flightRefs[flightIndex]}
    >
      <div className={"flight-details__round-trip-detail"}>
        <div className="round-trip-details__left-section">
          {flight?.segmentInfos?.map((flightDetail, flightIndex) => (
            <div className="round-trip-detail__main-detail" key={flightIndex}>
              {flightDetail?.flightInfos?.length > 1 ? (
                <>
                  <FlightType
                    flightType={
                      flightIndex === 1
                        ? FLIGHT_INFO_TYPE.ARRIVAL
                        : FLIGHT_INFO_TYPE.DEPARTURE
                    }
                  />
                  <div className="main-details__more-stops">
                    <div className="more-stops__left-section">
                      <div className="left-section__airline-detail">
                        {checkAirlineImageLink(
                          airlineImageLists,
                          flightDetail?.flightInfos?.[0]?.airline,
                        )}
                        <p>
                          {checkAirlineName(
                            searchFlightAirlineList,
                            flightDetail?.flightInfos?.[0]?.airline,
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
                              ?.fill(null)
                              ?.map((_, i) => (
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
                                    flightDetail?.flightInfos[0]?.baggageInfo,
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
                </>
              ) : (
                <div className="main-details__non-stop">
                  <div className="non-stop__left-section">
                    <FlightType
                      flightType={
                        flightIndex === 1
                          ? FLIGHT_INFO_TYPE.ARRIVAL
                          : FLIGHT_INFO_TYPE.DEPARTURE
                      }
                    />

                    <div className="left-section__airline-detail">
                      {checkAirlineImageLink(
                        airlineImageLists,
                        flightDetail.flightInfos?.map(
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
                            checkAirportLocationName(flightInfo?.origin?.code),
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
                      <div className="origin-detail__flight-location"></div>
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
          ))}
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
      {openMultipleFlightDetail === flightIndex && (
        <FlightDetailView flightDetails={flight} />
      )}
      {openMultipleFlightDetail === flightIndex ? (
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
