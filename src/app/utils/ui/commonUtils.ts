/* eslint-disable */
// @ts-nocheck

import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { AirlineTypeProp, LoginSuccessData } from "@/interfaces";
import { handleErrorMessage } from "./errorHandling";
import {
  AIRLINEINFODETAILS,
  APP_ENV_TYPE,
  appConfig,
  DEV_APP_URL,
  nationalityList,
  OTP,
  PNR_SESSION_TIME,
  PROD_APP_URL,
  QA_APP_URL,
  tripConfig,
} from "@/app/constants/ui/app-config";
import {
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "./storageUtils";
import { PNR_SESSION_SIGNOUT_URL } from "@/app/constants/ui/api-constants";
import { Adds } from "@/interfaces/flightConfig";
import {
  convertDateDayOfWeekFormatForCountryCard,
  convertDateIntoDayOfMonthFormatForCountryCard,
  convertDateIntoYearFormatForCountryCard,
} from "@/app/utils/ui/dateAndTimeUtils";

export const showToastSuccess = (successMessage: string) => {
  toast.success(successMessage && successMessage);
};

export const showToastError = (errorMessage: string) => {
  toast.error(errorMessage && errorMessage);
};

export const showCustomToastError = (errorCode: any) => {
  toast.error(handleErrorMessage(errorCode?.response?.data?.code));
};

export const isEmpty = (obj: any) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const limitNameWithLength = (word: string, length: number) => {
  if (!word) return "";
  if (word && word.length <= length) return word;
  const displayWord = word.substring(0, length);
  return `${displayWord}...`;
};

export const getFullName = (
  firstName: string,
  middleName: string,
  lastName: string,
) => {
  if (firstName && lastName && !middleName) return `${firstName} ${lastName}`;
  return `${firstName} ${middleName} ${lastName}`;
};

export const userLoginSuccess = (userData: LoginSuccessData) => {
  clearLocalStorage(appConfig?.CLIENT_LOGOUT_EVENT);
  setLocalStorage(appConfig.CLIENT_JWT_TOKEN, userData?.token);
  setLocalStorage(appConfig.USER_ID, userData?.email);
  setLocalStorage(appConfig.USER_UNIQUE_ID, userData?.id);
  setLocalStorage(appConfig?.CLIENT_MOBILE_NUMBER, userData?.mobileNumber);
  setLocalStorage(appConfig?.CLIENT_FULL_NAME, userData?.fullName);
  setLocalStorage(appConfig?.CLIENT_COUNTRY_CODE, userData?.countryCode);
  setLocalStorage(appConfig?.CLIENT_EMAIL_VERIFIED, userData?.emailVerified);
  setLocalStorage(
    appConfig?.CLIENT_MOBILE_NUMBER_VERIFIED,
    userData?.mobileNumberVerified,
  );
  setLocalStorage(appConfig?.CLIENT_TYPE, userData?.customerType);
};

export const isUserAuthenticated = (): boolean => {
  const loggedData = getLocalStorage(appConfig?.CLIENT_JWT_TOKEN);
  if (!loggedData) {
    return false;
  }
  const decodedData = jwtDecode(loggedData);
  if (decodedData?.id) {
    return true;
  }
  clearUserLoggedStorage();
  showToastError("Session Expired");

  return false;
};

/**
 * Get Name Initials -> eg - Jack returns J
 * @param {string} name
 * @returns string
 */
export const getSingleNameInitial = (name: string): string | boolean => {
  if (name) {
    const nameInitial = name?.split("")[0];
    return nameInitial?.toUpperCase();
  }
  return false;
};

export const getNamePascalCase = (words: string | AirlineTypeProp) => {
  let tempWords: string[] = [];

  if (words) {
    if (typeof words === "string") {
      tempWords = words?.split(" ");
    } else {
      tempWords = words?.title?.split(" ");
    }
    tempWords = tempWords.map((word: string) =>
      word ? word?.[0]?.toUpperCase() + word?.slice(1)?.toLowerCase() : "",
    );
    return tempWords.join(" ");
  }
  return words;
};

export const getFirstNameOnly = (name: string) => {
  if (!name) {
    return "";
  }
  return name.split(" ")[0];
};

export const encodeStringifyDataIntoBase64Data = (dataToBeEncoded: string) => {
  if (!dataToBeEncoded) {
    return "";
  }
  const utf8Encoder = new TextEncoder();
  const utf8Bytes = utf8Encoder.encode(dataToBeEncoded);
  let binaryString = "";
  utf8Bytes.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });

  return btoa(binaryString);
};

