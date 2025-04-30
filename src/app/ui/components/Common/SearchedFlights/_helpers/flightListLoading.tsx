/* eslint-disable */
// @ts-nocheck

import { AfnuuIcon, AirlinePlaneImage, LoadingSearch } from "@/app/assets/images";
import { appConfig, tripConfig } from "@/app/constants/ui/app-config";
import { LocationDetails } from "@/app/interfaces";
import { generateRandomNumber, getLocalStorage, isEmpty } from "@/app/utils/ui";
import { LoadingOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type TripType = "one-way" | "round-trip" | "multi-city";

function FlightListLoading() {
  const [tripType, setTripType] = useState<TripType>("one-way");
  const router = useRouter();
  const [randomBannerIndex, setRandomBannerIndex] = useState(0);

  const [originPlace, setOriginPlace] = useState<LocationDetails>({
    location: "",
    locationCode: (router?.query?.from as string) || "",
    locationCountry: "",
  });
  const [destinationPlace, setDestinationPlace] = useState<LocationDetails>({
    location: "",
    locationCode: (router?.query?.to as string) || "",
    locationCountry: "",
  });

  const [mulitcitySearchData, setMulticitySearchData] = useState({});

  useEffect(() => {
    if (router?.query?.tripType) {
      const trip = router?.query?.tripType as TripType;
      setTripType(trip);
    }
  }, [router.query]);
  const { flightConfigPayload } = useSelector(
    (state: flightSliceState) => state.flight,
  );
  useEffect(() => {
    if (!isEmpty(getLocalStorage(appConfig.FLIGHT_SEARCH_INFO))) {
      const searchFlightInfo = getLocalStorage(appConfig.FLIGHT_SEARCH_INFO);
      setOriginPlace({
        location: searchFlightInfo?.tripsDetail?.originLocation,
        locationCode: searchFlightInfo?.tripsDetail?.originCode,
        locationCountry: searchFlightInfo?.tripsDetail?.originLocationCountry,
      });
      setDestinationPlace({
        location: searchFlightInfo?.tripsDetail?.destinationLocation,
        locationCode: searchFlightInfo?.tripsDetail?.destinationCode,
        locationCountry:
          searchFlightInfo?.tripsDetail?.destinationLocationCountry,
      });
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(getLocalStorage(appConfig.MULTI_CITY_FLIGHT_SEARCH_INFO))) {
      const searchFlightInfo = getLocalStorage(
        appConfig.MULTI_CITY_FLIGHT_SEARCH_INFO,
      );
      setMulticitySearchData(searchFlightInfo);
    }
  }, []);

  useEffect(() => {
    if (flightConfigPayload) {
      const randomIndex = generateRandomNumber(
        flightConfigPayload && flightConfigPayload?.loaders?.length - 1,
      );
      setRandomBannerIndex(randomIndex);
    }
  }, []);

  return (
    <div className="flight-details__loading">
      <div className="loading__left-section">
        {!isEmpty(flightConfigPayload) ? (
          <img src={flightConfigPayload?.loaders[randomBannerIndex]?.image} />
        ) : (
          <Image src={LoadingSearch} />
        )}
      </div>
      <div className="loading__right-section">
        {router.query.tripType === tripConfig?.MULTI_CITY ? (
          <div className="header__multi-city-flight-location">
            {mulitcitySearchData?.tripInfo?.trips?.map((trip, tripIndex) => (
              <div className="multi-city-flight">
                <p>{trip?.origin?.city || trip?.origin?.code}</p>
                <Image src={AirlinePlaneImage} alt="airplane" />
                <p> {trip?.destination?.city || trip?.destination?.code}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="header__flight-location">
            <p>{originPlace?.location || router.query?.from}</p>
            <Image src={AirlinePlaneImage} alt="airplane" />
            <p>{destinationPlace?.location || router.query?.to}</p>
            {router.query?.tripType === tripConfig?.TWO_WAY && (
              <>
                <Image src={AirlinePlaneImage} alt="airplane" />
                <p>{originPlace?.location || router.query?.from}</p>
              </>
            )}
          </div>
        )}

        <div className="searching">Searching flights...</div>
        <div>
          <LoadingOutlined style={{ fontSize: "44px" }} />
        </div>
      </div>
    </div>
  );
}

export default FlightListLoading;
