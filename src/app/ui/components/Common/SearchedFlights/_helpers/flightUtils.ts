/* eslint-disable */
// @ts-nocheck

import { BaggageInfo, SegmentInfo, TravelData } from "@/app/interfaces";
import { convertTimeToStandardTime, getNamePascalCase } from "@/app/utils/ui";
import {
  baggageTypeConfig,
  cabinClassConfig,
  DEFAULT_BAGGAGE_WEIGHT,
  refundStatusConfig,
  weightConfig,
} from "@/app/constants/ui/app-config";
import ImageWrapper from "@/app/ui/components/Common/SearchedFlights/_helpers/imageWrapper";
import DefaultAirlineImageView from "@/app/ui/components/Common/SearchedFlights/_helpers/defaultAirlineImageView";

export const checkIfFlightHasMoreSegments = (flight: TravelData) => {
  if (flight?.segmentInfos?.length > 1) {
    return true;
  }
  return false;
};

export const convertFlightTime = (flightTime: string) => {
  return `${flightTime?.slice(0, 2)}:${flightTime?.slice(2)}`;
};

export const checkNumberOfStops = (flightDetail: SegmentInfo) => {
  const totalStopNumber = flightDetail?.flightInfos?.length - 1;
  if (totalStopNumber === 0) {
    return "Non stop";
  }
  if (totalStopNumber === 1) {
    return `${totalStopNumber} stop`;
  }
  return `${totalStopNumber} stops`;
};

export const addAllFlyingTime = (flightDetail: SegmentInfo) => {
  let totalFlyingTime = 0;
  for (const flight of flightDetail?.flightInfos) {
    totalFlyingTime += flight?.flyingTime;
  }
  return convertTimeToStandardTime(totalFlyingTime);
};

export const convertPriceIntoStandardPriceFormat = (
  flight: number | null | undefined,
) => {
  if (!flight) {
    return 0;
  }
  const formattedPrice = flight.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  });
  return formattedPrice;
};

export const checkBaggageInfo = (baggage: BaggageInfo) => {
  if (baggage?.handCarryBaggage?.value) {
    const handBaggageValue = baggage?.handCarryBaggage?.value;
    const baggageValue = baggage?.checkedBaggage?.value;
    if (handBaggageValue === 0) {
      return `${baggageValue} Kgs`;
    } else {
      return `${baggageValue} + ${handBaggageValue} Kgs`;
    }
  }
  if (
    baggage?.checkedBaggage?.quantityCode?.toUpperCase() ===
    baggageTypeConfig?.PIECE
  ) {
    const totalNumberOfBaggageValue = baggage?.checkedBaggage?.value;
    return `${totalNumberOfBaggageValue} X ${DEFAULT_BAGGAGE_WEIGHT} Kgs`;
  }
  if (
    baggage?.checkedBaggage?.unitQualifier?.toUpperCase() ===
    weightConfig?.POUND
  ) {
    return `${baggage?.checkedBaggage?.value} lbs`;
  }
  return `${baggage?.checkedBaggage?.value} Kgs`;
};

export const changeCabinClassName = (cabinClass: string) => {
  switch (cabinClass) {
    case cabinClassConfig.BUSINESS:
      return "BUSINESS";

    case cabinClassConfig?.FIRST:
      return "FIRST";

    case cabinClassConfig.ECONOMIC_STANDARD:
      return "ECONOMIC STANDARD";

    case cabinClassConfig.ECONOMIC_PREMIUM:
      return "ECONOMIC PREMIUM";

    case cabinClassConfig.ECONOMIC:
      return "ECONOMIC";
    default:
      return `Class type: ${cabinClass}`;
  }
};

export const checkAirlineName = (
  searchFlightAirlineList: {} | any,
  airlineCode: string,
) => {
  if (searchFlightAirlineList) {
    return getNamePascalCase(searchFlightAirlineList?.[airlineCode]);
  }
  return airlineCode;
};

export const checkAirlineImages = (
  airlineImageLists: {} | any,
  airlineCode: any,
) => {
  if (airlineImageLists && airlineCode in airlineImageLists) {
    return airlineImageLists?.[airlineCode];
  }
  return null;
};

export const checkRefundStatus = (status: string) => {
  switch (status) {
    case refundStatusConfig?.NON_REFUNDABLE:
      return "Non Refundable";
    case refundStatusConfig?.PARTIAL_REFUNDABLE:
      return "Partial Refundable";
    case refundStatusConfig?.REFUNDABLE:
      return "Refundable";
    default:
      return "";
  }
};