export const decodeBase64DataIntoJsonParsedData = (dataToBeDecoded: string) => {
  if (!dataToBeDecoded) {
    return "";
  }
  const binaryString = atob(dataToBeDecoded);
  const utf8Bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    utf8Bytes[i] = binaryString.charCodeAt(i);
  }
  const utf8Decoder = new TextDecoder();
  const jsonString = utf8Decoder.decode(utf8Bytes);
  return JSON.parse(jsonString);
};

export const signoutBySessionId = (formData: { id: string }) => {
  axios
    .create({
      headers: {
        "X-XSRF-TOKEN": getLocalStorage(appConfig?.CLIENT_JWT_TOKEN),
      },
    })
    .post(PNR_SESSION_SIGNOUT_URL, formData);
};

export const getNationalityByCode = (nationalityCode: string | undefined) => {
  if (!nationalityCode) return "-";
  if (nationalityCode) {
    return nationalityList?.find((nationality) => {
      return nationality?.code === nationalityCode;
    })?.title;
  }
};

export const validateEncodedTokenData = (id: string) => {
  const uniqueId = getLocalStorage(appConfig?.USER_UNIQUE_ID);
  if (id !== uniqueId) {
    throw new Error("Invalid Token");
  }
};

export const clearUserLoggedStorage = () => {
  clearLocalStorage(appConfig?.CLIENT_JWT_TOKEN);
  clearLocalStorage(appConfig?.USER_ID);
  clearLocalStorage(appConfig?.USER_UNIQUE_ID);
  clearLocalStorage(appConfig?.CLIENT_COUNTRY_CODE);
  clearLocalStorage(appConfig?.FLIGHT_DETAILS);
  clearLocalStorage(appConfig?.FLIGHT_SEARCH_INFO);
  clearLocalStorage(appConfig?.CLIENT_NATIONALITY);
  clearLocalStorage(appConfig?.CLIENT_EMAIL_VERIFIED);
  clearLocalStorage(appConfig?.CLIENT_MOBILE_NUMBER_VERIFIED);
  clearLocalStorage(appConfig?.CLIENT_USER_DATA);
  clearLocalStorage(appConfig?.CLIENT_FULL_NAME);
  clearLocalStorage(appConfig?.CLIENT_SIGNUP_EMAIL);
  clearLocalStorage(appConfig?.PNR_SESSION_ID);
  clearLocalStorage(PNR_SESSION_TIME);
  clearLocalStorage(appConfig?.PNR_SUCCESS_ID);
  clearLocalStorage(appConfig?.FLIGHT_DETAILS_FROM_DASHBOARD);
  clearLocalStorage(appConfig?.PNR_ID_FROM_DASHBOARD);
  clearLocalStorage(appConfig?.CLIENT_TYPE);
  clearLocalStorage(AIRLINEINFODETAILS.AIRPORT_INFO_LIST);
  clearLocalStorage(AIRLINEINFODETAILS?.AIRLINE_INFO_LIST);
  clearLocalStorage(AIRLINEINFODETAILS.AIRLINE_IMAGE_INFO);
  clearLocalStorage(OTP.NAME);
  clearLocalStorage(appConfig?.MULTI_CITY_FLIGHT_SEARCH_INFO);
};

export const checkClientType = () => {
  return getLocalStorage(appConfig.CLIENT_TYPE);
};
export const handleScrollToPosition = (
  position: number,
  scrollRef: HTMLDivElement | null,
  pathName: string,
  smallSizeDetect: boolean,
) => {
  if (smallSizeDetect) return;
  if (pathName === "/")
    scrollRef?.scrollTo({
      behavior: "smooth",
      top: position,
    });
};

