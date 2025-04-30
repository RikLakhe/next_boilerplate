/* eslint-disable */
// @ts-nocheck

import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import SearchFlightCommon from "./_helper/searchFlightCommon";
import { LocationDetails, TravellerCount } from "@/app/interfaces";
import { generateRandomNumber, isEmpty } from "@/app/utils/ui";
import { BannerInfo } from "@/pages/landing";

interface SearchFlightProps {
  setNoFlightFound: Dispatch<SetStateAction<boolean>>;
}

dayjs.extend(customParseFormat);

function SearchFlight(props: SearchFlightProps) {
  const { setNoFlightFound } = props;
  const router = useRouter();
  const [randomBannerIndex, setRandomBannerIndex] = useState(0);

  const [smallScreenSizeDetected, setSmallScreenSizeDetected] =
    useState<boolean>(false);
  const [
    openSearchFlightForSmallScreenSize,
    setOpenSearchFlightForSmallScreenSize,
  ] = useState<boolean>(false);

  const [_isFlightSearched, setIsFlightSearched] = useState<boolean>(false);
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

  const [travellerCount, setTravellerCount] = useState<TravellerCount>({
    adults: 1,
    childrens: 0,
    infants: 0,
  });

  const [departingDateParams, setDepartingDateParams] = useState<string>("");
  const [returningDateParams, setReturningDateParams] = useState<string>("");
  const [tripType, setTripType] = useState("one-way");
  const [totalTravellerCount, setTotalTravellerCount] = useState(1);

  const { flightConfigPayload } = useSelector(
    (state: flightSliceState) => state.flight,
  );
  const toggleSearchFlightDrawerForSmallScreenSize = () => {
    setOpenSearchFlightForSmallScreenSize((prevState) => !prevState);
  };

  useEffect(() => {
    if (!isEmpty(router.query)) {
      setIsFlightSearched(true);
      if (typeof window !== "undefined") {
        if (window.innerWidth < 800) {
          setSmallScreenSizeDetected(true);
        }
      }
    } else {
      setIsFlightSearched(false);
      setSmallScreenSizeDetected(false);
    }
  }, [router]);

  useEffect(() => {
    if (flightConfigPayload) {
      const randomIndex = generateRandomNumber(
        flightConfigPayload?.dashboard?.banners?.length - 1,
      );
      setRandomBannerIndex(randomIndex);
    }
  }, [flightConfigPayload]);

  return (
    <div>
      <BannerInfo
        flightConfigPayload={flightConfigPayload}
        randomBannerIndex={randomBannerIndex}
        tripType={tripType}
      />
      <SearchFlightCommon
        setNoFlightFound={setNoFlightFound}
        smallScreenSizeDetected={smallScreenSizeDetected}
        toggleSearchFlightDrawerForSmallScreenSize={
          toggleSearchFlightDrawerForSmallScreenSize
        }
        originPlace={originPlace}
        setOriginPlace={setOriginPlace}
        destinationPlace={destinationPlace}
        setDestinationPlace={setDestinationPlace}
        travellerCount={travellerCount}
        setTravellerCount={setTravellerCount}
        departingDateParams={departingDateParams}
        setDepartingDateParams={setDepartingDateParams}
        returningDateParams={returningDateParams}
        setReturningDateParams={setReturningDateParams}
        tripType={tripType}
        setTripType={setTripType}
        totalTravellerCount={totalTravellerCount}
        setTotalTravellerCount={setTotalTravellerCount}
      />
    </div>
  );
}

export default SearchFlight;
