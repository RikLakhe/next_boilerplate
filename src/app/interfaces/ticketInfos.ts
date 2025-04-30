export interface PassengerTicketInfos {
  id: number | string;
  ticketNumber: number | string;
  ticketRawText: string;
  passengerId: string;
  passengerFirstName: string;
  passengerLastName: string;
  passengerMiddleName: string;
  gender: string;
  passengerType: string;
  baseFare: number;
  taxFare: number;
  totalFare: number;
}

export interface PassengerFlightInfos {
  id: string;
  controlNumber: string;
  referenceNumber: string;
  airline: string;
  boardPoint: string;
  offPoint: string;
  baggageInfo: BaggageInfos;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  flightNumber: string;
  cabinClass: string;
  pnrId: string;
  departureCountry: string;
  departureAirport: string;
  departureTerminal: string;
  arrivalCountry: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  flightDuration: number;
  service: string;
  luggage: string;
  luggageType: string;
  transitTime: number;
}

export interface BaggageInfos {
  checkedBaggage: {
    value: number;
    quantityCode: string;
    unitQualifier: string;
  };
  carryBaggage: {
    value: number;
    quantityCode: string;
    unitQualifier: string;
  };
}

export interface AirportInfos {
  iataCode: string;
  name: string;
  detailedName: string;
  country: string;
  city: string;
}

export interface DefaultAirlineImageProps {
  airlineCode: string;
}

export interface ImageWrapperProps {
  imageUrl: string;
  airlineCode: string;
}
