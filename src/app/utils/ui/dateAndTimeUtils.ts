/* eslint-disable */
// @ts-nocheck

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { passengerTypes } from "@/app/constants/ui/app-config";

dayjs.extend(customParseFormat);

export const formatDateToStandard = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const convertTimeToStandardTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  return `${hours}h ${minutes}m`;
};

export const convertDateIntoDayFormat = (date: string) => {
  return dayjs(date).format("ddd, MMM D");
};

export const convertDateIntoDayYearFormat = (date: string = "") => {
  return dayjs(date).format("ddd - MMM D, YYYY");
};
export const convertDateIntoYearHourMonthFormat = (date: string = "") => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const convertDateIntoTicketDownloadFormat = (date: string = "") => {
  return dayjs(date).format("MMM D, YYYY (ddd) ");
};

export const convertDateIntoFullYearFormat = (date: string = "") => {
  return dayjs(date).format("YYYY MM DD");
};
export const convertDateIntoYearFormat = (date: string = "") => {
  return dayjs(date).format("YYYY");
};
export const convertDateIntoYearFormatForCountryCard = (date: string = "") => {
  const dateIntoYear = dayjs(date).format("YYYY");
  if (dateIntoYear === "Invalid Date") {
    return "";
  }
  return dateIntoYear;
};

export const convertDateDayOfWeekFormat = (date: string = "") => {
  return dayjs(date).format("ddd");
};
export const convertDateDayOfWeekFormatForCountryCard = (date: string = "") => {
  const dayOfWeek = dayjs(date).format("ddd");
  if (dayOfWeek === "Invalid Date") {
    return "";
  }
  return dayOfWeek;
};
export const convertDateIntoDayOfMonthFormat = (date: string = "") => {
  return dayjs(date).format("MMM DD");
};
export const convertDateIntoDayOfMonthFormatForCountryCard = (
  date: string = "",
) => {
  const dateIntoDayofMonth = dayjs(date).format("MMM DD");
  if (dateIntoDayofMonth === "Invalid Date") {
    return "";
  }
  return dateIntoDayofMonth;
};

export const convertTimeIntoStandard24HourFormat = (time: string = "") => {
  if (!time) {
    return "N/A";
  }
  return time?.split(".")?.[0]?.split(":")?.slice(0, 2)?.join(":");
};

/**
 * The function `deadlineTime` takes a time value in milliseconds and returns a formatted time
 * representing the deadline time.
 * @param {number} time - The `time` parameter is a number representing the amount of time in
 * milliseconds that you want to add to the current time.
 * @returns a formatted string representing the deadline time.
 */
export const deadlineTime = (time: number) => {
  const currentTime = dayjs();
  return currentTime.add(time, "millisecond").format("YYYY-MM-DD HH:mm:ss");
};

export const convertRecognizedDateIntoStandardDateFormat = (
  date: string = "",
) => {
  return dayjs(date, "YYMMDD").format("YYYY-MM-DD");
};
export const convertRecognizedDateOfBirth = (date: string = "") => {
  const selectedDateValue = date.slice(0, 2);
  const selectedMonthValue = date.substring(2, 4);
  const selectedMonthDay = date.substring(4, 6);
  const currentYear = parseInt(new Date().getFullYear().toString().slice(-2));
  const convertedYear =
    parseInt(selectedDateValue) <= currentYear
      ? `${getCurrentCentury() + parseInt(selectedDateValue)}`
      : `${getCurrentCentury() - 100 + parseInt(selectedDateValue)}`;
  const ocrScannedDateOfBirth = `${convertedYear}${selectedMonthValue}${selectedMonthDay}`;
  return dayjs(ocrScannedDateOfBirth, "YYYYMMDD").format("YYYY-MM-DD");
};

export const getCurrentCentury = () => {
  const currentYear = dayjs().year();
  return Math.floor((currentYear - 1) / 100) * 100;
};

/**
 * The function `parseStandardDateFormat` takes a date string, formats it to a standard format, and
 * extracts the day, month, and year components along with the formatted date string.
 * @param {string} date - The `date` parameter is a string representing a date value.
 * @returns An object containing the day, month, year, and formatted date string.
 */
export const parseStandardDateFormat = (date: string) => {
  const formattedDateString = formatDateToStandard(date);
  const day = convertDateDayOfWeekFormat(formattedDateString);
  const month = convertDateIntoDayOfMonthFormat(formattedDateString);
  const year = convertDateIntoYearFormat(formattedDateString);

  return { day, month, year, formattedDateString };
};

export const isSelectedDateBeforeDateToCompare = (
  selectedDate: Date | null,
  dateToCompare: string | null,
) => {
  const formattedSelectedDate = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");
  const formattedReturnDateToCompare =
    dayjs(dateToCompare).format("YYYY-MM-DD");

  return dayjs(formattedSelectedDate).isBefore(formattedReturnDateToCompare);
};

export const checkTravellerSelectedDateExceedsReturnTime = (
  selectedDate: Date | null,
  travellerType: string,
  dateToCompare: string | null,
) => {
  const formattedSelectedDate = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");
  const formattedReturnDateToCompare =
    dayjs(dateToCompare).format("YYYY-MM-DD");
  switch (travellerType) {
    case passengerTypes?.INFANT:
      return dayjs(formattedSelectedDate).isBefore(
        dayjs(formattedReturnDateToCompare).subtract(2, "year"),
      );
    case passengerTypes?.CHILD:
      return (
        dayjs(formattedSelectedDate).isAfter(
          dayjs(formattedReturnDateToCompare).subtract(2, "year"),
        ) ||
        dayjs(formattedSelectedDate).isBefore(
          dayjs(formattedReturnDateToCompare).subtract(12, "year"),
        )
      );
    case passengerTypes?.ADULT:
      return dayjs(formattedSelectedDate).isAfter(
        dayjs(formattedReturnDateToCompare).subtract(12, "year"),
      );

    default:
      break;
  }
};

export const formatYearMonthDayHourMinute = (date: string = "") => {
  return dayjs(date).format("YYYY-MM-DD, HH:mm");
};

export const unixTimeStampFormat = (timeStampInSeconds: string): number => {
  const currentTime = Date.now();
  const newTime = currentTime + parseFloat(timeStampInSeconds) * 1000;
  const unixTimestamp = Math.floor(newTime / 1000);
  return unixTimestamp;
};

export const formatUnixTimeCountdown = (
  milliseconds: number | null,
): string => {
  if (milliseconds === null) {
    return "02:00";
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
};

export const formatDateIntoSearchDateFormat = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};
