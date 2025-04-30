/* eslint-disable */
// @ts-nocheck

import React, { SetStateAction } from "react";

export interface StopTypeProp {
  code: string;
  fare: string | number;
  fareType: string;
  title: string;
}

export interface FareTypeProp {
  code: string;
  title: string;
}

export interface AirlineTypeProp {
  status: string;
  title: string;
}

export interface DepartingTimeSlotsTypeProp {
  code: string;
  title: string;
}

export interface LandingTimeSlotsTypeProp {
  code: string;
  title: string;
}

export interface FlightFiltersProps {
  stopsType: string[];
  fareTypes: string[];
  airlineTypes: string[];
  departingTimeSlots: string[];
  landingTimeSlots: string[];
  value: { min: number; max: number };
  price: { min: number; max: number };
  setStopsType: (newValue: string[]) => void;
  setFareTypes: (newValue: string[]) => void;
  setAirlineTypes: (newValue: string[]) => void;
  setDepartingTimeSlots: (newValue: string[]) => void;
  setLandingTimeSlots: (newValue: string[]) => void;
  setValue: (newValue: { min: number; max: number }) => void;
  setPrice: (newValue: { min: number; max: number }) => void;
  stopTypeList: Stop[];
  flightClassTypeList: CabinClass[];
  airlineList: AirlineTypes[];
  flightDetailLists: [] | any;
  searchFlightPayload: [] | any;
  searchFlightAirlineList: {} | any;
  searchFlightLoading: boolean;
  noFlightFound: boolean;
  setResetAllFilters: React.Dispatch<React.SetStateAction<boolean>>;
  resetAllFilters: boolean;
  toggleFlightDrawer: any;
}

export interface AllFlightDetailProps {
  flightDetailLists: [] | any;
  handleFlightPriceSort: any;
  flightPriceSort: boolean;
  searchFlightAirlineList: {} | any;
  searchFlightAirportInfoList: {} | any;
  noFlightFound: boolean;
  airlineImageLists: [] | any;
  setOpenFlightFilterDrawer: React.Dispatch<SetStateAction<boolean>>;
  setOpenSearchFlightForSmallScreenSize: React.Dispatch<
    SetStateAction<boolean>
  >;
  flightAds: any;
  isFlightPriceSortEmpty?: boolean;
}

export interface Stop {
  title: string;
  code: string;
  fare: number;
  fareType: string;
}

export interface CabinClass {
  code: string;
  title: string;
}

export interface AirlineTypes {
  code: string;
  title: string;
}

export interface FlightAirportInfo {
  [airportCode: string]: string;
}

export interface FlightAirlineInfo {
  [airlineCode: string]: string;
}

export interface AllFlightListDetailProps {
  flightDetailLists: [] | any;
  handleFlightPriceSort: any;
  flightPriceSort: boolean;
  searchFlightAirlineList: {} | any;
  searchFlightAirportInfoList: {} | any;
  noFlightFound: boolean;
  airlineImageLists: [] | any;
  setOpenFlightFilterDrawer: React.Dispatch<SetStateAction<boolean>>;
  setOpenSearchFlightForSmallScreenSize: React.Dispatch<
    SetStateAction<boolean>
  >;
  flightAds: any;
  isFlightPriceSortEmpty?: boolean;
  openMultipleFlightDetail?: boolean;
  singleFlightDetailForStorage: any;
  setSingleFlightDetailForStorage: any;
  fareChangeData: number;
  setFareChangeData: React.Dispatch<SetStateAction<number>>;
  toggleFareChangeModal: any;
  handleFlightBookEvenAfterPriceChange: any;
  checkAirportLocationName: any;
  checkIfAirlineIsOpenForBooking: any;
  redirectToFlightDetail: any;
  handleBookFlight: any;
  checkAirlineImageLink: any;
  FlightDetailView: any;
  handleFlightDetailView: any;
  handleRoundTripFlightDetailView: any;
  oldFareData: number;
  setOldFareData: React.Dispatch<SetStateAction<number>>;
  newFareData: any;
  setNewFareData: any;
  openFlightDetail?: boolean;
  flightRefs?: any;
}
