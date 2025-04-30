/* eslint-disable */
// @ts-nocheck

import React, { Dispatch, SetStateAction } from "react";
import { Radio, RadioChangeEvent, Select } from "antd";

import searchClass from "../search.module.css";

import CustomLabel from "../../../CustomLabel";
import {
  Filtered_Country_Code_List,
  nationalityList,
  totalTravellerCountLimit,
} from "@/app/constants/ui/app-config";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

interface travellerDropdown {
  travellerNationality: string;
  travellerCount: {
    adults: number;
    childrens: number;
    infants: number;
  };
  setTravellerNationality: (value: string) => void;
  setTravellerCount: any;
  setTotalTravellerCount: (value: any) => void;
  flightClassType: {
    code: string;
    title: string;
  };

  setFlightClassType: any;
  ref: any;
  selectRef: any;
  optionRef: any;
  totalTravellerCount: number;
  setToggleTravellerDropdown: Dispatch<SetStateAction<boolean>>;
  travellerContainerTopPosition: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
}

function TravellerDropDown(props: travellerDropdown) {
  const {
    travellerNationality,
    setTravellerNationality,
    travellerCount,
    setTravellerCount,
    setTotalTravellerCount,
    flightClassType,
    setFlightClassType,
    ref,
    selectRef,
    optionRef,
    totalTravellerCount,
    setToggleTravellerDropdown,
    travellerContainerTopPosition,
  } = props;
  const { Option } = Select;
  const { scrollRef } = useSelector((state: any) => state.userAuth);
  const router = useRouter();
  const handleCountChange = (
    type: string,
    action: "increment" | "decrement",
  ) => {
    const countKey = type;
    //@ts-ignore
    if (action === "decrement" && travellerCount[countKey] === 0) {
      return;
    }

    setTravellerCount((prevCount: any) => ({
      ...prevCount,
      [countKey]:
        action === "increment"
          ? prevCount[countKey] + 1
          : Math.max(0, prevCount[countKey] - 1),
    }));

    setTotalTravellerCount((prevCount: number) =>
      action === "increment" ? prevCount + 1 : Math.max(0, prevCount - 1),
    );
  };

  const handleClassTypeSelection = (e: RadioChangeEvent) => {
    let flightType = e.target.value.toLowerCase();
    setFlightClassType({
      code: e.target.value,
      title: flightType[0].toUpperCase() + flightType.slice(1),
    });
  };

  const handleTravellerNationality = (nationality: string) => {
    setTravellerNationality(nationality);
  };

  const countriesListFilter = (codes: string[]) => {
    let filteredCountriesList = nationalityList.filter((country) =>
      codes.includes(country.code),
    );
    return filteredCountriesList;
  };

  return (
    <div
      className={`${searchClass.search_flight_traveller_dropdown} traveller-dropdown`}
      ref={selectRef}
      style={{
        bottom:
          router.pathname === "/flightList"
            ? `${travellerContainerTopPosition.bottom - 388}px`
            : "",
        left:
          router.pathname === "/flightList"
            ? `${travellerContainerTopPosition.right - 300}px`
            : "",
      }}
    >
      <div className="traveller-dropdown-inner-section">
        <div className={searchClass.search_flight_nationality}>
          <CustomLabel label={"Select Nationality"} required />
          <Select
            id="nationality"
            className={searchClass.search_form__fields_name_input}
            value={travellerNationality}
            showSearch
          >
            {countriesListFilter(Filtered_Country_Code_List)?.map((option) => (
              <Option key={option.code} value={option.code}>
                <div onClick={() => handleTravellerNationality(option?.code)}>
                  <div className="country-list-dropdown">{option.title}</div>
                </div>
              </Option>
            ))}
          </Select>
        </div>
        <div className="traveller-dropdown-traveller-section">
          <div className="traveller_type--details">
            <p>Adults</p>
            <span>12 years and older</span>
          </div>

          <div className="traveller-select-box-section">
            <span
              className="traveller-select-box"
              onClick={() => handleCountChange("adults", "decrement")}
            >
              -
            </span>
            <span className="traveller-count">
              {travellerCount?.adults || 0}
            </span>
            <span
              className={
                totalTravellerCount === totalTravellerCountLimit
                  ? "traveller-select-box-disable"
                  : "traveller-select-box"
              }
              onClick={() => handleCountChange("adults", "increment")}
            >
              +
            </span>
          </div>
        </div>
        <div className="traveller-dropdown-traveller-section">
          <div className="traveller_type--details">
            <p>Children</p>
            <span>2-11 years at the time of travel</span>
          </div>
          <div className="traveller-select-box-section">
            <span
              className="traveller-select-box"
              onClick={() => handleCountChange("childrens", "decrement")}
            >
              -
            </span>
            <span className="traveller-count">
              {travellerCount?.childrens || 0}
            </span>
            <span
              className={
                totalTravellerCount === totalTravellerCountLimit
                  ? "traveller-select-box-disable"
                  : "traveller-select-box"
              }
              onClick={() => handleCountChange("childrens", "increment")}
            >
              +
            </span>
          </div>
        </div>
        <div className="traveller-dropdown-traveller-section">
          <div className="traveller_type--details">
            <p>Infants</p>
            <span>0-23 months at the time of travel</span>
          </div>
          <div className="traveller-select-box-section">
            <span
              className="traveller-select-box"
              onClick={() => handleCountChange("infants", "decrement")}
            >
              -
            </span>
            <span className="traveller-count">
              {travellerCount?.infants || 0}
            </span>
            <span
              className={
                totalTravellerCount === totalTravellerCountLimit
                  ? "traveller-select-box-disable"
                  : "traveller-select-box"
              }
              onClick={() => handleCountChange("infants", "increment")}
            >
              +
            </span>
          </div>
        </div>
        <div className="traveller-flight-class-section">
          <Radio.Group
            onChange={handleClassTypeSelection}
            value={flightClassType.code}
          >
            {flightClassTypeList?.map((classType, classIndex) => (
              <div key={classIndex}>
                <Radio value={classType?.code}>{classType?.title}</Radio>
              </div>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export const flightClassTypeList = [
  {
    title: "Economy",
    code: "ECONOMIC",
  },
  {
    title: "Premuim Economy",
    code: "ECONOMIC_PREMIUM",
  },
  {
    title: "Business",
    code: "BUSINESS",
  },
  {
    title: "First",
    code: "FIRST",
  },
  {
    title: "All",
    code: "ALL",
  },
];
export default TravellerDropDown;
