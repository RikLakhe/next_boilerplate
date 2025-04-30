/* eslint-disable */
// @ts-nocheck

import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowLeftOutlined, SwapOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RangePickerProps } from "antd/es/date-picker";
import { Button, DatePicker, Input, Skeleton } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import searchClass from "../search.module.css";

import {
  FlightCalenderIcon,
  FlightDestinationIcon,
  FlightOriginIcon,
} from "@/app/assets/images";
import {
  appConfig,
  countryConfig,
  DATE_FORMAT_TYPES,
  extraConfig,
  KEYBOARD_EVENTS,
  nationalityList,
  tripConfig,
} from "@/app/constants/ui/app-config";
import {
  clearLocalStorage,
  convertDateIntoFullYearFormat,
  formatDateToStandard,
  getLocalStorage,
  handleScrollToPosition,
  isEmpty,
  parseStandardDateFormat,
  setLocalStorage,
  showToastError,
} from "@/app/utils/ui";
import TravellerDropDown from "./travellerDropdown";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { useCloseSection } from "@/app/Hooks/useCloseSection";
import {
  AirportDetails,
  FlightClassType,
  LocationDetails,
  TravellerContainerPosition,
  TravellerCount,
} from "@/app/interfaces";
import { ReduxState, searchAirport } from "@/app/redux";
import landingPageClass from "@/pages/landing/landingpage.module.css";
import { useScrollRef } from "@/app/ui/Layout/LayoutBody";
import MultiCitySearch from "./MultiCitySearch";
/* The above code is importing the `RangePicker` component from the `DatePicker` module. This allows you to use the `RangePicker` component in your React components for selecting a range of dates. */
const { RangePicker } = DatePicker;
export interface SearchFlightProps {
  setNoFlightFound: Dispatch<SetStateAction<boolean>>;
  smallScreenSizeDetected: boolean;
  toggleSearchFlightDrawerForSmallScreenSize: () => void;
  from?: string;
  originPlace: LocationDetails;
  setOriginPlace: Dispatch<SetStateAction<LocationDetails>>;
  destinationPlace: LocationDetails;
  setDestinationPlace: Dispatch<SetStateAction<LocationDetails>>;
  travellerCount: TravellerCount;
  setTravellerCount: Dispatch<SetStateAction<TravellerCount>>;
  departingDateParams: string;
  returningDateParams: string;
  setDepartingDateParams: Dispatch<SetStateAction<string>>;
  setReturningDateParams: Dispatch<SetStateAction<string>>;
  tripType: string;
  setTripType: Dispatch<SetStateAction<string>>;
  totalTravellerCount: number;
  setTotalTravellerCount: Dispatch<SetStateAction<number>>;
}

dayjs.extend(customParseFormat);

