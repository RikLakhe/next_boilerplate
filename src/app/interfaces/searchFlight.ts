export interface AirportLocationType {
  airportName: string;
  airportCode: string;
  address: {
    cityName: string;
  };
  iataCode: string;
}

export interface TravellerCount {
  adults: number;
  childrens: number;
  infants: number;
}

export interface TravellerType {
  nationality: string;
  passengerType: string;
}

export interface AirportDetails {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  timeZoneOffset: string;
  iataCode: string;
  city: string;
  state: string;
  country: string;
}
