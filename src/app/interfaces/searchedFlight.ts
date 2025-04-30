import { AirportDetails } from "./searchFlight";

export interface DestinationInfo {
  code: string;
  date: string | null;
  returnDate: string | null;
  name: string | null;
}

export interface TimeInfo {
  dateOfDeparture: string;
  timeOfDeparture: string;
  dateOfArrival: string;
  timeOfArrival: string;
}

export interface BaggageInfo {
  checkedBaggage: {
    quantityCode: string;
    unitQualifier: string;
    value: number;
  };
  handCarryBaggage?: {
    quantityCode: string;
    unitQualifier: string;
    value: number;
  };
}

export interface FlightInfo {
  segRef: number;
  flyingTime: number;
  airline: string;
  flightNumber: string;
  origin: DestinationInfo;
  destination: DestinationInfo;
  timeInfo: TimeInfo;
  baggageInfo: BaggageInfo;
  amenities: [];
  transitTime: number;
}

export interface ClassInfo {
  cabinClass: string;
  travellerRefNumber: number;
  travellerType: string;
}
export interface SegmentInfo {
  segRef: number;
  flightInfos: FlightInfo[];
  cabinClassInfos: ClassInfo[];
  boardPoint?: string;
  offPoint?: string;
  departureDate?: string;
  elapsedFlyingTime: number;
}

export interface FareDetails {
  totalAmount: number;
  totalTax: number;
  passengerType: string;
  passengerRef: string;
  totalFinalAmount: number;
}

export interface FareInfo {
  totalFare: number;
  totalTaxAmount: number;
  currency: string;
  details: FareDetails[];
  refundStatus: string;
  totalFinalFare: number;
}

export interface TravelData {
  segmentInfos: SegmentInfo[];
  fareInfo: FareInfo;
  ticketInfos?: FareInfo;
  pnrInfo?: PnrInfos;
  nationality?: string;
}

export interface PnrInfos {
  passengers: [];
}

export interface LocationDetails {
  location: string;
  locationCode: string;
  locationCountry: string;
}

type Location = {
  code: string;
  date: string | null | undefined;
  city: string;
  country: string;
};

export interface FlightForm {
  from: string;
  to: string;
  departingDate: Date | null;
  fromSearchList: AirportDetails[];
  toSearchList: AirportDetails[];
  fromSearchListVisible: boolean;
  toSearchListVisible: boolean;
  fromSearchListLoading: boolean;
  toSearchListLoading: boolean;
  openDepartingDatePickerAfterDateSelection: boolean;
  origin: Location;
  destination: Location;
}

type TripInfo = {
  origin: Location;
  destination: Location;
};

export interface UserTripInfo {
  roundTrip: boolean;
  trips: TripInfo[];
  cabinClass: string;
  tripType: string;
}

export interface FlightClassType {
  code: string;
  title: string;
}

export interface TravellerContainerPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