function SearchFlightCommon(props: SearchFlightProps) {
  const {
    setNoFlightFound,
    toggleSearchFlightDrawerForSmallScreenSize,
    from,
    originPlace,
    setOriginPlace,
    destinationPlace,
    setDestinationPlace,
    travellerCount,
    setTravellerCount,
    departingDateParams,
    returningDateParams,
    setDepartingDateParams,
    setReturningDateParams,
    tripType,
    setTripType,
    totalTravellerCount,
    setTotalTravellerCount,
  } = props;
  const scrollRef = useScrollRef();

  const router = useRouter();
  const travellerContainerRef = useRef(null);
  const travellerDropdownRef = useRef<HTMLElement | null>(null);
  const selectRef = useRef<HTMLElement | null>(null);
  const optionRef = useRef<HTMLElement | null>(null);
  const departingRef = useRef<HTMLElement | null>(null);
  const destinationRef = useRef<HTMLElement | null>(null);
  const [startDate, setStartDate] = useState<any | null>(null);
  const [endDate, setEndDate] = useState<any | null>(null);
  const [visibleStartDate, setVisibleStartDate] = useState(false);
  const [visibleEndDate, setVisibleEndDate] = useState(false);
  const [triggerSearchResultFrom, setTriggerSearchResultFrom] = useState("");
  const [isTheFlightDomestic, setIsTheFlightDomestic] = useState("");
  const [
    abortControllerForDestinationAirportLists,
    setAbortControllerForDestinationAirportList,
  ] = useState<AbortController | null>(null);
  const [
    abortControllerForDepartingAirportLists,
    setAbortControllerForDepartingAirportList,
  ] = useState<AbortController | null>(null);

  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  const { searchAirportLoading } = useSelector((state: any) => state.flight);

  const [
    openDepartingDatePickerAfterDateSelection,
    setDepartingDatePickerAfterDateSelection,
  ] = useState<boolean>(false);

  const [
    openReturningDatePickerAfterDateSelection,
    setReturningDatePickerAfterDateSelection,
  ] = useState<boolean>(false);

  const departingDatePickerRef = useCloseSection(() =>
    setDepartingDatePickerAfterDateSelection(false),
  );
  const returningDatePickerRef = useCloseSection(() =>
    setReturningDatePickerAfterDateSelection(false),
  );

  const [departingDate, setDepartingDate] = useState({
    date: "",
    day: "",
    year: "",
  });

  const [returningDate, setReturningDate] = useState({
    date: "",
    day: "",
    year: "",
  });

  const [flightClassType, setFlightClassType] = useState<FlightClassType>({
    code: "ALL",
    title: "All",
  });

  const [travellerNationality, setTravellerNationality] = useState(
    countryConfig?.NEPAL,
  );
  const [toggleTravellerDropdown, setToggleTravellerDropdown] =
    useState<boolean>(false);

  const getDepartingDateFromStorage = () => {
    if (!!departingDateParams) {
      return dayjs(departingDateParams, "YYYY-MM-DD");
    }
    return null;
  };

  const [departureDate, setDepartureDate] = useState<dayjs.Dayjs | null>(
    getDepartingDateFromStorage,
  );
  const [departingAirportSearchValue, setDepartingAirportSearchValue] =
    useState("");
  const [departingAirportSearchList, setDepartingAirportSearchList] = useState(
    [],
  );
  const [openDepartingirportSearchList, setOpenDepartingirportSearchList] =
    useState(false);

  const [destinationAirportSearchValue, setDestinationAirportSearchValue] =
    useState("");

  const [destinationAirportSearchList, setDestinationAirportSearchList] =
    useState([]);
  const [smallScreenSizeDetect, setSmallScreenSizeDetect] = useState(false);

  const [
    openDestinationAirportSearchList,
    setOpenDestinationAirportSearchList,
  ] = useState(false);

  const handleTripType = (trip: string) => {
    setTripType(trip);
    if (trip === tripConfig.ONE_WAY) {
      setReturningDate({
        date: "",
        day: "",
        year: "",
      });
      setReturningDateParams("");
    }
  };

  const handleSwapDestination = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOriginPlace({
      location: destinationPlace.location,
      locationCode: destinationPlace.locationCode,
      locationCountry: destinationPlace?.locationCountry,
    });
    setDestinationPlace({
      location: originPlace.location,
      locationCode: originPlace.locationCode,
      locationCountry: originPlace?.locationCountry,
    });
    setDestinationAirportSearchValue(departingAirportSearchValue);
    setDepartingAirportSearchValue(destinationAirportSearchValue);
  };

  const handleOriginAirportLocation = (airport: AirportDetails) => {
    setOriginPlace({
      location: airport?.city,
      locationCode: airport?.iataCode,
      locationCountry: airport?.country,
    });
    setDepartingAirportSearchValue(airport?.city);
    setOpenDepartingirportSearchList(false);
  };

  const handleDestinationAirportLocation = (airport: AirportDetails) => {
    setDestinationPlace({
      location: airport?.city,
      locationCode: airport?.iataCode,
      locationCountry: airport?.country,
    });
    setDestinationAirportSearchValue(airport?.city);
    setOpenDestinationAirportSearchList(false);
  };

  const disableReturningDate: RangePickerProps["disabledDate"] = (current) => {
    const nextYear = dayjs().add(361, "day").endOf("year");

    if (!departingDateParams) {
      return (
        (current && current < dayjs().startOf("day")) ||
        current > nextYear.endOf("day")
      );
    }
    return (
      (current &&
        current.isBefore(dayjs(departingDateParams).startOf("day"))) ||
      current > nextYear.endOf("day")
    );
  };
  const disabledDepartureDate = (current: dayjs.Dayjs | null): boolean => {
    if (!current) {
      return false;
    }
    const nextYear = dayjs().add(361, "day").endOf("year");
    const isBeforeDepartingDate = current?.isBefore(dayjs().startOf("day"));
    return isBeforeDepartingDate || current.isAfter(nextYear);
  };

  const handleDepartingDate = (date: any) => {
    const { day, month, year, formattedDateString } =
      parseStandardDateFormat(date);
    setDepartingDateParams(formattedDateString);
    setDepartingDate({
      date: month,
      day: day,
      year: year,
    });
    setDepartureDate(date);
  };
  const handleReturningTime = (date: any) => {
    const { day, month, year, formattedDateString } =
      parseStandardDateFormat(date);
    setReturningDateParams(formattedDateString);
    setReturningDate({
      date: month,
      day: day,
      year: year,
    });
    setTripType(tripConfig.TWO_WAY);
  };

  const triggerTravellerOptionsDropDown = () => {
    setToggleTravellerDropdown(true);
  };

  const handleClickedOutsideOfTravellerDropdown = (event: MouseEvent) => {
    if (
      optionRef.current &&
      selectRef.current &&
      travellerDropdownRef.current &&
      !optionRef.current?.contains(event.target as Node) &&
      !selectRef.current?.contains(event.target as Node) &&
      !travellerDropdownRef.current.contains(event.target as Node)
    ) {
      setToggleTravellerDropdown(false);
    }
  };

  const clearFlightDate = (type: string) => {
    if (type === extraConfig?.DEPARTING_DATE) {
      setDepartingDate({
        date: "",
        day: "",
        year: "",
      });
      setDepartingDateParams("");
      setStartDate(null);
    }
    if (type === extraConfig?.RETURNING_DATE) {
      setReturningDate({
        date: "",
        day: "",
        year: "",
      });
      setReturningDateParams("");
      setTripType(tripConfig.ONE_WAY);
      setEndDate(null);
    }
  };

  const checkTripValidation = () => {
    const showError = (message: string) => {
      showToastError(message);
      return false;
    };

    if (!originPlace.locationCode) {
      return showError("Origin is required");
    }
    if (!departingAirportSearchValue) {
      return false;
    }

    if (!destinationPlace.locationCode) {
      return showError("Destination is required");
    }
    if (!destinationAirportSearchValue) {
      return false;
    }

    if (!departingDateParams) {
      return showError("Departing date is required");
    }

    if (
      tripType === tripConfig.TWO_WAY &&
      convertDateIntoFullYearFormat(departingDateParams) >
      convertDateIntoFullYearFormat(returningDateParams)
    ) {
      return showError(
        "Returning date cannot be past date than departing date",
      );
    }

    if (tripType === tripConfig.TWO_WAY && !returningDateParams) {
      return showError("Returning date is required");
    }

    if (totalTravellerCount === 0 || totalTravellerCount > 9) {
      return showError(
        totalTravellerCount === 0
          ? "Minimum 1 traveller is required"
          : "Max 9 travellers are allowed",
      );
    }

    if (travellerCount.infants > travellerCount.adults) {
      return showError("Infant cannot be greater than adult");
    }

    if (!travellerNationality) {
      setToggleTravellerDropdown(true);
      return showError("Nationality is required");
    }
    if (originPlace.locationCode === destinationPlace.locationCode) {
      return showError("Origin and destination cannot be the same");
    }

    return true;
  };

  const handleSearchFlight = () => {
    if (checkTripValidation()) {
      setNoFlightFound(false);
      setToggleTravellerDropdown(false);
      let formData = { tripInfo: {}, passengerInfo: {} };
      let searchData = {
        tripsDetail: {},
        travellerInfo: {},
        dateInfo: {},
        cabinClassInfo: {},
      };
      let userTripInfo = {
        roundTrip: tripType === tripConfig?.ONE_WAY ? false : true,
        trips: [
          {
            origin: {
              code: originPlace.locationCode,
              date: formatDateToStandard(departingDateParams),
              country: originPlace.locationCountry,
            },
            destination: {
              code: destinationPlace.locationCode,
              date: formatDateToStandard(returningDateParams),
              country: destinationPlace.locationCountry,
            },
          },
        ],
        cabinClass: flightClassType?.code.toUpperCase(),
      };

      const adultsArray = new Array(travellerCount.adults).fill({
        nationality: travellerNationality,
        passengerType: "ADT",
      });

      const childrenArray = new Array(travellerCount.childrens).fill({
        nationality: travellerNationality,
        passengerType: "CH",
      });

      const infantArray = new Array(travellerCount.infants).fill({
        nationality: travellerNationality,
        passengerType: "INF",
      });

      let concatAdultChildrenArray = adultsArray
        .concat(...childrenArray)
        .concat(...infantArray);

      let passengerInfoDetail = {
        totalNumberOfPassengers: totalTravellerCount,
        passengers: concatAdultChildrenArray,
      };

      formData.tripInfo = userTripInfo;
      formData.passengerInfo = passengerInfoDetail;
      router.push(
        `flightList/?from=${originPlace?.locationCode}&&to=${destinationPlace?.locationCode}&&departingDate=${departingDateParams}&&returningDate=${returningDateParams}&&traveller=${totalTravellerCount}&&class=${flightClassType?.title}&&tripType=${tripType}`,
      );
      from === "drawer" && toggleSearchFlightDrawerForSmallScreenSize();

      setLocalStorage(appConfig?.CLIENT_NATIONALITY, travellerNationality);

      let tripsDetail = {
        originLocation: departingAirportSearchValue,
        originCode: originPlace?.locationCode,
        destinationLocation: destinationAirportSearchValue,
        destinationCode: destinationPlace?.locationCode,
        originLocationCountry: originPlace?.locationCountry,
        destinationLocationCountry: destinationPlace?.locationCountry,
      };

      let dateDetail = {
        departing: {
          date: departingDate?.date,
          day: departingDate?.day,
          year: departingDate?.year,
          fullDate: departingDateParams,
        },
        returning: {
          date: returningDate?.date,
          day: returningDate?.day,
          year: returningDate?.year,
          fullDate: returningDateParams,
        },
      };
      let cabinClassDetail = {
        code: flightClassType?.code.toUpperCase(),
        title: flightClassType?.title,
      };
      let travellerDetail = {
        totalCount: totalTravellerCount,
        nationalityCode: travellerNationality,
        adultCount: travellerCount?.adults,
        childrenCount: travellerCount?.childrens,
        infantCount: travellerCount?.infants,
      };
      searchData.tripsDetail = tripsDetail;
      searchData.dateInfo = dateDetail;
      searchData.cabinClassInfo = cabinClassDetail;
      searchData.travellerInfo = travellerDetail;

      const formDataToString = JSON.stringify(searchData);
      setLocalStorage(appConfig?.FLIGHT_SEARCH_INFO, formDataToString);
    }
  };

  const handleDepartingAirportList = (event: any) => {
    setDepartingAirportSearchList([]);
    setOpenDepartingirportSearchList(true);
    let searchValue = event?.target?.value;
    if (searchValue?.length < 3) {
      setOriginPlace({
        location: "",
        locationCode: "",
        locationCountry: "",
      });
    }
    setDepartingAirportSearchValue(searchValue);
  };

  const handleToClearDepartingSearchValue = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event?.key === KEYBOARD_EVENTS?.BACKSPACE_KEY ||
      event?.keyCode === KEYBOARD_EVENTS?.BACKSPACE_KEY_CODE
    ) {
      setOriginPlace({
        location: "",
        locationCode: "",
        locationCountry: "",
      });
      setDepartingAirportSearchValue("");
    }
  };

  const handleDestinationAirportList = (event: any) => {
    setDestinationAirportSearchList([]);
    setOpenDestinationAirportSearchList(true);
    let searchValue = event?.target?.value;
    if (searchValue?.length < 3) {
      setDestinationPlace({
        location: "",
        locationCode: "",
        locationCountry: "",
      });
    }
    setDestinationAirportSearchValue(searchValue);
  };

  const handleToClearDestinationSearchValue = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event?.key === KEYBOARD_EVENTS?.BACKSPACE_KEY ||
      event?.keyCode === KEYBOARD_EVENTS?.BACKSPACE_KEY_CODE
    ) {
      setDestinationPlace({
        location: "",
        locationCode: "",
        locationCountry: "",
      });
      setDestinationAirportSearchValue("");
    }
  };

  const handleClickedOutsideOfDepartingAirportList = (event: MouseEvent) => {
    if (!departingRef?.current?.contains(event?.target as Node)) {
      setOpenDepartingirportSearchList(false);
    }
  };
  const handleClickedOutsideOfDestinationAirportList = (event: MouseEvent) => {
    if (!destinationRef?.current?.contains(event?.target as Node)) {
      setOpenDestinationAirportSearchList(false);
    }
  };

  const checkCountryNameWithCountryCode = (countryCode: string) => {
    if (!countryCode) return "";
    return nationalityList?.find(
      (nationalityItem) => nationalityItem?.code === countryCode?.toUpperCase(),
    )?.country;
  };

  useEffect(() => {
    if (departingAirportSearchValue?.length === 0) return;
    if (abortControllerForDepartingAirportLists) {
      abortControllerForDepartingAirportLists.abort();
    }

    const newAbortController = new AbortController();
    setAbortControllerForDepartingAirportList(newAbortController);

    const timer = setTimeout(() => {
      setDepartingAirportSearchList([]);
      dispatch(
        searchAirport(departingAirportSearchValue, {
          signal: newAbortController.signal,
        }),
      ).then((res) => {
        if (res?.status === 200 && !newAbortController.signal.aborted) {
          setDepartingAirportSearchList(res?.data?.data);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      newAbortController.abort();
    };
  }, [departingAirportSearchValue]);

  useEffect(() => {
    if (destinationAirportSearchValue?.length === 0) return;
    if (abortControllerForDestinationAirportLists) {
      abortControllerForDestinationAirportLists.abort();
    }

    const newAbortController = new AbortController();
    setAbortControllerForDestinationAirportList(newAbortController);

    const timer = setTimeout(() => {
      setDestinationAirportSearchList([]);
      dispatch(
        searchAirport(destinationAirportSearchValue, {
          signal: newAbortController.signal,
        }),
      ).then((res) => {
        if (res?.status === 200 && !newAbortController.signal.aborted) {
          setDestinationAirportSearchList(res?.data?.data);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      newAbortController.abort();
    };
  }, [destinationAirportSearchValue]);

  useEffect(() => {
    document.addEventListener(
      "click",
      handleClickedOutsideOfDestinationAirportList,
      true,
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickedOutsideOfDestinationAirportList,
        true,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener(
      "click",
      handleClickedOutsideOfTravellerDropdown,
      true,
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickedOutsideOfTravellerDropdown,
        true,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener(
      "click",
      handleClickedOutsideOfDepartingAirportList,
      true,
    );
    return () => {
      document.removeEventListener(
        "click",
        handleClickedOutsideOfDepartingAirportList,
        true,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isEmpty(getLocalStorage(appConfig.FLIGHT_SEARCH_INFO))) {
      const searchFlightInfo = getLocalStorage(appConfig.FLIGHT_SEARCH_INFO);

      if (!isEmpty(searchFlightInfo?.tripsDetail?.originLocationCountry)) {
        setDepartingAirportSearchValue(
          searchFlightInfo?.tripsDetail?.originLocation,
        );
        setOriginPlace({
          location: searchFlightInfo?.tripsDetail?.originLocation,
          locationCode: searchFlightInfo?.tripsDetail?.originCode,
          locationCountry: searchFlightInfo?.tripsDetail?.originLocationCountry,
        });
      } else {
        setOriginPlace({
          location: "",
          locationCode: "",
          locationCountry: "",
        });
        setDepartingAirportSearchValue("");
      }
      if (!isEmpty(searchFlightInfo?.tripsDetail?.destinationLocationCountry)) {
        setDestinationAirportSearchValue(
          searchFlightInfo?.tripsDetail?.destinationLocation,
        );
        setDestinationPlace({
          location: searchFlightInfo?.tripsDetail?.destinationLocation,
          locationCode: searchFlightInfo?.tripsDetail?.destinationCode,
          locationCountry:
            searchFlightInfo?.tripsDetail?.destinationLocationCountry,
        });
      } else {
        setDestinationPlace({
          location: "",
          locationCode: "",
          locationCountry: "",
        });
        setDestinationAirportSearchValue("");
      }

      setDepartingDate({
        date: searchFlightInfo?.dateInfo?.departing?.date,
        day: searchFlightInfo?.dateInfo?.departing?.day,
        year: searchFlightInfo?.dateInfo?.departing?.year,
      });
      setReturningDate({
        date: searchFlightInfo?.dateInfo?.returning?.date,
        day: searchFlightInfo?.dateInfo?.returning?.day,
        year: searchFlightInfo?.dateInfo?.returning?.year,
      });
      setDepartingDateParams(searchFlightInfo?.dateInfo?.departing?.fullDate);
      setReturningDateParams(searchFlightInfo?.dateInfo?.returning?.fullDate);
      setFlightClassType({
        code: searchFlightInfo?.cabinClassInfo?.code,
        title: searchFlightInfo?.cabinClassInfo?.title,
      });
      setTotalTravellerCount(searchFlightInfo?.travellerInfo?.totalCount);
      setTravellerNationality(searchFlightInfo?.travellerInfo?.nationalityCode);
      setTravellerCount({
        adults: searchFlightInfo?.travellerInfo?.adultCount,
        childrens: searchFlightInfo?.travellerInfo?.childrenCount,
        infants: searchFlightInfo?.travellerInfo?.infantCount,
      });
      if (searchFlightInfo?.dateInfo.returning?.fullDate) {
        setTripType(tripConfig.TWO_WAY);
      }
    }
    if (router.query.tripType === tripConfig?.MULTI_CITY) {
      setTripType(tripConfig?.MULTI_CITY);
    }
  }, []);

  useEffect(() => {
    clearLocalStorage(appConfig?.FLIGHT_DETAILS);
    clearLocalStorage(appConfig?.FLIGHT_DETAILS_FROM_DASHBOARD);
    clearLocalStorage(appConfig?.PNR_ID_FROM_DASHBOARD);
    clearLocalStorage(appConfig?.PNR_SUCCESS_ID);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 800) {
        setSmallScreenSizeDetect(true);
      }
    } else {
      setSmallScreenSizeDetect(false);
    }
  }, []);

  const [travellerContainerTopPosition, setTravellerContainerTopPosition] =
    useState<TravellerContainerPosition>({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    });
  useEffect(() => {
    if (travellerContainerRef.current) {
      const rect = travellerContainerRef.current.getBoundingClientRect();
      setTravellerContainerTopPosition({
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      });
    }
  }, []);

  useEffect(() => {
    if (originPlace || destinationPlace) {
      if (
        originPlace.locationCountry === "NP" &&
        destinationPlace.locationCountry === "NP"
      ) {
        setIsTheFlightDomestic(true);
        setReturningDate({});
        setReturningDateParams("");
        setTripType(tripConfig?.ONE_WAY);
      } else {
        setIsTheFlightDomestic(false);
      }
    }
  }, [originPlace, destinationPlace]);

  const LandingPageDetails = () => {
    return (
      <div className={landingPageClass.landing_page_message}>
        <h1>Discover the best flight for your trip.</h1>
      </div>
    );
  };

  return (
    <div
      className={`${searchClass.search_flight_container}  search_flights`}
      ref={(element: HTMLDivElement | null) => {
        travellerDropdownRef.current = element;
      }}
    >
      {from === "drawer" && (
        <div
          className="search-filters__back"
          onClick={() => toggleSearchFlightDrawerForSmallScreenSize()}
        >
          <ArrowLeftOutlined style={{ fontSize: "18px" }} />
          <h5>Modify Search</h5>
        </div>
      )}
      <div
        className={`${tripType === tripConfig?.MULTI_CITY && searchClass.search_flights_details_mulitcity}${searchClass.search_flights_details}`}
      >
        <div className={`${searchClass.search_flight_trip_types} `}>
          {tripTypeList
            .filter((trip) => !isTheFlightDomestic || trip.type === "one-way")
            .map((trip, tripIndex) => (
              <p
                key={tripIndex}
                className={`${trip.type === tripType
                    ? searchClass.search_flight_trip_type_active
                    : ""
                  }`}
                onClick={() => {
                  handleTripType(trip.type);
                }}
              >
                {trip.title}
              </p>
            ))}
        </div>
        {tripType === tripConfig?.MULTI_CITY ? (
          <div>
            <MultiCitySearch
              setNoFlightFound={setNoFlightFound}
              toggleSearchFlightDrawerForSmallScreenSize={
                toggleSearchFlightDrawerForSmallScreenSize
              }
              travellerCount={travellerCount}
              setTravellerCount={setTravellerCount}
              totalTravellerCount={totalTravellerCount}
              setTotalTravellerCount={setTotalTravellerCount}
              checkCountryNameWithCountryCode={checkCountryNameWithCountryCode}
              flightClassType={flightClassType}
              toggleTravellerDropdown={toggleTravellerDropdown}
              setToggleTravellerDropdown={setToggleTravellerDropdown}
              travellerNationality={travellerNationality}
              setFlightClassType={setFlightClassType}
              setTravellerNationality={setTravellerNationality}
              travellerDropdownRef={travellerDropdownRef}
              selectRef={selectRef}
              optionRef={optionRef}
              travellerContainerTopPosition={travellerContainerTopPosition}
              triggerTravellerOptionsDropDown={triggerTravellerOptionsDropDown}
            />
          </div>
        ) : (
          <div className={searchClass.search_flight_trip_details}>
            <div className={searchClass.search_flight_section}>
              <div className={searchClass.search_flight_origin}>
                <div className={searchClass.search_flight_origin_container}>
                  <div className={searchClass.search_flight_origin_header}>
                    <Image src={FlightOriginIcon} alt="flight_origin" />
                    <p>FROM</p>
                  </div>

                  <div>
                    <Input
                      bordered={false}
                      onChange={(e) => handleDepartingAirportList(e)}
                      value={departingAirportSearchValue || ""}
                      placeholder="Origin"
                      style={{ marginTop: "-2px" }}
                      onClick={() => {
                        handleScrollToPosition(
                          250,
                          scrollRef,
                          router?.pathname,
                          smallScreenSizeDetect,
                        );
                      }}
                      onKeyDown={handleToClearDepartingSearchValue}
                    />
                  </div>
                  <div
                    className={searchClass.search_flight_origin_location_code}
                  >
                    {originPlace?.locationCode && originPlace.locationCode}
                  </div>
                </div>
                {openDepartingirportSearchList && (
                  <div
                    className={searchClass.search_flight__airport_lists}
                    ref={(element: HTMLDivElement | null) => {
                      departingRef.current = element;
                    }}
                  >
                    {searchAirportLoading &&
                      [1, 2, 3]?.map((index) => (
                        <div className="airport_lists_loading" key={index}>
                          <Skeleton.Input active size={"small"} />
                          <Skeleton.Button
                            active
                            size="small"
                            shape="default"
                          />
                        </div>
                      ))}
                    {departingAirportSearchList?.map(
                      (airportDetail: AirportDetails, airportIndex) => (
                        <div
                          key={airportIndex}
                          className={searchClass.airport_list}
                          onClick={() =>
                            handleOriginAirportLocation(airportDetail)
                          }
                        >
                          <div className={searchClass.airport_country}>
                            <h5>{airportDetail?.city}</h5>
                            <p>{airportDetail?.name}</p>
                          </div>
                          <div className={searchClass.airport_code}>
                            <h6>{airportDetail?.iataCode}</h6>
                            <p>
                              {checkCountryNameWithCountryCode(
                                airportDetail?.country,
                              )}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
              <div
                className={searchClass.search_flight_swap_destination}
                onClick={(e) => handleSwapDestination(e)}
              >
                <div
                  className={searchClass.search_flight_swap_destination_icon}
                >
                  <SwapOutlined />
                </div>
              </div>
              <div className={searchClass.search_flight_destination}>
                <div
                  className={searchClass.search_flight_destination_container}
                >
                  <div className={searchClass.search_flight_destination_header}>
                    <Image
                      src={FlightDestinationIcon}
                      alt="flight_destination"
                    />
                    <p>TO</p>
                  </div>

                  <div>
                    <Input
                      bordered={false}
                      onChange={(e) => handleDestinationAirportList(e)}
                      value={destinationAirportSearchValue || ""}
                      placeholder="Destination "
                      style={{ marginTop: "-2px" }}
                      onClick={() => {
                        handleScrollToPosition(
                          250,
                          scrollRef,
                          router?.pathname,
                          smallScreenSizeDetect,
                        );
                      }}
                      onKeyDown={handleToClearDestinationSearchValue}
                    />
                  </div>

                  <div
                    className={
                      searchClass.search_flight_destination_location_code
                    }
                  >
                    {destinationPlace.locationCode}
                  </div>
                </div>
                {openDestinationAirportSearchList && (
                  <div
                    className={searchClass.search_flight__airport_lists}
                    ref={(element: HTMLDivElement | null) => {
                      destinationRef.current = element;
                    }}
                  >
                    {searchAirportLoading &&
                      [1, 2, 3]?.map((index) => (
                        <div className="airport_lists_loading" key={index}>
                          <Skeleton.Input active size={"small"} />
                          <Skeleton.Button
                            active
                            size="small"
                            shape="default"
                          />
                        </div>
                      ))}
                    {destinationAirportSearchList?.map(
                      (airportDetail: AirportDetails, airportIndex) => (
                        <div
                          key={airportIndex}
                          className={searchClass.airport_list}
                          onClick={() =>
                            handleDestinationAirportLocation(airportDetail)
                          }
                        >
                          <div className={searchClass.airport_country}>
                            <h5>{airportDetail?.city}</h5>
                            <p>{airportDetail?.name}</p>
                          </div>
                          <div className={searchClass.airport_code}>
                            <h6>{airportDetail?.iataCode}</h6>
                            <p>
                              {checkCountryNameWithCountryCode(
                                airportDetail?.country,
                              )}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={searchClass.search_flight_section}>
              <div className={searchClass.search_flight_departing}>
                <div className={searchClass.search_flight_departing_container}>
                  <div className={searchClass.search_flight_departing_header}>
                    <Image src={FlightCalenderIcon} alt="flight_departing" />
                    <p>DEPARTING</p>
                  </div>

                  <div className={searchClass.search_flight_departing_date}>
                    <div
                      className={searchClass.search_flight_departing_fulldate}
                    >
                      {departingDate?.date && departingDate?.year ? (
                        <>
                          <span
                            className={
                              searchClass.search_flight_departing_month_date
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              setDepartingDatePickerAfterDateSelection(true);
                              setVisibleStartDate(true);
                            }}
                          >
                            {departingDate.date},{" "}
                            <span
                              className={
                                searchClass.search_flight_departing_year
                              }
                            >
                              {departingDate.year}
                            </span>
                            <p
                              onClick={(e) => {
                                e.preventDefault();
                                clearFlightDate("departing_date");
                              }}
                            >
                              X
                            </p>
                          </span>
                          {openDepartingDatePickerAfterDateSelection && (
                            <div className="search_flight__date-picker">
                              <RangePicker
                                className="search_flight__date-picker-initial"
                                disabledDate={disabledDepartureDate}
                                open={visibleStartDate}
                                allowClear={false}
                                value={startDate}
                                onCalendarChange={(dates) => {
                                  if (dates && dates.length > 0) {
                                    setStartDate(dates[0]);
                                    handleDepartingDate(dates[0]);
                                    setVisibleStartDate(false);
                                  }
                                }}
                                onOpenChange={(open) =>
                                  setVisibleStartDate(open)
                                }
                                style={{ width: "100%" }}
                                placeholder={["", ""]}
                                onClick={() => {
                                  handleScrollToPosition(
                                    250,
                                    scrollRef,
                                    router?.pathname,
                                    smallScreenSizeDetect,
                                  );
                                }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className={
                            searchClass.search_flight_select_departing_date
                          }
                        >
                          <h5
                            onClick={() => {
                              setVisibleStartDate(true);
                            }}
                            style={{ position: "absolute" }}
                          >
                            Select Date
                          </h5>
                          <div className="search_flight__date-picker">
                            <RangePicker
                              open={visibleStartDate}
                              disabledDate={disabledDepartureDate}
                              allowClear={false}
                              value={startDate}
                              onCalendarChange={(dates) => {
                                if (dates && dates.length > 0) {
                                  setStartDate(dates[0]);
                                  handleDepartingDate(dates[0]);
                                  setVisibleStartDate(false);
                                }
                              }}
                              onOpenChange={(open) => setVisibleStartDate(open)}
                              style={{ width: "100%" }}
                              placeholder={["", ""]}
                              onClick={() => {
                                handleScrollToPosition(
                                  250,
                                  scrollRef,
                                  router?.pathname,
                                  smallScreenSizeDetect,
                                );
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {departingDate?.day && (
                    <div className={searchClass.search_flight_departing_day}>
                      {departingDate.day}
                    </div>
                  )}
                </div>
              </div>

              <div className={searchClass.search_flight_returning}>
                <div className={searchClass.search_flight_returning_container}>
                  <div className={searchClass.search_flight_returning_header}>
                    <Image src={FlightCalenderIcon} alt="flight_returning" />
                    <p>RETURNING</p>
                  </div>
                  <div className={searchClass.search_flight_returning_date}>
                    <div
                      className={searchClass.search_flight_returning_fulldate}
                    >
                      {returningDate?.date && returningDate?.year ? (
                        <>
                          <span
                            className={
                              searchClass.search_flight_returning_month_date
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              setVisibleEndDate(true);
                              setReturningDatePickerAfterDateSelection(true);
                            }}
                          >
                            {returningDate.date},{" "}
                            <span
                              className={
                                searchClass.search_flight_returning_year
                              }
                            >
                              {returningDate.year}
                            </span>
                            <p
                              onClick={(e) => {
                                e.preventDefault();
                                clearFlightDate("returning_date");
                              }}
                            >
                              X
                            </p>
                          </span>
                          {openReturningDatePickerAfterDateSelection && (
                            <div className="search_flight__date-picker">
                              <RangePicker
                                className="search_flight__date-picker-initial"
                                disabledDate={disableReturningDate}
                                open={visibleEndDate}
                                allowClear={false}
                                value={endDate}
                                format={DATE_FORMAT_TYPES?.MONTH_DAY_YEAR}
                                onCalendarChange={(dates) => {
                                  if (dates && dates.length > 0) {
                                    setEndDate(dates[0]);
                                    handleReturningTime(dates[0]);
                                    setVisibleEndDate(false);
                                  }
                                }}
                                onOpenChange={(open) => setVisibleEndDate(open)}
                                style={{ width: "100%" }}
                                placeholder={["", ""]}
                                onClick={() => {
                                  handleScrollToPosition(
                                    250,
                                    scrollRef,
                                    router?.pathname,
                                    smallScreenSizeDetect,
                                  );
                                }}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div
                          className={
                            searchClass.search_flight_select_returning_date
                          }
                        >
                          <h5
                            onClick={() => {
                              setVisibleEndDate(true);
                            }}
                            style={{ position: "absolute" }}
                          >
                            Select Date
                          </h5>
                          <div className="search_flight__date-picker">
                            <RangePicker
                              open={visibleEndDate}
                              disabledDate={disableReturningDate}
                              allowClear={false}
                              value={endDate}
                              format={DATE_FORMAT_TYPES?.MONTH_DAY_YEAR}
                              onCalendarChange={(dates) => {
                                if (dates && dates.length > 0) {
                                  setEndDate(dates[0]);
                                  handleReturningTime(dates[0]);
                                  setVisibleEndDate(false);
                                }
                              }}
                              onOpenChange={(open) => setVisibleEndDate(open)}
                              style={{ width: "100%" }}
                              placeholder={["", ""]}
                              onClick={() => {
                                handleScrollToPosition(
                                  250,
                                  scrollRef,
                                  router?.pathname,
                                  smallScreenSizeDetect,
                                );
                              }}
                              disabled={isTheFlightDomestic}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {returningDate?.day && (
                    <div className={searchClass.search_flight_returning_day}>
                      {returningDate.day}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={searchClass.search_flight_travellers}
              style={{
                position: `${router.pathname === "/flightList" ? "static" : "relative"}`,
              }}
              ref={travellerContainerRef}
              onClick={() => {
                triggerTravellerOptionsDropDown();
                handleScrollToPosition(
                  250,
                  scrollRef,
                  router?.pathname,
                  smallScreenSizeDetect,
                );
              }}
            >
              <div className={searchClass.search_flight_traveller_container}>
                <div className={searchClass.search_flight_traveller_header}>
                  <Image src={FlightCalenderIcon} alt="flight_traveller" />
                  <p>TRAVELLERS</p>
                </div>

                <div className={searchClass.search_flight_traveller_count}>
                  {totalTravellerCount}{" "}
                  <span>
                    {totalTravellerCount === 1 ? "Traveller" : "Travellers"}
                  </span>
                </div>
                <div
                  className={
                    searchClass.search_flight_traveller_flight_class_type
                  }
                >
                  {flightClassType?.title &&
                    `${flightClassType?.title?.replace(/_/g, " ")} class`}
                </div>
              </div>
              {toggleTravellerDropdown && (
                <>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setToggleTravellerDropdown(false);
                    }}
                    style={{
                      width: "100vw",
                      height: "100vh",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      backgroundColor: "blue",
                      zIndex: 1,
                      opacity: 0,
                    }}
                  />
                  <TravellerDropDown
                    travellerNationality={travellerNationality}
                    travellerCount={travellerCount}
                    flightClassType={flightClassType}
                    setTotalTravellerCount={setTotalTravellerCount}
                    setFlightClassType={setFlightClassType}
                    setTravellerNationality={setTravellerNationality}
                    setTravellerCount={setTravellerCount}
                    ref={travellerDropdownRef}
                    selectRef={selectRef}
                    optionRef={optionRef}
                    totalTravellerCount={totalTravellerCount}
                    setToggleTravellerDropdown={setToggleTravellerDropdown}
                    travellerContainerTopPosition={
                      travellerContainerTopPosition
                    }
                  />
                </>
              )}
            </div>

            <div
              className={searchClass.search_flight_button}
              onClick={() => {
                handleSearchFlight();
                setTriggerSearchResultFrom("button");
              }}
            >
              <Button className="btn-primary">Search Flights</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchFlightCommon;
export const tripTypeList = [
  {
    type: "one-way",
    title: "One Way",
  },
  {
    type: "two-way",
    title: "Round Trip",
  },
  {
    type: "multi-city",
    title: "Multi City",
  },
];
