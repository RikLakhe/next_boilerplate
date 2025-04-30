/* eslint-disable */
// @ts-nocheck

import axios from "axios";
import { Input, Select } from "antd";
import React, { useEffect } from "react";

import CustomLabel from "../CustomLabel";
import { appConfig } from "@/app/constants/ui/app-config";
import { countriesCode } from "@/app/utils/countryCodeUtlis";
import { getLocalStorage } from "@/app/utils/ui/storageUtils";
import { FETCH_GEO_LOCATION_URL } from "@/app/constants/ui/api-constants";

interface formikProps {
  formik: any;
  selectedCountryCode?: string;
  setSelectedCountryCode?: (code: string) => void;
  disabledField?: boolean;
}

const CustomPhoneNumberField: React.FC<formikProps> = ({
  formik,
  selectedCountryCode,
  setSelectedCountryCode,
  disabledField,
}) => {
  const selectBefore = (
    <Select
      showSearch
      defaultValue={
        getLocalStorage(appConfig?.CLIENT_SIGNUP_MOBILE_CODE) ||
        getLocalStorage(appConfig?.CLIENT_COUNTRY_CODE) ||
        selectedCountryCode ||
        "+977"
      }
      options={countriesCode?.map((country) => ({
        label: country.code,
        value: country.name,
      }))}
      onChange={(selectedOption, selectedData: any) => {
        if (typeof setSelectedCountryCode === "function") {
          setSelectedCountryCode(selectedData?.label);
        }
      }}
      disabled={
        getLocalStorage(appConfig?.CLIENT_SIGNUP_MOBILE_CODE) ||
        getLocalStorage(appConfig?.CLIENT_COUNTRY_CODE) ||
        disabledField
      }
    />
  );

  const getGeoInfo = () => {
    axios
      .get(FETCH_GEO_LOCATION_URL)
      .then((response) => {
        let data = response?.data;
        if (typeof setSelectedCountryCode === "function") {
          setSelectedCountryCode(data.country_calling_code);
        }
      })
      .catch((error) => {
        if (typeof setSelectedCountryCode === "function") {
          setSelectedCountryCode("+977");
        }
      });
  };

  useEffect(() => {
    getGeoInfo();
  }, []);

  return (
    <div className="form__fields">
      <CustomLabel label={"Mobile Number"} required />
      <Input
        className="form__fields_phone_number"
        name="mobileNumber"
        type="text"
        addonBefore={selectBefore}
        maxLength={10}
        onKeyDown={(e) => {
          const inputValue = e.key;
          if (!/^\d$/.test(inputValue) && inputValue !== "Backspace") {
            e.preventDefault(); // Prevent non-numeric characters from being typed
          }
        }}
        onChange={(e) => {
          const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
          formik.setFieldValue("mobileNumber", inputValue);
        }}
        value={formik.values.mobileNumber || ""}
        disabled={
          getLocalStorage(appConfig.CLIENT_SIGNUP_MOBILE_NUMBER) ||
          disabledField
        }
      />
      {formik.errors.mobileNumber && formik.touched.mobileNumber && (
        <span className="errors">{formik.errors.mobileNumber}</span>
      )}
    </div>
  );
};

export default CustomPhoneNumberField;
