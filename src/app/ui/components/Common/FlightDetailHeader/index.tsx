/* eslint-disable */
// @ts-nocheck

import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { TravelData } from "@/app/interfaces";
import { AirlinePlaneImage } from "@/app/assets/images";
import { appConfig, FLIGHT_BOARD_TYPE } from "@/app/constants/ui/app-config";
import {
  convertDateIntoDayYearFormat,
  decodeBase64DataIntoJsonParsedData,
  getLocalStorage,
  getNamePascalCase,
  isEmpty,
} from "@/app/utils/ui";
import CountDownTimer from "@/app/ui/components/Common/FlightDetailHeader/CountDownTimer";

export interface FlightDetailHeaderProps {
  setSavedChanged?: Dispatch<SetStateAction<boolean>>;
  flightDetail?: any;
}

function FlightDetailHeader(props: FlightDetailHeaderProps) {
  const { setSavedChanged, flightDetail } = props;
  const router = useRouter();
  const [flightDetails, setFlightDetails] = useState<TravelData | null>(null);
  const [flightDetailsFromDashboard, SetFlightDetailsFromDashboard] =
    useState<TravelData | null>(null);
  const [isThereFlightDataFromDashboard, setIsThereFlightDataFromDashboard] =
    useState<boolean>(false);
  const { searchFlightAirportInfoList } = useSelector(
    (state: any) => state.flight,
  );
  const [isTheTripTwoWayOrNot, setIsTheTripTwoWayOrNot] = useState(false);
  const [mulitcitySearchData, setMulticitySearchData] = useState({});

  const checkAirportLocationName = (airportCode: string = "") => {
    if (isThereFlightDataFromDashboard) {
      const airport = flightDetailsFromDashboard?.airportInfos?.find(
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
      return segmentDetails?.[0]?.offPoint;
    } else {
      const outBoundFlights = segmentDetails?.filter(
        (segmentDetail) =>
          segmentDetail?.type?.toUpperCase() === FLIGHT_BOARD_TYPE?.OUTBOUND,
      );
      if (outBoundFlights?.length === 0) {
        return segmentDetails?.[0]?.offPoint;
      }
      const sortedOutBoundFlights = outBoundFlights?.sort(
        (ascItem, descItem) =>
          parseInt(ascItem?.referenceNumber) -
          parseInt(descItem?.referenceNumber),
      );
      let outboundOffPoint = "";
      if (sortedOutBoundFlights?.length === 1) {
        outboundOffPoint = sortedOutBoundFlights?.[0]?.offPoint;
      } else {
        outboundOffPoint =
          sortedOutBoundFlights?.[sortedOutBoundFlights?.length - 1]?.offPoint;
      }
      return outboundOffPoint;
    }
  };

  const renderTrips = () => {
    const { trips } = mulitcitySearchData?.tripInfo || {};

    if (!trips || trips?.length === 0) return null;
    let result = trips[0]?.origin?.code;

    for (let i = 0; i < trips?.length - 1; i++) {
      const currentTrip = trips[i];
      const nextTrip = trips[i + 1];

      if (currentTrip?.destination?.code === nextTrip?.origin?.code) {
        result += `-${nextTrip?.origin?.code}`;
      } else {
        result += `-${currentTrip?.destination?.code}`;
        result += `, ${nextTrip?.origin?.code}`;
      }
    }

    if (!result.endsWith(trips[trips?.length - 1].destination?.code)) {
      result += `-${trips[trips?.length - 1].destination?.code}`;
    }
    const segments = result?.split("-");

    return (
      <>
        {segments?.map((segment, index) => (
          <React.Fragment key={index}>
            <p>{segment}</p>
            {index < segments.length - 1 && (
              <Image src={AirlinePlaneImage} alt="airplane" />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (!isEmpty(flightDetail)) {
      setIsThereFlightDataFromDashboard(true);
      SetFlightDetailsFromDashboard(flightDetail);
    }
  }, [flightDetail]);

  useEffect(() => {
    if (getLocalStorage(appConfig?.PNR_ID_FROM_DASHBOARD)) {
      const flightData = getLocalStorage(
        appConfig?.FLIGHT_DETAILS_FROM_DASHBOARD,
      );
      const parsedFlightDetailData =
        decodeBase64DataIntoJsonParsedData(flightData);
      if (parsedFlightDetailData) {
        setIsThereFlightDataFromDashboard(true);
        SetFlightDetailsFromDashboard(parsedFlightDetailData);
      }
    } else {
      const flightDetailData = getLocalStorage(appConfig?.FLIGHT_DETAILS);
      const parsedFlightDetailData =
        decodeBase64DataIntoJsonParsedData(flightDetailData);
      if (!isEmpty(parsedFlightDetailData)) {
        setIsThereFlightDataFromDashboard(false);
        setFlightDetails(parsedFlightDetailData);
      }
    }

    if (getLocalStorage(appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO)) {
      const flightData = getLocalStorage(
        appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO,
      );
      setMulticitySearchData(flightData);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(flightDetails)) {
      if (flightDetails?.segmentInfos?.length > 1) {
        setIsTheTripTwoWayOrNot(true);
      } else {
        setIsTheTripTwoWayOrNot(false);
      }
    }
    if (isThereFlightDataFromDashboard) {
      if (!isEmpty(flightDetailsFromDashboard)) {
        const isThereInboundType =
          flightDetailsFromDashboard?.segmentInfos?.some(
            (segment) => segment?.type === FLIGHT_BOARD_TYPE?.INBOUND,
          );
        setIsTheTripTwoWayOrNot(isThereInboundType);
      } else {
        setIsTheTripTwoWayOrNot(false);
      }
    }
  }, [flightDetails, flightDetailsFromDashboard]);

  return (
    <div className="flight-book__header">
      <div className="header__section">
        {!isEmpty(getLocalStorage(appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO)) ? (
          <div className="header__flight-location">{renderTrips()}</div>
        ) : (
          <div className="header__flight-location">
            <p>
              {checkAirportLocationName(
                isThereFlightDataFromDashboard
                  ? flightDetailsFromDashboard?.segmentInfos?.[0]?.boardPoint
                  : flightDetails?.segmentInfos?.[0]?.flightInfos[0]?.origin
                    ?.code,
              )}
            </p>
            <Image src={AirlinePlaneImage} alt="airplane" />
            <p>
              {checkAirportLocationName(
                isThereFlightDataFromDashboard
                  ? CheckTheFlightIsRoundTripOrNot(
                    flightDetailsFromDashboard?.segmentInfos,
                  )
                  : flightDetails?.segmentInfos?.[0]?.flightInfos[
                    flightDetails?.segmentInfos?.[0]?.flightInfos?.length - 1
                  ]?.destination?.code,
              )}
            </p>
            {isTheTripTwoWayOrNot && (
              <>
                <Image src={AirlinePlaneImage} alt="airplane" />
                <p>
                  {checkAirportLocationName(
                    isThereFlightDataFromDashboard
                      ? flightDetailsFromDashboard?.segmentInfos?.[0]
                        ?.boardPoint
                      : flightDetails?.segmentInfos?.[0]?.flightInfos[0]?.origin
                        ?.code,
                  )}
                </p>
              </>
            )}
          </div>
        )}
        <div className="header__flight-date">
          {!isEmpty(getLocalStorage(appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO))
            ? convertDateIntoDayYearFormat(
              mulitcitySearchData?.tripInfo?.trips?.[0]?.origin?.date,
            )
            : convertDateIntoDayYearFormat(
              isThereFlightDataFromDashboard
                ? flightDetailsFromDashboard?.segmentInfos?.[0]?.departureDate
                : flightDetails?.segmentInfos?.[0]?.flightInfos[0]?.timeInfo
                  .dateOfDeparture,
            )}
        </div>
        {!isEmpty(getLocalStorage(appConfig?.FLIGHT_SEARCH_INFO)) &&
          isTheTripTwoWayOrNot && (
            <div className="header__flight-date">
              {convertDateIntoDayYearFormat(
                isThereFlightDataFromDashboard
                  ? flightDetailsFromDashboard?.segmentInfos?.[
                    flightDetailsFromDashboard?.segmentInfos?.length - 1
                  ]?.arrivalDate
                  : flightDetails?.segmentInfos?.[
                    flightDetails?.segmentInfos?.length - 1
                  ]?.flightInfos[0]?.timeInfo.dateOfDeparture,
              )}
            </div>
          )}

        <div className="header__flight-traveller">
          {isThereFlightDataFromDashboard
            ? flightDetailsFromDashboard?.pnrInfo?.passengers?.length ?? 0
            : flightDetails?.fareInfo?.details?.length ?? 0}
          {isThereFlightDataFromDashboard
            ? flightDetailsFromDashboard?.pnrInfo?.passengers?.length! <= 1
              ? " Traveller"
              : " Travellers"
            : flightDetails?.fareInfo?.details?.length === 1
              ? " Traveller"
              : " Travellers"}
        </div>
        <div className="header__flight-stops">
          {isThereFlightDataFromDashboard ? (
            <span>
              {flightDetailsFromDashboard?.segmentInfos?.length! - 1 ?? 0}{" "}
              {flightDetailsFromDashboard?.segmentInfos?.length! - 1 === 1
                ? "Stop"
                : "Stops"}
            </span>
          ) : flightDetails?.segmentInfos &&
            flightDetails.segmentInfos[0]?.flightInfos ? (
            <span>
              {flightDetails?.segmentInfos?.[0]?.flightInfos?.length - 1}{" "}
              {flightDetails?.segmentInfos?.[0]?.flightInfos?.length - 1 === 1
                ? "Stop"
                : "Stops"}
            </span>
          ) : (
            <span>{""}</span>
          )}
        </div>
      </div>
      {router.pathname !== "/flightPayment" && (
        <div className="header__section-timer">
          <CountDownTimer setSavedChanged={setSavedChanged} />
        </div>
      )}
    </div>
  );
}

export default FlightDetailHeader;
