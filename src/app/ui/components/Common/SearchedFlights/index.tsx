/* eslint-disable */
// @ts-nocheck

import { Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import React, { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { TravelData } from "@/app/interfaces";
import FlightLists from "./_helpers/flightList";
import FlightFilters from "./_helpers/flightFilters";
import { pnrSessionSignout, ReduxState } from "@/app/redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import FlightListLoading from "./_helpers/flightListLoading";
import {
  appConfig,
  cabinClassConfig,
  FLIGHT_STOP_TYPES,
} from "@/app/constants/ui/app-config";
import {
  clearLocalStorage,
  generateRandomNumber,
  getLocalStorage,
  handleCustomSearch,
  isEmpty,
} from "@/app/utils/ui";
import FlightListsForMobileView from "./_helpers/flightListForMobileView";
import FlightListsForWebView from "@/app/ui/components/Common/SearchedFlights/_helpers/flightListForWebView";
import FlightList from "./_helpers/flightList";

interface SearchedFlightProps {
  noFlightFound: boolean;
  setOpenSearchFlightForSmallScreenSize: React.Dispatch<
    SetStateAction<boolean>
  >;
}

function SearchedFlights(props: SearchedFlightProps) {
  const { noFlightFound, setOpenSearchFlightForSmallScreenSize } = props;
  const router = useRouter();
  const {
    searchFlightPayload,
    searchFlightLoading,
    searchFlightAirlineList,
    searchFlightAirportInfoList,
    airlineImageLists,
    flightConfigPayload,
  } = useSelector((state: any) => state.flight);
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  const [stopsType, setStopsType] = useState<string[]>([]);
  const [fareTypes, setFareTypes] = useState<string[]>([]);
  const [airlineTypes, setAirlineTypes] = useState<string[]>([]);
  const [departingTimeSlots, setDepartingTimeSlots] = useState<string[]>([]);
  const [landingTimeSlots, setLandingTimeSlots] = useState<string[]>([]);
  const [value, setValue] = useState<{ min: number; max: number }>({
    min: 1,
    max: 50,
  });
  const [price, setPrice] = useState<{ min: number; max: number }>({
    min: 1,
    max: 50,
  });
  const [isFlightPriceSortEmpty, setIsFlightPriceSortEmpty] =
    useState<boolean>(false);
  const [allSearchedFlightDetail, setAllSearchedFlightDetail] = useState<
    string[] | undefined
  >(undefined);
  const [flightPriceSort, setFlightPriceSort] = useState(false);
  const [stopsTypeList, setStopsTypeList] = useState([
    {
      title: "",
      code: "",
      fare: 0,
      fareType: "",
    },
  ]);
  const [nonStopSearchedFlight, setNonStopSearchedFlight] = useState([]);
  const [oneStopSearchedFlight, setOneStopSearchedFlight] = useState([]);
  const [twoStopSearchedFlight, setTwoStopSearchedFlight] = useState([]);
  const [flightClassTypeList, setFlightClassTypeList] = useState([
    {
      title: "",
      code: "",
    },
  ]);
  const [economySearchedFlight, setEconomySearchedFlight] = useState([]);
  const [economyPremiumSearchedFlight, setEconomyPremiumSearchedFlight] =
    useState([]);
  const [economyStandardSearchedFlight, setEconomyStandardSearchedFlight] =
    useState([]);
  const [firstClassSearchedFlight, setFirstClassSearchedFlight] = useState([]);
  const [businessClassSearchedFlight, setBusinessClassSearchedFlight] =
    useState([]);
  const [airlineList, setAirlineList] = useState([]);
  const [resetAllFilters, setResetAllFilters] = useState<boolean>(false);
  const [openFlightFilterDrawer, setOpenFlightFilterDrawer] = useState(false);
  const [randomBannerIndex, setRandomBannerIndex] = useState(0);

  const toggleFlightDrawer = () => {
    setOpenFlightFilterDrawer(!openFlightFilterDrawer);
  };
  const handleFlightPriceSort = () => {
    setFlightPriceSort((prevState) => !prevState);

    let sortedFlightDetailByMoney = [];
    if (flightPriceSort) {
      sortedFlightDetailByMoney = [...allSearchedFlightDetail]?.sort(
        (ascItem, descItem) =>
          parseInt(ascItem?.fareInfo?.totalFinalFare) -
          parseInt(descItem?.fareInfo?.totalFinalFare),
      );
    } else {
      sortedFlightDetailByMoney = [...allSearchedFlightDetail]?.sort(
        (ascItem, descItem) =>
          parseInt(descItem?.fareInfo?.totalFinalFare) -
          parseInt(ascItem?.fareInfo?.totalFinalFare),
      );
    }
    setAllSearchedFlightDetail(sortedFlightDetailByMoney);
  };

  const handleMinAndMaxFlightPrice = (flightPricesDetail: any) => {
    const minFlightPrice = Math.min(
      ...flightPricesDetail?.map(
        (flightDetail: any) => flightDetail.fareInfo.totalFinalFare,
      ),
    );

    const maxFlightPrice = Math.max(
      ...flightPricesDetail?.map(
        (flightDetail: any) => flightDetail.fareInfo.totalFinalFare,
      ),
    );
    setPrice({
      min: minFlightPrice,
      max: maxFlightPrice,
    });
    setValue({
      min: minFlightPrice,
      max: maxFlightPrice,
    });
  };

  const handleStopsWithMinimumPrice = (flightDetails: any) => {
    let nonStop: any = [];
    let oneStop: any = [];
    let moreThanTwoStop: any = [];

    for (const segment of flightDetails) {
      for (const segmentInfo of segment.segmentInfos) {
        if (segmentInfo.flightInfos) {
          const flightInfosArray = segmentInfo.flightInfos;
          const numberOfFlightInfos = flightInfosArray?.length - 1;

          if (numberOfFlightInfos === 0) {
            nonStop.push(segment);
            setNonStopSearchedFlight(nonStop);
          } else if (numberOfFlightInfos === 1) {
            oneStop.push(segment);
            setOneStopSearchedFlight(oneStop);
          } else if (numberOfFlightInfos > 1) {
            moreThanTwoStop.push(segment);
            setTwoStopSearchedFlight(moreThanTwoStop);
          }
        }
      }
    }

    const minFlightPriceForNonStop = Math.min(
      ...nonStop?.map(
        (flightDetail: any) => flightDetail.fareInfo.totalFinalFare,
      ),
    );
    const minFlightPriceForOneStop = Math.min(
      ...oneStop?.map(
        (flightDetail: any) => flightDetail.fareInfo.totalFinalFare,
      ),
    );
    const minFlightPriceForMoreThanTwoStop = Math.min(
      ...moreThanTwoStop?.map(
        (flightDetail: any) => flightDetail.fareInfo.totalFinalFare,
      ),
    );

    const flightStopTypeList = [];

    if (nonStop.length > 0) {
      flightStopTypeList.push({
        title: "Non-stop",
        code: FLIGHT_STOP_TYPES?.NON_STOP,
        fare:
          minFlightPriceForNonStop === Infinity ? 0 : minFlightPriceForNonStop,
        fareType: nonStop[0]?.fareInfo.currency,
      });
    }

    if (oneStop.length > 0) {
      flightStopTypeList.push({
        title: "1 stop",
        code: FLIGHT_STOP_TYPES?.ONE_STOP,
        fare:
          minFlightPriceForOneStop === Infinity ? 0 : minFlightPriceForOneStop,
        fareType: oneStop[0]?.fareInfo.currency,
      });
    }
    if (moreThanTwoStop.length > 0) {
      flightStopTypeList.push({
        title: "2+ stop",
        code: FLIGHT_STOP_TYPES?.TWO_PLUS_STOP,
        fare:
          minFlightPriceForMoreThanTwoStop === Infinity
            ? 0
            : minFlightPriceForMoreThanTwoStop,
        fareType: moreThanTwoStop[0]?.fareInfo.currency,
      });
    }

    setStopsTypeList(flightStopTypeList);
  };

  const handleCabinClassFilter = (flightDetails: any) => {
    const filteredEconomicPremiumDetails: any = [];
    const filteredEconomicDetails: any = [];
    const filteredEconomicStandardDetails: any = [];
    const filteredFirstClassDetails: any = [];
    const filteredBusinessClassDetails: any = [];

    // Iterate through the data
    for (const flight of flightDetails) {
      for (const segmentInfo of flight.segmentInfos) {
        for (const cabinClassInfo of segmentInfo.cabinClassInfos) {
          // Check if the cabin class matches the one you want to filter
          if (cabinClassInfo.cabinClass === cabinClassConfig.ECONOMIC_PREMIUM) {
            filteredEconomicPremiumDetails.push(flight);
            setEconomyPremiumSearchedFlight(filteredEconomicPremiumDetails);
          }
          if (cabinClassInfo.cabinClass === cabinClassConfig.ECONOMIC) {
            filteredEconomicDetails.push(flight);
            setEconomySearchedFlight(filteredEconomicDetails);
          }
          if (
            cabinClassInfo.cabinClass === cabinClassConfig.ECONOMIC_STANDARD
          ) {
            filteredEconomicStandardDetails.push(flight);
            setEconomyStandardSearchedFlight(filteredEconomicStandardDetails);
          }
          if (cabinClassInfo.cabinClass === cabinClassConfig.FIRST) {
            filteredFirstClassDetails.push(flight);
            setFirstClassSearchedFlight(filteredFirstClassDetails);
          }
          if (cabinClassInfo.cabinClass === cabinClassConfig.BUSINESS) {
            filteredBusinessClassDetails.push(flight);
            setBusinessClassSearchedFlight(filteredBusinessClassDetails);
          }
        }
      }
    }
    const flightClassTypeList = [];

    if (filteredEconomicPremiumDetails.length > 0) {
      flightClassTypeList.push({
        title: "Economy Premium",
        code: cabinClassConfig?.ECONOMIC_PREMIUM,
      });
    }
    if (filteredEconomicDetails.length > 0) {
      flightClassTypeList.push({
        title: "Economy",
        code: cabinClassConfig?.ECONOMIC,
      });
    }
    if (filteredEconomicStandardDetails.length > 0) {
      flightClassTypeList.push({
        title: "Economy Standard",
        code: cabinClassConfig?.ECONOMIC_STANDARD,
      });
    }
    if (filteredFirstClassDetails.length > 0) {
      flightClassTypeList.push({
        title: "First Class",
        code: cabinClassConfig?.FIRST,
      });
    }
    if (filteredBusinessClassDetails.length > 0) {
      flightClassTypeList.push({
        title: "Business",
        code: cabinClassConfig?.BUSINESS,
      });
    }
    setFlightClassTypeList(flightClassTypeList);
  };

  const handleAirlinesListFilter = (flightDetails: any) => {
    const availableAirList: any = [];
    for (const flight of flightDetails) {
      for (const segmentInfo of flight.segmentInfos) {
        for (const airlineInfo of segmentInfo.flightInfos) {
          availableAirList.push(airlineInfo?.airline);
        }
      }
    }
    const uniqueSet: any = new Set(availableAirList);
    const uniqueArray = [...uniqueSet];

    const airlineListUpdatedArray: any = uniqueArray.map((value) => ({
      title: value,
      code: value,
    }));

    setAirlineList(airlineListUpdatedArray);
  };

  const sortSearchedFlightListByPrice = (flightSearchedLists) => {
    let sortedFlightSearchedList = [];
    if (flightSearchedLists) {
      sortedFlightSearchedList = [...flightSearchedLists]?.sort(
        (ascItem, descItem) =>
          parseInt(ascItem?.fareInfo?.totalFinalFare) -
          parseInt(descItem?.fareInfo?.totalFinalFare),
      );
    }

    setAllSearchedFlightDetail(sortedFlightSearchedList);
    return sortedFlightSearchedList;
  };

  useEffect(() => {
    if (flightConfigPayload) {
      const randomIndex = generateRandomNumber(
        flightConfigPayload && flightConfigPayload?.loaders?.length - 1,
      );
      setRandomBannerIndex(randomIndex);
    }
  }, []);

  useEffect(() => {
    if (searchFlightPayload) {
      setStopsTypeList([]);
      setStopsType([]);
      setAirlineTypes([]);
      sortSearchedFlightListByPrice(searchFlightPayload);
      handleMinAndMaxFlightPrice(searchFlightPayload);
      handleStopsWithMinimumPrice(searchFlightPayload);
      handleCabinClassFilter(searchFlightPayload);
      handleAirlinesListFilter(searchFlightPayload);
    }
  }, [searchFlightPayload, resetAllFilters]);

  const handleMainFilter = () => {
    let selectedFlightList: any = [];

    if (stopsType.length > 0) {
      const stopTypeToFlightMap: Record<string, any> = {
        [FLIGHT_STOP_TYPES.NON_STOP]: nonStopSearchedFlight,
        [FLIGHT_STOP_TYPES?.ONE_STOP]: oneStopSearchedFlight,
        [FLIGHT_STOP_TYPES?.TWO_PLUS_STOP]: twoStopSearchedFlight,
      };

      stopsType.forEach((stopType) => {
        if (stopTypeToFlightMap[stopType]) {
          selectedFlightList = selectedFlightList.concat(
            stopTypeToFlightMap[stopType],
          );
        }
      });
    }

    if (fareTypes.length > 0) {
      const cabinClassTypeToFlightMap: Record<string, any> = {
        ECONOMIC: economySearchedFlight,
        ECONOMIC_STANDARD: economyStandardSearchedFlight,
        ECONOMIC_PREMIUM: economyPremiumSearchedFlight,
        FIRST: firstClassSearchedFlight,
        BUSINESS: businessClassSearchedFlight,
      };

      fareTypes.forEach((fareType) => {
        if (cabinClassTypeToFlightMap[fareType]) {
          selectedFlightList = selectedFlightList.concat(
            cabinClassTypeToFlightMap[fareType],
          );
        }
      });
    }

    const uniqueSet: any = new Set(selectedFlightList);
    let uniqueArray = [...uniqueSet];
    if (uniqueArray.length === 0) {
      uniqueArray = sortSearchedFlightListByPrice(searchFlightPayload);
    }

    const returningArray = uniqueArray?.filter((item: TravelData) => {
      return (
        item.fareInfo.totalFinalFare >= value.min &&
        item.fareInfo.totalFinalFare <= value.max &&
        item.segmentInfos.some((segment) => {
          let isCabinClass: boolean | number = 0;
          if (fareTypes.length > 0) {
            isCabinClass = segment.cabinClassInfos.some((cabinInfo) => {
              if (
                fareTypes.find((fareType) => fareType === cabinInfo.cabinClass)
              ) {
                return true;
              }
            });
          }

          let isFlightAirline: boolean | number = 0;
          if (airlineTypes.length > 0) {
            isFlightAirline = segment.flightInfos.some((flightInfo) => {
              if (
                airlineTypes.find(
                  (airlineType) =>
                    airlineType?.toUpperCase() ===
                    flightInfo.airline.toUpperCase(),
                )
              ) {
                return true;
              }
            });
          }

          let isStop: number | boolean = 0;
          if (stopsType.length > 0) {
            const numberOfFlightInfos = segment?.flightInfos?.length - 1;
            isStop =
              (stopsType.includes(FLIGHT_STOP_TYPES?.NON_STOP) &&
                numberOfFlightInfos === 0) ||
              (stopsType.includes(FLIGHT_STOP_TYPES?.ONE_STOP) &&
                numberOfFlightInfos === 1) ||
              (stopsType.includes(FLIGHT_STOP_TYPES?.TWO_PLUS_STOP) &&
                numberOfFlightInfos > 1);
          }

          let isDepartingTime: number | boolean = 0;
          if (departingTimeSlots && departingTimeSlots.length > 0) {
            const departureTime =
              segment.flightInfos[0].timeInfo.timeOfDeparture;
            isDepartingTime = departingTimeSlots.some((timeRange) => {
              const [minRange, maxRange] = timeRange.split("-");

              return departureTime >= minRange && departureTime <= maxRange;
            });
          }

          let isLandingTime: number | boolean = 0;
          if (landingTimeSlots && landingTimeSlots.length > 0) {
            const landingTime =
              segment.flightInfos[segment.flightInfos?.length - 1].timeInfo
                .timeOfDeparture;
            isLandingTime = landingTimeSlots.some((timeRange) => {
              const [minRange, maxRange] = timeRange.split("-");

              return landingTime >= minRange && landingTime <= maxRange;
            });
          }

          return (
            (typeof isStop === "boolean" ? isStop : true) &&
            (typeof isFlightAirline === "boolean" ? isFlightAirline : true) &&
            (typeof isCabinClass === "boolean" ? isCabinClass : true) &&
            (typeof isDepartingTime === "boolean" ? isDepartingTime : true) &&
            (typeof isLandingTime === "boolean" ? isLandingTime : true)
          );
        })
      );
    });
    let sortedReturningArray = undefined;
    sortedReturningArray = sortSearchedFlightListByPrice(returningArray);
    if (searchFlightPayload && sortedReturningArray.length === 0) {
      setIsFlightPriceSortEmpty(true);
    } else {
      setIsFlightPriceSortEmpty(false);
    }
    setAllSearchedFlightDetail(sortedReturningArray);
  };

  useEffect(() => {
    if (
      value ||
      stopsType.length > 0 ||
      fareTypes.length > 0 ||
      airlineTypes.length > 0 ||
      (departingTimeSlots && departingTimeSlots.length > 0) ||
      (landingTimeSlots && landingTimeSlots.length > 0)
    ) {
      handleMainFilter();
    } else {
      setAllSearchedFlightDetail(searchFlightPayload);
    }
  }, [
    stopsType,
    fareTypes,
    airlineTypes,
    departingTimeSlots,
    landingTimeSlots,
    value,
  ]);

  useEffect(() => {
    if (!isEmpty(getLocalStorage(appConfig?.PNR_SESSION_ID))) {
      const pnrSessionId = getLocalStorage(appConfig?.PNR_SESSION_ID);
      let formData = { id: "" };
      formData.id = pnrSessionId;
      dispatch(pnrSessionSignout(formData));
      clearLocalStorage(appConfig?.PNR_SESSION_ID);
    }
  }, [getLocalStorage(appConfig?.PNR_SESSION_ID)]);

  return (
    <div className="searched-flights">
      <div className="seacrhed-flights_main-section">
        <div
          className={
            searchFlightLoading
              ? "searched-flights__left-side-section-loading"
              : "searched-flights__left-side-section"
          }
        >
          <FlightFilters
            stopsType={stopsType}
            fareTypes={fareTypes}
            airlineTypes={airlineTypes}
            departingTimeSlots={departingTimeSlots}
            landingTimeSlots={landingTimeSlots}
            value={value}
            price={price}
            setStopsType={setStopsType}
            setFareTypes={setFareTypes}
            setAirlineTypes={setAirlineTypes}
            setDepartingTimeSlots={setDepartingTimeSlots}
            setLandingTimeSlots={setLandingTimeSlots}
            setValue={setValue}
            setPrice={setPrice}
            stopTypeList={stopsTypeList}
            flightClassTypeList={flightClassTypeList}
            airlineList={airlineList}
            flightDetailLists={allSearchedFlightDetail}
            searchFlightPayload={searchFlightPayload}
            searchFlightAirlineList={searchFlightAirlineList}
            searchFlightLoading={searchFlightLoading}
            noFlightFound={noFlightFound}
            setResetAllFilters={setResetAllFilters}
            resetAllFilters={resetAllFilters}
          />
        </div>

        <div className="searched-flights__flights-list">
          {searchFlightLoading ? (
            <FlightListLoading />
          ) : (
            <>
              <FlightList
                flightDetailLists={allSearchedFlightDetail}
                handleFlightPriceSort={handleFlightPriceSort}
                flightPriceSort={flightPriceSort}
                searchFlightAirlineList={searchFlightAirlineList}
                searchFlightAirportInfoList={searchFlightAirportInfoList}
                noFlightFound={noFlightFound}
                airlineImageLists={airlineImageLists}
                flightAds={flightConfigPayload}
                isFlightPriceSortEmpty={isFlightPriceSortEmpty}
                setOpenSearchFlightForSmallScreenSize={
                  setOpenSearchFlightForSmallScreenSize
                }
                setOpenFlightFilterDrawer={setOpenFlightFilterDrawer}
              />

              {flightConfigPayload?.ads?.length > 0 && !noFlightFound && (
                <div className="searched-flights__right-side-section">
                  {flightConfigPayload?.ads?.map((ad, adIndex) => (
                    <img
                      src={ad?.image}
                      key={adIndex}
                      onClick={() => handleCustomSearch(ad, router)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <Drawer
          open={openFlightFilterDrawer}
          onClose={toggleFlightDrawer}
          placement="left"
          width={600}
        >
          <FlightFilters
            stopsType={stopsType}
            fareTypes={fareTypes}
            airlineTypes={airlineTypes}
            departingTimeSlots={departingTimeSlots}
            landingTimeSlots={landingTimeSlots}
            value={value}
            price={price}
            setStopsType={setStopsType}
            setFareTypes={setFareTypes}
            setAirlineTypes={setAirlineTypes}
            setDepartingTimeSlots={setDepartingTimeSlots}
            setLandingTimeSlots={setLandingTimeSlots}
            setValue={setValue}
            setPrice={setPrice}
            stopTypeList={stopsTypeList}
            flightClassTypeList={flightClassTypeList}
            airlineList={airlineList}
            flightDetailLists={allSearchedFlightDetail}
            searchFlightPayload={searchFlightPayload}
            searchFlightAirlineList={searchFlightAirlineList}
            searchFlightLoading={searchFlightLoading}
            noFlightFound={noFlightFound}
            setResetAllFilters={setResetAllFilters}
            resetAllFilters={resetAllFilters}
            from="drawer"
            toggleFlightDrawer={toggleFlightDrawer}
          />
        </Drawer>
      </div>
    </div>
  );
}

export default SearchedFlights;
