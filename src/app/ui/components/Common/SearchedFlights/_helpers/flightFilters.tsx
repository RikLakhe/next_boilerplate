/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

import RangeSlider from "./Slider";
import { FlightFiltersProps } from "@/app/interfaces";
import { flightFilterConfig } from "@/app/constants/ui/app-config";
import {
  checkAirlineName,
  convertPriceIntoStandardPriceFormat,
} from "./flightUtils";
import { ArrowLeftOutlined } from "@ant-design/icons";

const FlightFilters: React.FC<FlightFiltersProps> = (props) => {
  const {
    stopsType,
    fareTypes,
    airlineTypes,
    departingTimeSlots,
    landingTimeSlots,
    value,
    price,
    setStopsType,
    setFareTypes,
    setAirlineTypes,
    setDepartingTimeSlots,
    setLandingTimeSlots,
    setValue,
    stopTypeList,
    flightClassTypeList,
    airlineList,
    flightDetailLists,
    searchFlightPayload,
    searchFlightAirlineList,
    searchFlightLoading,
    noFlightFound,
    resetAllFilters,
    setResetAllFilters,
    from,
    toggleFlightDrawer,
  } = props;

  const [initialStopsType, setInitialStopsType] = useState(stopsType);
  const [initialFareTypes, setInitialFareTypes] = useState(fareTypes);
  const [initialAirlineTypes, setInitialAirlineTypes] = useState(airlineTypes);
  const [initialDepartingTimeSlots, setInitialDepartingTimeSlots] =
    useState(departingTimeSlots);
  const [initialLandingTimeSlots, setInitialLandingTimeSlots] =
    useState(landingTimeSlots);
  const [initialValue, setInitialValue] = useState(value);

  const handleFlightFiltersTypes = (
    e: CheckboxChangeEvent | any,
    value: string,
    stateArray: string[],
    setState: React.Dispatch<React.SetStateAction<string[]> | any>,
    type: string,
  ) => {
    switch (type) {
      case flightFilterConfig.CHECKBOX:
        if (e.target.checked) {
          if (!stateArray.includes(value)) {
            setState([...stateArray, value]);
          }
        } else {
          const updatedState = stateArray.filter((code) => code !== value);
          setState(updatedState);
        }
        break;
      case flightFilterConfig.TIMESLOTS:
        if (!stateArray.includes(value)) {
          setState([...stateArray, value]);
        } else {
          const updatedState = stateArray.filter((code) => code !== value);
          setState(updatedState);
        }
        break;
    }
  };

  useEffect(() => {
    if (resetAllFilters || searchFlightLoading) {
      setStopsType(initialStopsType);
      setFareTypes(initialFareTypes);
      setAirlineTypes(initialAirlineTypes);
      setDepartingTimeSlots(initialDepartingTimeSlots);
      setLandingTimeSlots(initialLandingTimeSlots);
      setValue(initialValue);
      setResetAllFilters(false);
    }
  }, [resetAllFilters, searchFlightLoading]);

  return (
    <div className={noFlightFound ? "no-flight-filters" : "flight-filters"}>
      <div className="flight-filters__top-section">
        {from !== "drawer" ? (
          <div className="flight-filters__pagination">
            <h5>SHOWING</h5>
            <div className="flight-filters__pagination-number">
              <span>{flightDetailLists?.length} </span> of{" "}
              {searchFlightPayload?.length}
            </div>
          </div>
        ) : (
          <div
            className="flight-filters__back"
            onClick={() => toggleFlightDrawer()}
          >
            <ArrowLeftOutlined style={{ fontSize: "18px" }} />
            <h5>Filter results</h5>
          </div>
        )}

        <div
          className="flight-filters__reset"
          onClick={() => setResetAllFilters((prevState) => !prevState)}
        >
          RESET
        </div>
      </div>
      <div
        className={
          from === "drawer"
            ? "flight-filters__main-section-drawer"
            : "flight-filters__main-section"
        }
      >
        <div className="flight-filters__stops">
          <h5>STOPS</h5>

          <div>
            {stopTypeList?.map(
              (stopType, stopIndex) =>
                stopType.fare !== 0 && (
                  <div
                    className="flight-filters__stop-checkbox"
                    key={stopIndex}
                  >
                    <Checkbox
                      checked={stopsType.includes(stopType.code)}
                      onChange={(e) =>
                        handleFlightFiltersTypes(
                          e,
                          stopType?.code,
                          stopsType,
                          setStopsType,
                          "checkbox",
                        )
                      }
                    >
                      {stopType?.title}
                    </Checkbox>
                    <div className="flight-filters__npr">
                      {stopType?.fareType}
                      <p>
                        {convertPriceIntoStandardPriceFormat(stopType?.fare)}
                      </p>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>

        <div className="flight-filters__times">
          <h5>TIMES</h5>

          <div className="flight-filters__time-departure">
            <p>DEPARTURE</p>

            <div className="flight-filters__time-departure-lists">
              {flightTimeCategoryList?.departure?.map(
                (departureTimeSlot, departingTimeIndex) => (
                  <div
                    className="flight-filters__departure-time-slot"
                    key={departingTimeIndex}
                    onClick={(e) =>
                      handleFlightFiltersTypes(
                        e,
                        departureTimeSlot?.code,
                        departingTimeSlots,
                        setDepartingTimeSlots,
                        "time-slots",
                      )
                    }
                  >
                    <p>{departureTimeSlot?.title}</p>
                    <div
                      className={
                        departingTimeSlots.find(
                          (item) => item === departureTimeSlot.code,
                        )
                          ? "flight-filters__time-slot-active"
                          : `flight-filters__time-slot`
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="flight-filters__time-landing">
            <p>LANDING</p>

            <div className="flight-filters__time-landing-lists">
              {flightTimeCategoryList?.landing?.map(
                (landingTimeSlot, landingTimeIndex) => (
                  <div
                    className="flight-filters__landing-time-slot"
                    key={landingTimeIndex}
                    onClick={(e) => {
                      handleFlightFiltersTypes(
                        e,
                        landingTimeSlot?.code,
                        landingTimeSlots,
                        setLandingTimeSlots,
                        "time-slots",
                      );
                    }}
                  >
                    <p>{landingTimeSlot.title}</p>
                    <div
                      className={
                        landingTimeSlots.find(
                          (item) => item === landingTimeSlot?.code,
                        )
                          ? "flight-filters__time-slot-active"
                          : "flight-filters__time-slot"
                      }
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="flight-filters__prices">
          <h5>PRICES</h5>

          <div className="flight-filters__slider">
            <RangeSlider
              min={price.min}
              max={price.max}
              step={500}
              value={value}
              onChange={setValue}
            />
            <div className="flight-filters__values">
              <span>
                {flightDetailLists && flightDetailLists[0]?.fareInfo?.currency}{" "}
                {value.min}
              </span>
              <span>
                {flightDetailLists && flightDetailLists[0]?.fareInfo?.currency}{" "}
                {value.max}
              </span>
            </div>
          </div>
        </div>
        {flightClassTypeList && flightClassTypeList?.length > 0 && (
          <div className="flight-filters__fare-types">
            <h5>FARE TYPES</h5>

            <div className="flight-filters__fare-types-list">
              {flightClassTypeList?.map((fareType, fareIndex) => (
                <Checkbox
                  checked={fareTypes.includes(fareType.code)}
                  key={fareIndex}
                  onChange={(e) =>
                    handleFlightFiltersTypes(
                      e,
                      fareType?.code,
                      fareTypes,
                      setFareTypes,
                      "checkbox",
                    )
                  }
                >
                  {fareType?.title}
                </Checkbox>
              ))}
            </div>
          </div>
        )}
        <div className="flight-filters__airline-types">
          <h5>AIRLINES</h5>

          <div className="flight-filters__airline-types-list">
            {airlineList?.map((airlineType, airlineIndex) => (
              <Checkbox
                checked={airlineTypes.includes(airlineType.code)}
                key={airlineIndex}
                onChange={(e) =>
                  handleFlightFiltersTypes(
                    e,
                    airlineType?.code,
                    airlineTypes,
                    setAirlineTypes,
                    "checkbox",
                  )
                }
              >
                {checkAirlineName(searchFlightAirlineList, airlineType?.code)}
              </Checkbox>
            ))}
          </div>
        </div>
        {from === "drawer" && (
          <div className="flight-filters__bottom-section">
            <Button
              onClick={() => {
                setResetAllFilters((prevState) => !prevState);
                toggleFlightDrawer();
              }}
            >
              Cancel
            </Button>
            <Button
              className="ant-btn-primary"
              onClick={() => toggleFlightDrawer()}
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const flightTimeCategoryList = {
  departure: [
    {
      title: "0-6",
      code: "0000-0600",
    },
    {
      title: "6-12",
      code: "0600-1200",
    },
    {
      title: "12-18",
      code: "1200-1800",
    },
    {
      title: "18-24",
      code: "1800-2400",
    },
  ],
  landing: [
    {
      title: "0-6",
      code: "0000-0600",
    },
    {
      title: "6-12",
      code: "0600-1200",
    },
    {
      title: "12-18",
      code: "1200-1800",
    },
    {
      title: "18-24",
      code: "1800-2400",
    },
  ],
};

export default FlightFilters;