export const generateRandomNumber = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

export const getFullUrl = () => {
  if (typeof window !== "undefined") {
    const currentUrl = window.location.href;
    const urlObject = new URL(currentUrl);
    const hostEnviroment = urlObject.hostname.split("-")[0];
    if (hostEnviroment === APP_ENV_TYPE.DEV) {
      return DEV_APP_URL;
    } else if (hostEnviroment === APP_ENV_TYPE.QA) {
      return QA_APP_URL;
    } else if (hostEnviroment === APP_ENV_TYPE.LOCAL) {
      return urlObject.host;
    } else {
      return PROD_APP_URL;
    }
  }
};

export const handleNavigate = (ad: object, router) => {
  if (typeof window !== "undefined") {
    if (ad?.action === "OPEN") {
      if (ad?.redirect === "NEW") {
        const newWindow = window.open(`${ad.link}`, "_blank");
        if (newWindow) {
          newWindow.opener = null;
        }
      } else if (ad?.redirect === "SAME") {
        const newWindow = router.push(`${ad.link}`);
      }
    } else if (ad?.action === "SEARCH") {
      if (ad?.redirect === "NEW") {
        const newWindow = window.open(
          `${getFullUrl()}/flightList/?from=${ad?.data?.origin}&&to=${ad?.data?.destination}&&departingDate=${ad.data?.departureDate}&&returningDate=${ad.data?.returnDate}&&traveller=${1}&&class=${"ALL"}&&tripType=${!isEmpty(ad.data?.returnDate) ? tripConfig.TWO_WAY : tripConfig.ONE_WAY}`,
          "_blank",
        );
      } else if (ad?.redirect === "SAME") {
        router.push(
          `flightList/?from=${ad?.data?.origin}&&to=${ad?.data?.destination}&&departingDate=${ad.data?.departureDate}&&returningDate=${ad.data?.returnDate}&&traveller=${1}&&class=${"ALL"}&&tripType=${!isEmpty(ad.data?.returnDate) ? tripConfig.TWO_WAY : tripConfig.ONE_WAY}`,
        );
      }
    }
  }
};

export const handleCustomSearch = (item: Adds, router) => {
  let searchData = {
    tripsDetail: {
      originLocation: item?.data?.originTitle,
      originCode: item?.data?.origin,
      destinationLocation: item?.data?.destinationTitle,
      destinationCode: item?.data?.destination,
      originLocationCountry: item?.data?.originCountryCode,
      destinationLocationCountry: item?.data?.destinationCountryCode,
    },
    travellerInfo: {
      totalCount: 1,
      nationalityCode: "NP",
      adultCount: 1,
      childrenCount: 0,
      infantCount: 0,
    },
    dateInfo: {
      departing: {
        date: convertDateIntoDayOfMonthFormatForCountryCard(
          item?.data?.departureDate,
        ),
        day: convertDateDayOfWeekFormatForCountryCard(
          item?.data?.departureDate,
        ),
        year: convertDateIntoYearFormatForCountryCard(
          item?.data?.departureDate,
        ),
        fullDate: item?.data?.departureDate ?? "",
      },
      returning: {
        date: convertDateIntoDayOfMonthFormatForCountryCard(
          item?.data?.returnDate ?? "",
        ),
        day: convertDateDayOfWeekFormatForCountryCard(
          item?.data?.returnDate ?? "",
        ),
        year: convertDateIntoYearFormatForCountryCard(
          item?.data?.returnDate ?? "",
        ),
        fullDate: item?.data?.returnDate ?? "",
      },
    },
    cabinClassInfo: {
      code: "ALL",
      title: "All",
    },
  };
  const formDataToString = JSON.stringify(searchData);
  setLocalStorage(appConfig?.FLIGHT_SEARCH_INFO, formDataToString);
  handleNavigate(item, router);
};
