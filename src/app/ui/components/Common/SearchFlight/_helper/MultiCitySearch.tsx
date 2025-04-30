/* eslint-disable */
// @ts-nocheck

import { Button, DatePicker, Input, Skeleton, Tooltip } from "antd";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

import searchClass from "../search.module.css";

import TravellerDropDown from "./travellerDropdown";
import { SearchFlightProps } from "./searchFlightCommon";
import {
  FlightCalenderIcon,
  FlightDestinationIcon,
  FlightOriginIcon,
} from "@/app/assets/images";
import {
  convertDateDayOfWeekFormat,
  formatDateIntoSearchDateFormat,
  formatDateToStandard,
  getLocalStorage,
  isEmpty,
  setLocalStorage,
  showToastError,
} from "@/app/utils/ui";
import { ReduxState, searchAirport } from "@/app/redux";
import { appConfig, KEYBOARD_EVENTS } from "@/app/constants/ui/app-config";
import {
  AirportDetails,
  FlightClassType,
  FlightForm,
  TravellerContainerPosition,
  UserTripInfo,
} from "@/app/interfaces";

const { RangePicker } = DatePicker;

type AbortControllerItem = {
  toController?: AbortController;
  fromController?: AbortController;
};

interface MultiCityProps {
  openDepartingirportSearchList: boolean;
  searchAirportLoading: boolean;
  departingAirportSearchList: [];
  checkCountryNameWithCountryCode: (countryCode: string) => string;
  openDestinationAirportSearchList: boolean;
  destinationAirportSearchList: [];
  departingDate: {};
  flightClassType: FlightClassType;
  toggleTravellerDropdown: boolean;
  setToggleTravellerDropdown: Dispatch<SetStateAction<boolean>>;
  travellerNationality: string;
  setFlightClassType: Dispatch<SetStateAction<FlightClassType>>;
  setTravellerNationality: Dispatch<SetStateAction<string>>;
  travellerDropdownRef: HTMLElement | null;
  selectRef: HTMLElement | null;
  optionRef: HTMLElement | null;
  travellerContainerTopPosition: TravellerContainerPosition;
  triggerTravellerOptionsDropDown: () => void;
}
type MultiCityFlightProps = SearchFlightProps & MultiCityProps;
function MultiCitySearch(props: MultiCityFlightProps) {
  const {
    setNoFlightFound,
    toggleSearchFlightDrawerForSmallScreenSize,
    travellerCount,
    setTravellerCount,
    totalTravellerCount,
    setTotalTravellerCount,
    checkCountryNameWithCountryCode,
    flightClassType,
    toggleTravellerDropdown,
    setToggleTravellerDropdown,
    travellerNationality,
    setFlightClassType,
    setTravellerNationality,
    travellerDropdownRef,
    selectRef,
    optionRef,
    travellerContainerTopPosition,
    triggerTravellerOptionsDropDown,
  } = props;

  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  const [flightForms, setFlightForms] = useState<FlightForm[]>([
    {
      from: "",
      to: "",
      departingDate: null,
      fromSearchList: [],
      toSearchList: [],
      fromSearchListVisible: false,
      toSearchListVisible: false,
      fromSearchListLoading: false,
      toSearchListLoading: false,
      openDepartingDatePickerAfterDateSelection: false,
      origin: {
        code: "",
        date: "" || null,
        city: "",
        country: "",
      },
      destination: {
        code: "",
        date: "" || null,
        city: "",
        country: "",
      },
    },
    {
      from: "",
      to: "",
      departingDate: null,
      fromSearchList: [],
      toSearchList: [],
      fromSearchListVisible: false,
      toSearchListVisible: false,
      fromSearchListLoading: false,
      toSearchListLoading: false,
      openDepartingDatePickerAfterDateSelection: false,
      origin: {
        code: "",
        date: "",
        city: "",
        country: "",
      },
      destination: {
        code: "",
        date: "",
        city: "",
        country: "",
      },
    },
  ]);
  const [abortControllerList, setAbortControllerList] = useState<
    AbortControllerItem[]
  >([]);

  const addFlightForm = () => {
    if (flightForms?.length > 2) {
      showToastError("Max 3 segments allowed");
    } else {
      setFlightForms([
        ...flightForms,
        {
          from: "",
          to: "",
          departingDate: null,
          fromSearchList: [],
          toSearchList: [],
          fromSearchListVisible: false,
          toSearchListVisible: false,
          fromSearchListLoading: false,
          toSearchListLoading: false,
          openDepartingDatePickerAfterDateSelection: false,

          origin: {
            code: "",
            date: "",
            country: "",
            city: "",
          },
          destination: {
            code: "",
            date: "",
            country: "",
            city: "",
          },
        },
      ]);
    }
  };

  const handleFromChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newFlightForms = [...flightForms];
    const searchValue = event && event?.target?.value;
    newFlightForms[index].origin.city = searchValue;
    newFlightForms[index].fromSearchListLoading = searchValue.length >= 3;
    setFlightForms(newFlightForms);

    if (searchValue.length >= 3) {
      newFlightForms[index].fromSearchListVisible = true;
      newFlightForms[index].toSearchListVisible = false;
      setFlightForms(newFlightForms);
    } else {
      newFlightForms[index].fromSearchListVisible = false;
      setFlightForms(newFlightForms);
      return;
    }

    if (abortControllerList[index]?.fromController) {
      abortControllerList[index].fromController.abort();
    }

    const newAbortController = new AbortController();
    const newAbortControllerList = [...abortControllerList];
    newAbortControllerList[index] = {
      ...newAbortControllerList[index],
      fromController: newAbortController,
    };
    setAbortControllerList(newAbortControllerList);

    const timer = setTimeout(() => {
      dispatch(
        searchAirport(searchValue, { signal: newAbortController.signal }),
      ).then((res) => {
        if (res?.status === 200 && !newAbortController.signal.aborted) {
          newFlightForms[index].fromSearchListLoading = false;
          newFlightForms[index].fromSearchList = res?.data?.data;
          setFlightForms([...newFlightForms]);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleToChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newFlightForms = [...flightForms];
    const searchValue = event.target.value;
    newFlightForms[index].destination.city = searchValue;
    newFlightForms[index].toSearchListLoading = searchValue.length >= 3;

    setFlightForms(newFlightForms);

    if (searchValue.length >= 3) {
      newFlightForms[index].toSearchListVisible = true;
      newFlightForms[index].fromSearchListVisible = false;
      setFlightForms(newFlightForms);
    } else {
      newFlightForms[index].toSearchListVisible = false;
      setFlightForms(newFlightForms);
      return;
    }

    if (abortControllerList[index]?.toController) {
      abortControllerList[index].toController.abort();
    }

    const newAbortController = new AbortController();
    const newAbortControllerList = [...abortControllerList];
    newAbortControllerList[index] = {
      ...newAbortControllerList[index],
      toController: newAbortController,
    };
    setAbortControllerList(newAbortControllerList);

    const timer = setTimeout(() => {
      dispatch(
        searchAirport(searchValue, { signal: newAbortController.signal }),
      ).then((res) => {
        if (res?.status === 200 && !newAbortController.signal.aborted) {
          newFlightForms[index].toSearchListLoading = false;

          newFlightForms[index].toSearchList = res?.data?.data;
          setFlightForms([...newFlightForms]);
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleFromAirportSelect = (index: number, airport: AirportDetails) => {
    const newFlightForms = [...flightForms];
    newFlightForms[index].from = airport.city;
    newFlightForms[index].origin.code = airport.iataCode;
    newFlightForms[index].origin.country = airport.country;
    newFlightForms[index].origin.city = airport.city;
    newFlightForms[index].fromSearchList = [];
    setFlightForms(newFlightForms);
  };

  const handleToAirportSelect = (index: number, airport: AirportDetails) => {
    const newFlightForms = [...flightForms];
    newFlightForms[index].to = airport.city;
    newFlightForms[index].destination.code = airport.iataCode;
    newFlightForms[index].destination.country = airport.country;
    newFlightForms[index].destination.city = airport.city;
    newFlightForms[index].toSearchList = [];
    setFlightForms(newFlightForms);
  };

  const handleToClearDepartingSearchValue = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      event?.key === KEYBOARD_EVENTS?.BACKSPACE_KEY ||
      event?.keyCode === KEYBOARD_EVENTS?.BACKSPACE_KEY_CODE
    ) {
      setFlightForms((prevFlightForms) =>
        prevFlightForms.map((flightForm, i) =>
          i === index
            ? {
              ...flightForm,
              origin: {
                ...flightForm.origin,
                city: "",
                code: "",
              },
            }
            : flightForm,
        ),
      );
    }
  };

  const handleToClearDestinationSearchValue = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      event?.key === KEYBOARD_EVENTS?.BACKSPACE_KEY ||
      event?.keyCode === KEYBOARD_EVENTS?.BACKSPACE_KEY_CODE
    ) {
      setFlightForms((prevFlightForms) =>
        prevFlightForms.map((flightForm, i) =>
          i === index
            ? {
              ...flightForm,
              destination: {
                ...flightForm.destination,
                city: "",
                code: "",
              },
            }
            : flightForm,
        ),
      );
    }
  };
  const disabledDepartureDate = (current: dayjs.Dayjs | null): boolean => {
    if (!current) {
      return false;
    }
    const nextYear = dayjs().add(361, "day").endOf("year");
    const isBeforeDepartingDate = current?.isBefore(dayjs().startOf("day"));
    return isBeforeDepartingDate || current.isAfter(nextYear);
  };

  const checkTripValidation = () => {
    const showError = (message: string) => {
      showToastError(message);
      return false;
    };

    for (const [index, flightForm] of flightForms.entries()) {
      if (!flightForm.origin.city) {
        return showError(`Origin is required for trip ${index + 1}`);
      }
      if (!flightForm.destination.city) {
        return showError(`Destination is required for trip ${index + 1}`);
      }
      if (flightForm.origin.city === flightForm.destination.city) {
        return showError(
          `Origin and destination cannot be the same for trip ${index + 1}`,
        );
      }
      if (!flightForm.origin.date) {
        return showError(`Departing date is required for trip ${index + 1}`);
      }
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
    return true;
  };

  const handleMultiCitySearchFlight = () => {
    if (checkTripValidation()) {
      setNoFlightFound(false);
      setToggleTravellerDropdown(false);
      let formData = { tripInfo: {}, passengerInfo: {} };
      let userTripInfo: UserTripInfo = {
        roundTrip: false,
        trips: [],
        cabinClass: flightClassType?.code.toUpperCase(),
        tripType: "MULTI_CITY",
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
      userTripInfo.trips = flightForms.map((flightForm) => ({
        origin: {
          ...flightForm.origin,
          date: formatDateToStandard(flightForm.origin.date as string),
        },
        destination: {
          ...flightForm.destination,
          date: "",
        },
      }));
      formData.tripInfo = userTripInfo;
      formData.passengerInfo = passengerInfoDetail;
      const originCodes = userTripInfo.trips
        .map((trip) => trip.origin.code)
        .join(",");
      const destinationCodes = userTripInfo.trips
        .map((trip) => trip.destination.code)
        .join(",");
      const originDates = userTripInfo.trips
        .map((trip) => formatDateToStandard(trip.origin.date as string))
        .join(",");

      router.push(
        `flightList/?from=${originCodes}&&to=${destinationCodes}&&departingDate=${originDates}&&returningDate=${""}&&traveller=${totalTravellerCount}&&class=${flightClassType?.title}&&tripType=multi-city`,
      );
      toggleSearchFlightDrawerForSmallScreenSize();

      setLocalStorage(appConfig?.CLIENT_NATIONALITY, travellerNationality);
      const formDataToString = JSON.stringify(formData);
      setLocalStorage(
        appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO,
        formDataToString,
      );
    }
  };

  useEffect(() => {
    if (!isEmpty(getLocalStorage(appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO))) {
      const searchFlightInfo = getLocalStorage(
        appConfig.MULTI_CITY_FLIGHT_SEARCH_INFO,
      );
      setFlightForms(searchFlightInfo?.tripInfo?.trips);
    }
  }, []);

  return (
    <div>
      {flightForms?.map((flightForm, index) => (
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
                    onChange={(e) => handleFromChange(index, e)}
                    value={flightForm.origin.city}
                    placeholder="Origin"
                    style={{ marginTop: "-2px" }}
                    onKeyDown={(e) =>
                      handleToClearDepartingSearchValue(e, index)
                    }
                  />
                </div>
                <div className={searchClass.search_flight_origin_location_code}>
                  {flightForm?.origin?.code && flightForm?.origin?.code}
                </div>
              </div>
              {flightForm.fromSearchListVisible && (
                <div className={searchClass.search_flight__airport_lists}>
                  {flightForm.fromSearchListLoading ? (
                    [1, 2, 3]?.map((_, index) => (
                      <div className="airport_lists_loading" key={index}>
                        <Skeleton.Input active size={"small"} />
                        <Skeleton.Button active size="small" shape="default" />
                      </div>
                    ))
                  ) : (
                    <div className={searchClass.airport_list_container}>
                      {flightForm.fromSearchList.length > 0 &&
                        flightForm.fromSearchList.map(
                          (airportDetail, airportIndex) => (
                            <div
                              key={airportIndex}
                              className={searchClass.airport_list}
                              onClick={() =>
                                handleFromAirportSelect(index, airportDetail)
                              }
                            >
                              <div className={searchClass.airport_country}>
                                <h5>{airportDetail.city}</h5>
                                <p>{airportDetail.name}</p>
                              </div>
                              <div className={searchClass.airport_code}>
                                <h6>{airportDetail.iataCode}</h6>
                                <p>
                                  {checkCountryNameWithCountryCode(
                                    airportDetail.country,
                                  )}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={searchClass.search_flight_destination}>
              <div className={searchClass.search_flight_destination_container}>
                <div className={searchClass.search_flight_destination_header}>
                  <Image src={FlightDestinationIcon} alt="flight_destination" />
                  <p>TO</p>
                </div>

                <div>
                  <Input
                    bordered={false}
                    value={flightForm.destination?.city}
                    placeholder="Destination "
                    style={{ marginTop: "-2px" }}
                    onChange={(e) => handleToChange(index, e)}
                    onKeyDown={(e) =>
                      handleToClearDestinationSearchValue(e, index)
                    }
                  />
                </div>

                <div
                  className={
                    searchClass.search_flight_destination_location_code
                  }
                >
                  {flightForm.destination?.code}
                </div>
              </div>
              {flightForm.toSearchListVisible && (
                <div className={searchClass.search_flight__airport_lists}>
                  {flightForm.toSearchListLoading ? (
                    [1, 2, 3]?.map((index) => (
                      <div className="airport_lists_loading" key={index}>
                        <Skeleton.Input active size={"small"} />
                        <Skeleton.Button active size="small" shape="default" />
                      </div>
                    ))
                  ) : (
                    <div className={searchClass.airport_list_container}>
                      {flightForm.toSearchList.map(
                        (airportDetail: AirportDetails, airportIndex) => (
                          <div
                            key={airportIndex}
                            className={searchClass.airport_list}
                            onClick={() =>
                              handleToAirportSelect(index, airportDetail)
                            }
                          >
                            <div className={searchClass.airport_country}>
                              <h5>{airportDetail.city}</h5>
                              <p>{airportDetail.name}</p>
                            </div>
                            <div className={searchClass.airport_code}>
                              <h6>{airportDetail.iataCode}</h6>
                              <p>
                                {checkCountryNameWithCountryCode(
                                  airportDetail.country,
                                )}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={searchClass.search_flight_section} key={index}>
            <div className={searchClass.search_flight_departing}>
              <div className={searchClass.search_flight_departing_container}>
                <div className={searchClass.search_flight_departing_header}>
                  <Image src={FlightCalenderIcon} alt="flight_departing" />
                  <p>DEPARTING</p>
                </div>

                <div className={searchClass.search_flight_departing_date}>
                  <div className={searchClass.search_flight_departing_fulldate}>
                    {flightForm?.origin?.date ? (
                      <>
                        <span
                          className={
                            searchClass.search_flight_departing_month_date
                          }
                          onClick={() => {
                            setFlightForms((prevFlightForms) => {
                              const updatedFlightForms = [...prevFlightForms];
                              updatedFlightForms[
                                index
                              ].openDepartingDatePickerAfterDateSelection =
                                true;
                              return updatedFlightForms;
                            });
                          }}
                        >
                          {formatDateIntoSearchDateFormat(
                            flightForm.origin.date,
                          )}
                          <p
                            onClick={() => {
                              setFlightForms((prevFlightForms) => {
                                const updatedFlightForms = [...prevFlightForms];
                                updatedFlightForms[index].origin.date = "";
                                updatedFlightForms[
                                  index
                                ].openDepartingDatePickerAfterDateSelection =
                                  false;
                                return updatedFlightForms;
                              });
                            }}
                          >
                            X
                          </p>
                        </span>

                        {flightForm.openDepartingDatePickerAfterDateSelection && (
                          <div className="search_flight__date-picker">
                            <RangePicker
                              className="search_flight__date-picker-initial"
                              disabledDate={disabledDepartureDate}
                              allowClear={false}
                              value={
                                flightForm?.origin?.date
                                  ? [dayjs(flightForm.origin.date), null]
                                  : null
                              }
                              onCalendarChange={(dates) => {
                                if (dates && dates.length > 0) {
                                  setFlightForms((prevFlightForms) => {
                                    const updatedFlightForms = [
                                      ...prevFlightForms,
                                    ];
                                    updatedFlightForms[index].origin.date =
                                      dates[0]?.toISOString();
                                    updatedFlightForms[
                                      index
                                    ].openDepartingDatePickerAfterDateSelection =
                                      false;
                                    return updatedFlightForms;
                                  });
                                }
                              }}
                              onOpenChange={(open) =>
                                setFlightForms((prevFlightForms) => {
                                  const updatedFlightForms = [
                                    ...prevFlightForms,
                                  ];
                                  updatedFlightForms[
                                    index
                                  ].openDepartingDatePickerAfterDateSelection =
                                    open;
                                  return updatedFlightForms;
                                })
                              }
                              style={{ width: "100%" }}
                              placeholder={["", ""]}
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
                            setFlightForms((prevFlightForms) => {
                              const updatedFlightForms = [...prevFlightForms];
                              updatedFlightForms[
                                index
                              ].openDepartingDatePickerAfterDateSelection =
                                true;
                              return updatedFlightForms;
                            });
                          }}
                          style={{ position: "absolute" }}
                        >
                          Select Date
                        </h5>
                        <div className="search_flight__date-picker">
                          <RangePicker
                            disabledDate={disabledDepartureDate}
                            allowClear={false}
                            value={
                              flightForm?.origin?.date
                                ? [dayjs(flightForm.origin.date), null]
                                : null
                            }
                            open={
                              flightForm?.openDepartingDatePickerAfterDateSelection
                            }
                            onCalendarChange={(dates) => {
                              if (dates && dates.length > 0) {
                                setFlightForms((prevFlightForms) => {
                                  const updatedFlightForms = [
                                    ...prevFlightForms,
                                  ];
                                  updatedFlightForms[index].origin.date =
                                    dates[0]?.toISOString();
                                  updatedFlightForms[
                                    index
                                  ].openDepartingDatePickerAfterDateSelection =
                                    false;
                                  return updatedFlightForms;
                                });
                              }
                            }}
                            onOpenChange={(open) =>
                              setFlightForms((prevFlightForms) => {
                                const updatedFlightForms = [...prevFlightForms];
                                updatedFlightForms[
                                  index
                                ].openDepartingDatePickerAfterDateSelection =
                                  open;
                                return updatedFlightForms;
                              })
                            }
                            style={{ width: "100%" }}
                            placeholder={["", ""]}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {flightForm?.origin?.date && (
                  <div className={searchClass.search_flight_departing_day}>
                    {convertDateDayOfWeekFormat(flightForm.origin.date)}{" "}
                  </div>
                )}
              </div>
            </div>
          </div>

          {index === 0 && (
            <div
              className={searchClass.search_flight_travellers}
              style={{
                position: `${router.pathname === "/flightList" ? "static" : "relative"}`,
              }}
              onClick={() => {
                triggerTravellerOptionsDropDown();
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
          )}

          {index > 1 && (
            <Tooltip title="Remove">
              <Button
                onClick={() =>
                  setFlightForms(flightForms.filter((_, i) => i !== index))
                }
                style={{ marginLeft: "10px" }}
              >
                <CloseOutlined />
              </Button>
            </Tooltip>
          )}
          {index === 0 && (
            <div
              className={searchClass.search_flight_button}
              onClick={() => {
                handleMultiCitySearchFlight();
                // setTriggerSearchResultFrom("button");
              }}
            >
              <Button className="btn-primary">Search Flights</Button>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <Button onClick={addFlightForm} className="btn-primary">
          Add Another Flight
        </Button>
      </div>
    </div>
  );
}

export default MultiCitySearch;
