/* eslint-disable */
// @ts-nocheck

import { NotificationType } from "@/app/ui/components/Common/Notification";

export const ERROR_CODE = {
  CUSTOMER_NOT_FOUND: "AFNCSNF001",
  FARE_CHANGED: "AFNPSFA001",
};

export const tripConfig = {
  TWO_WAY: "two-way",
  ONE_WAY: "one-way",
  MULTI_CITY: "multi-city",
};

export const flightFilterConfig = {
  CHECKBOX: "checkbox",
  TIMESLOTS: "time-slots",
};
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_BAGGAGE_WEIGHT = 23;

export const AIRLINE_STATUS = {
  BOOKING: "BOOKING",
  OPEN: "OPEN",
  CLOSED: "CLOSED",
};

export const appConfig = {
  API_URL: process.env.NEXT_PUBLIC_ENV_LOCAL_VARIABLE,
  CLIENT_USER_DATA: "afnuu-client-data",
  CLIENT_FULL_NAME: "afnuu-client-fullName",
  USER_ID: "afnuu-client-id",
  USER_UNIQUE_ID: "afnuu-client-unique-id",
  CLIENT_MOBILE_NUMBER: "afnuu-client-mobile-number",
  CLIENT_SIGNUP_EMAIL: "afnuu-signup-email",
  CLIENT_SIGNUP_MOBILE_NUMBER: "afnuu-signup-mobile-number",
  CLIENT_SIGNUP_MOBILE_CODE: "afnuu-signup-mobile-code",
  CLIENT_JWT_TOKEN: "afnuu-client-jwt-token",
  CLIENT_COUNTRY_CODE: "afnuu-client-country-code",
  CLIENT_EMAIL_VERIFIED: "afnuu-client-email-verified",
  CLIENT_MOBILE_NUMBER_VERIFIED: "afnuu-client-mobile-number-verified",
  FLIGHT_DETAILS: "afnuu-client-flight-details",
  CLIENT_NATIONALITY: "afnuu-client-nationality",
  FLIGHT_SEARCH_INFO: "afnuu-flight-search-info",
  MULTI_CITY_FLIGHT_SEARCH_INFO: "afnuu-multicity-flight-search-info",
  COMPANY_NAME: "afnuu-company-name",
  PNR_SESSION_ID: "afnuu-pnr-session-id",
  PNR_SUCCESS_ID: "afnuu-pnr-success-id",
  CLIENT_TYPE: "afnuu-client-type",
  FLIGHT_DETAILS_FROM_DASHBOARD: "afnuu-client-flight-detail-from-dashboard",
  PNR_ID_FROM_DASHBOARD: "afnuu-pnr-id-from-dashboard",
  CLIENT_LOGOUT_EVENT: "afnuu-client-logout-event",
  IS_CLIENT_FULL_NAME_CHANGED: "afnuu-client-fullname-changed",
};

export const extraConfig = {
  ACCOUNT: "account",
  DEPARTING_DATE: "departing_date",
  RETURNING_DATE: "returning_date",
};

export const baggageTypeConfig = {
  PIECE: "N",
  WEIGHT: "W",
};

export const weightConfig = {
  KG: "K",
  POUND: "L",
};

export const cabinClassConfig = {
  ECONOMIC_PREMIUM: "ECONOMIC_PREMIUM",
  ECONOMIC: "ECONOMIC",
  ECONOMIC_STANDARD: "ECONOMIC_STANDARD",
  FIRST: "FIRST",
  BUSINESS: "BUSINESS",
};

export const passengerTypes = {
  ADULT: "ADT",
  CHILD: "CH",
  INFANT: "INF",
};

export const documentTypes = {
  PASSPORT: "PASSPORT",
  CITIZENSHIP: "CITIZENSHIP",
  MINORID: "MINORID",
  BIRTHCERTIFICATE: "BIRTHCERTIFICATE",
  VOTERID: "VOTERID",
};

export const nationalityConfig = {
  NEPALESE: "Nepalese",
  INDIAN: "Indian",
};

export const countryConfig = {
  NEPAL: "NP",
  INDIA: "IN",
};

export const totalTravellerCountLimit = 9;

export const refundStatusConfig = {
  PARTIAL_REFUNDABLE: "PARTIAL_REFUNDABLE",
  NON_REFUNDABLE: "NON_REFUNDABLE",
  REFUNDABLE: "REFUNDABLE",
};

export const paymnetPartnersConfig = {
  AFNUU: "AFNUU_BALANCE",
  CONNECTIPS: "CONNECT_IPS",
  KHALTI: "KHALTI",
  FONEPAY: "FONE_PAY",
};

export const flightBookingConfig = {
  BOOK: "BOOKED",
  CONFIRM: "CONFIRMED",
  CANCEL: "CANCELLED",
  TICKETED: "TICKETED",
  EXPIRED: "EXPIRED",
};

export const clientTypes = {
  INDIVIDUAL: "INDIVIDUAL",
  AGENT: "AGENT",
  SUPPORT: "SUPPORT",
};

export const userStatusConfig = {
  INVITED: "INVITED",
  CANCELLED: "CANCELLED",
  ACCEPTED: "ACCEPTED",
};

export const bookingTabConfigs = {
  BOOKING: "BOOKING",
  TICKETING: "TICKETING",
  ALL: "ALL",
};

export const dashboardTabConfigs = {
  DASHBOARD: "DASHBOARD",
  BOOKINGANDTICKETING: "BOOKINGANDTICKETING",
  TRANSACTION: "TRANSACTION",
  USERS: "USERS",
};

export const transactionTabConfigs = {
  ALL: "ALL",
  AFNUU: "AFNUU",
};

export const FLIGHT_BOARD_TYPE = {
  INBOUND: "INBOUND",
  OUTBOUND: "OUTBOUND",
};

export const noticeList = [
  {
    list: "Business, Visit, or Tourist Visa holders are required to purchase a single return ticket on the same airline.",
  },
  {
    list: "Traveling to Schengen countries via the UK requires a UK Transit visa, while traveling to the UK via Schengen/Europe requires a Schengen visa.",
  },
  {
    list: "Passengers are not allowed to transit through Abu Dhabi (AUH) for more than 24 hours. If their transit time exceeds 12 hours, they must have a confirmed airside hotel booking.",
  },
  {
    list: "Passengers holding a Canadian visa or PR card cannot transit through the USA without a valid USA visa.",
  },
  {
    list: "Passengers holding a New Zealand visa or PR card cannot transit through the Australia without a valid Australia visa.",
  },
];

export const genderConfigTypes = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};

export const amenitiesConfig = {
  MOVIE: "MOVIE",
  INTERNET: "INTERNET_ACCESS",
  WIFI: "WIFI",
  POWER_SOURCE: "IN_SEAT_POWER_SOURCE",
  DUTY_FREE: "DUTY_FREE_SALES",
};

export const userTabConfigs = {
  USERS_TAB: "USERS_TAB",
  INVITED_USERS_TAB: "INVITED_USERS_TAB",
};

export const BALANCE_TRANSFER_TYPES = {
  DEBIT: "DEBIT",
  CREDIT: "CREDIT",
};

export const DATE_FORMAT_TYPES = {
  MONTH_DAY_YEAR: "MM-DD-YYYY",
  YEAR_MONTH_DAY: "YYYY-MM-DD",
};

export const FLIGHT_STOP_TYPES = {
  NON_STOP: "NON-STOP",
  ONE_STOP: "ONE-STOP",
  TWO_PLUS_STOP: "TWO-PLUS-STOP",
};

export const FLIGHT_TICKET_TYPE_PROPS = {
  FROM_DASHBOARD: "dashboard",
  FROM_BOOKING: "booking",
  FROM_TICKET: "ticket",
  FROM_EMAIL: "email",
};

export const CUSTOM_NOTIFICATION_TYPES: Record<string, NotificationType> = {
  ERROR: "error",
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
};

export const PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

export const nationalityList = [
  {
    title: "Nepalese",
    code: "NP",
    country: "Nepal",
  },
  {
    title: "Indian",
    code: "IN",
    country: "India",
  },
  {
    title: "Afghan",
    code: "AF",
    country: "Afghanistan",
  },
  {
    title: "Albanian",
    code: "AL",
    country: "Albania",
  },
  {
    title: "Algerian",
    code: "DZ",
    country: "Algeria",
  },
  {
    title: "American",
    code: "US",
    country: "United States",
  },
  {
    title: "Andorran",
    code: "AD",
    country: "Andorra",
  },
  {
    title: "Angolan",
    code: "AO",
    country: "Angola",
  },
  {
    title: "Antiguan or Barbudan",
    code: "AG",
    country: "Antigua and Barbuda",
  },
  {
    title: "Argentine",
    code: "AR",
    country: "Argentina",
  },
  {
    title: "Armenian",
    code: "AM",
    country: "Armenia",
  },
  {
    title: "Australian",
    code: "AU",
    country: "Australia",
  },
  {
    title: "Austrian",
    code: "AT",
    country: "Austria",
  },
  {
    title: "Azerbaijani",
    code: "AZ",
    country: "Azerbaijan",
  },
  {
    title: "Bahamian",
    code: "BS",
    country: "The Bahamas",
  },
  {
    title: "Bahraini",
    code: "BH",
    country: "Bahrain",
  },
  {
    title: "Bangladeshi",
    code: "BD",
    country: "Bangladesh",
  },
  {
    title: "Barbadian",
    code: "BB",
    country: "Barbados",
  },
  {
    title: "Belarusian",
    code: "BY",
    country: "Belarus",
  },
  {
    title: "Belgian",
    code: "BE",
    country: "Belgium",
  },
  {
    title: "Belizean",
    code: "BZ",
    country: "Belize",
  },
  {
    title: "Beninese",
    code: "BJ",
    country: "Benin",
  },
  {
    title: "Bhutanese",
    code: "BT",
    country: "Bhutan",
  },
  {
    title: "Bolivian",
    code: "BO",
    country: "Bolivia",
  },
  {
    title: "Bosnian or Herzegovinian",
    code: "BA",
    country: "Bosnia and Herzegovina",
  },
  {
    title: "Botswanan",
    code: "BW",
    country: "Botswana",
  },
  {
    title: "Brazilian",
    code: "BR",
    country: "Brazil",
  },
  {
    title: "British",
    code: "GB",
    country: "United Kingdom",
  },
  {
    title: "Bruneian",
    code: "BN",
    country: "Brunei",
  },
  {
    title: "Bulgarian",
    code: "BG",
    country: "Bulgaria",
  },
  {
    title: "Burkinabe",
    code: "BF",
    country: "Burkina Faso",
  },
  {
    title: "Burundian",
    code: "BI",
    country: "Burundi",
  },
  {
    title: "Cabo Verdean",
    code: "CV",
    country: "Cabo Verde",
  },
  {
    title: "Cambodian",
    code: "KH",
    country: "Cambodia",
  },
  {
    title: "Cameroonian",
    code: "CM",
    country: "Cameroon",
  },
  {
    title: "Canadian",
    code: "CA",
    country: "Canada",
  },
  {
    title: "Central African",
    code: "CF",
    country: "Central African Republic",
  },
  {
    title: "Chadian",
    code: "TD",
    country: "Chad",
  },
  {
    title: "Chilean",
    code: "CL",
    country: "Chile",
  },
  {
    title: "Chinese",
    code: "CN",
    country: "China",
  },
  {
    title: "Colombian",
    code: "CO",
    country: "Colombia",
  },
  {
    title: "Comoran",
    code: "KM",
    country: "Comoros",
  },
  {
    title: "Congolese (Congo)",
    code: "CG",
    country: "Congo (Congo-Brazzaville)",
  },
  {
    title: "Congolese (DRC)",
    code: "CD",
    country: "Congo (Congo-Kinshasa)",
  },
  {
    title: "Costa Rican",
    code: "CR",
    country: "Costa Rica",
  },
  {
    title: "Croatian",
    code: "HR",
    country: "Croatia",
  },
  {
    title: "Cuban",
    code: "CU",
    country: "Cuba",
  },
  {
    title: "Cypriot",
    code: "CY",
    country: "Cyprus",
  },
  {
    title: "Czech",
    code: "CZ",
    country: "Czechia (Czech Republic)",
  },
  {
    title: "Danish",
    code: "DK",
    country: "Denmark",
  },
  {
    title: "Djiboutian",
    code: "DJ",
    country: "Djibouti",
  },
  {
    title: "Dominican",
    code: "DO",
    country: "Dominican Republic",
  },
  {
    title: "Ecuadorian",
    code: "EC",
    country: "Ecuador",
  },
  {
    title: "Egyptian",
    code: "EG",
    country: "Egypt",
  },
  {
    title: "Salvadoran",
    code: "SV",
    country: "El Salvador",
  },
  {
    title: "Equatorial Guinean",
    code: "GQ",
    country: "Equatorial Guinea",
  },
  {
    title: "Eritrean",
    code: "ER",
    country: "Eritrea",
  },
  {
    title: "Estonian",
    code: "EE",
    country: "Estonia",
  },
  {
    title: "Eswatini",
    code: "SZ",
    country: "Eswatini",
  },
  {
    title: "Ethiopian",
    code: "ET",
    country: "Ethiopia",
  },
  {
    title: "Fijian",
    code: "FJ",
    country: "Fiji",
  },
  {
    title: "Finnish",
    code: "FI",
    country: "Finland",
  },
  {
    title: "French",
    code: "FR",
    country: "France",
  },
  {
    title: "Gabonese",
    code: "GA",
    country: "Gabon",
  },
  {
    title: "Gambian",
    code: "GM",
    country: "The Gambia",
  },
  {
    title: "Georgian",
    code: "GE",
    country: "Georgia",
  },
  {
    title: "German",
    code: "DE",
    country: "Germany",
  },
  {
    title: "Ghanaian",
    code: "GH",
    country: "Ghana",
  },
  {
    title: "Greek",
    code: "GR",
    country: "Greece",
  },
  {
    title: "Grenadian",
    code: "GD",
    country: "Grenada",
  },
  {
    title: "Guatemalan",
    code: "GT",
    country: "Guatemala",
  },
  {
    title: "Guinean",
    code: "GN",
    country: "Guinea",
  },
  {
    title: "Guinea-Bissauan",
    code: "GW",
    country: "Guinea-Bissau",
  },
  {
    title: "Guyanese",
    code: "GY",
    country: "Guyana",
  },
  {
    title: "Haitian",
    code: "HT",
    country: "Haiti",
  },
  {
    title: "Honduran",
    code: "HN",
    country: "Honduras",
  },
  {
    title: "Hungarian",
    code: "HU",
    country: "Hungary",
  },
  {
    title: "Icelandic",
    code: "IS",
    country: "Iceland",
  },

  {
    title: "Indonesian",
    code: "ID",
    country: "Indonesia",
  },
  {
    title: "Iranian",
    code: "IR",
    country: "Iran",
  },
  {
    title: "Iraqi",
    code: "IQ",
    country: "Iraq",
  },
  {
    title: "Irish",
    code: "IE",
    country: "Ireland",
  },
  {
    title: "Israeli",
    code: "IL",
    country: "Israel",
  },
  {
    title: "Italian",
    code: "IT",
    country: "Italy",
  },
  {
    title: "Ivorian",
    code: "CI",
    country: "Ivory Coast",
  },
  {
    title: "Jamaican",
    code: "JM",
    country: "Jamaica",
  },
  {
    title: "Japanese",
    code: "JP",
    country: "Japan",
  },
  {
    title: "Jordanian",
    code: "JO",
    country: "Jordan",
  },
  {
    title: "Kazakhstani",
    code: "KZ",
    country: "Kazakhstan",
  },
  {
    title: "Kenyan",
    code: "KE",
    country: "Kenya",
  },
  {
    title: "Kiribati",
    code: "KI",
    country: "Kiribati",
  },
  {
    title: "Kuwaiti",
    code: "KW",
    country: "Kuwait",
  },
  {
    title: "Kyrgyz",
    code: "KG",
    country: "Kyrgyzstan",
  },
  {
    title: "Laotian",
    code: "LA",
    country: "Laos",
  },
  {
    title: "Latvian",
    code: "LV",
    country: "Latvia",
  },
  {
    title: "Lebanese",
    code: "LB",
    country: "Lebanon",
  },
  {
    title: "Basotho",
    code: "LS",
    country: "Lesotho",
  },
  {
    title: "Liberian",
    code: "LR",
    country: "Liberia",
  },
  {
    title: "Libyan",
    code: "LY",
    country: "Libya",
  },
  {
    title: "Liechtensteiner",
    code: "LI",
    country: "Liechtenstein",
  },
  {
    title: "Lithuanian",
    code: "LT",
    country: "Lithuania",
  },
  {
    title: "Luxembourgish",
    code: "LU",
    country: "Luxembourg",
  },
  {
    title: "Malagasy",
    code: "MG",
    country: "Madagascar",
  },
  {
    title: "Malawian",
    code: "MW",
    country: "Malawi",
  },
  {
    title: "Malaysian",
    code: "MY",
    country: "Malaysia",
  },
  {
    title: "Maldivian",
    code: "MV",
    country: "Maldives",
  },
  {
    title: "Malian",
    code: "ML",
    country: "Mali",
  },
  {
    title: "Maltese",
    code: "MT",
    country: "Malta",
  },
  {
    title: "Marshallese",
    code: "MH",
    country: "Marshall Islands",
  },
  {
    title: "Mauritanian",
    code: "MR",
    country: "Mauritania",
  },
  {
    title: "Mauritian",
    code: "MU",
    country: "Mauritius",
  },
  {
    title: "Mexican",
    code: "MX",
    country: "Mexico",
  },
  {
    title: "Micronesian",
    code: "FM",
    country: "Micronesia",
  },
  {
    title: "Moldovan",
    code: "MD",
    country: "Moldova",
  },
  {
    title: "Monacan",
    code: "MC",
    country: "Monaco",
  },
  {
    title: "Mongolian",
    code: "MN",
    country: "Mongolia",
  },
  {
    title: "Montenegrin",
    code: "ME",
    country: "Montenegro",
  },
  {
    title: "Moroccan",
    code: "MA",
    country: "Morocco",
  },
  {
    title: "Mozambican",
    code: "MZ",
    country: "Mozambique",
  },
  {
    title: "Namibian",
    code: "NA",
    country: "Namibia",
  },
  {
    title: "Nauruan",
    code: "NR",
    country: "Nauru",
  },
  {
    title: "Netherlands",
    code: "NL",
    country: "Netherlands",
  },
  {
    title: "New Zealand",
    code: "NZ",
    country: "New Zealand",
  },
  {
    title: "Nicaraguan",
    code: "NI",
    country: "Nicaragua",
  },
  {
    title: "Nigerien",
    code: "NE",
    country: "Niger",
  },
  {
    title: "Nigerian",
    code: "NG",
    country: "Nigeria",
  },
  {
    title: "North Macedonian",
    code: "MK",
    country: "North Macedonia",
  },
  {
    title: "Norwegian",
    code: "NO",
    country: "Norway",
  },
  {
    title: "Omani",
    code: "OM",
    country: "Oman",
  },
  {
    title: "Pakistani",
    code: "PK",
    country: "Pakistan",
  },
  {
    title: "Palauan",
    code: "PW",
    country: "Palau",
  },
  {
    title: "Panamanian",
    code: "PA",
    country: "Panama",
  },
  {
    title: "Papua New Guinean",
    code: "PG",
    country: "Papua New Guinea",
  },
  {
    title: "Paraguayan",
    code: "PY",
    country: "Paraguay",
  },
  {
    title: "Peruvian",
    code: "PE",
    country: "Peru",
  },
  {
    title: "Philippine",
    code: "PH",
    country: "Philippines",
  },
  {
    title: "Polish",
    code: "PL",
    country: "Poland",
  },
  {
    title: "Portuguese",
    code: "PT",
    country: "Portugal",
  },
  {
    title: "Qatari",
    code: "QA",
    country: "Qatar",
  },
  {
    title: "Romanian",
    code: "RO",
    country: "Romania",
  },
  {
    title: "Russian",
    code: "RU",
    country: "Russia",
  },
  {
    title: "Rwandan",
    code: "RW",
    country: "Rwanda",
  },
  {
    title: "Saint Kitts and Nevis",
    code: "KN",
    country: "Saint Kitts and Nevis",
  },
  {
    title: "Saint Lucian",
    code: "LC",
    country: "Saint Lucia",
  },
  {
    title: "Saint Vincent and the Grenadines",
    code: "VC",
    country: "Saint Vincent and the Grenadines",
  },
  {
    title: "Samoan",
    code: "WS",
    country: "Samoa",
  },
  {
    title: "San Marinese",
    code: "SM",
    country: "San Marino",
  },
  {
    title: "Sao Tomean",
    code: "ST",
    country: "Sao Tome and Principe",
  },
  {
    title: "Saudi Arabian",
    code: "SA",
    country: "Saudi Arabia",
  },
  {
    title: "Senegalese",
    code: "SN",
    country: "Senegal",
  },
  {
    title: "Serbian",
    code: "RS",
    country: "Serbia",
  },
  {
    title: "Seychellois",
    code: "SC",
    country: "Seychelles",
  },
  {
    title: "Sierra Leonean",
    code: "SL",
    country: "Sierra Leone",
  },
  {
    title: "Singaporean",
    code: "SG",
    country: "Singapore",
  },
  {
    title: "Slovak",
    code: "SK",
    country: "Slovakia",
  },
  {
    title: "Slovenian",
    code: "SI",
    country: "Slovenia",
  },
  {
    title: "Solomon Islander",
    code: "SB",
    country: "Solomon Islands",
  },
  {
    title: "Somali",
    code: "SO",
    country: "Somalia",
  },
  {
    title: "South African",
    code: "ZA",
    country: "South Africa",
  },
  {
    title: "South Korean",
    code: "KR",
    country: "South Korea",
  },
  {
    title: "South Sudanese",
    code: "SS",
    country: "South Sudan",
  },
  {
    title: "Spanish",
    code: "ES",
    country: "Spain",
  },
  {
    title: "Sri Lankan",
    code: "LK",
    country: "Sri Lanka",
  },
  {
    title: "Sudanese",
    code: "SD",
    country: "Sudan",
  },
  {
    title: "Surinamese",
    code: "SR",
    country: "Suriname",
  },
  {
    title: "Swedish",
    code: "SE",
    country: "Sweden",
  },
  {
    title: "Swiss",
    code: "CH",
    country: "Switzerland",
  },
  {
    title: "Syrian",
    code: "SY",
    country: "Syria",
  },
  {
    title: "Taiwanese",
    code: "TW",
    country: "Taiwan",
  },
  {
    title: "Tajik",
    code: "TJ",
    country: "Tajikistan",
  },
  {
    title: "Tanzanian",
    code: "TZ",
    country: "Tanzania",
  },
  {
    title: "Thai",
    code: "TH",
    country: "Thailand",
  },
  {
    title: "Timorese",
    code: "TL",
    country: "Timor-Leste",
  },
  {
    title: "Togolese",
    code: "TG",
    country: "Togo",
  },
  {
    title: "Tongan",
    code: "TO",
    country: "Tonga",
  },
  {
    title: "Trinidadian or Tobagonian",
    code: "TT",
    country: "Trinidad and Tobago",
  },
  {
    title: "Tunisian",
    code: "TN",
    country: "Tunisia",
  },
  {
    title: "Turkish",
    code: "TR",
    country: "Turkey",
  },
  {
    title: "Turkmen",
    code: "TM",
    country: "Turkmenistan",
  },
  {
    title: "Tuvaluan",
    code: "TV",
    country: "Tuvalu",
  },
  {
    title: "Ugandan",
    code: "UG",
    country: "Uganda",
  },
  {
    title: "Ukrainian",
    code: "UA",
    country: "Ukraine",
  },
  {
    title: "Emirati",
    code: "AE",
    country: "United Arab Emirates",
  },
  {
    title: "Uruguayan",
    code: "UY",
    country: "Uruguay",
  },
  {
    title: "Uzbek",
    code: "UZ",
    country: "Uzbekistan",
  },
  {
    title: "Vanuatuan",
    code: "VU",
    country: "Vanuatu",
  },
  {
    title: "Vatican",
    code: "VA",
    country: "Vatican City",
  },
  {
    title: "Venezuelan",
    code: "VE",
    country: "Venezuela",
  },
  {
    title: "Vietnamese",
    code: "VN",
    country: "Vietnam",
  },
  {
    title: "Yemeni",
    code: "YE",
    country: "Yemen",
  },
  {
    title: "Zambian",
    code: "ZM",
    country: "Zambia",
  },
  {
    title: "Zimbabwean",
    code: "ZW",
    country: "Zimbabwe",
  },
];

export const AiportDetailConfigs = {
  CITY_NAME: "CITY_NAME",
  COUNTRY_NAME: "COUNTRY_NAME",
  AIRPORT_NAME: "AIRPORT_NAME",
};

export const WARNING_MESSAGE =
  "Warning! You are about to leave page, data will be lost";

export const PNR_SESSION_TIME = "PNR_SESSION_TIME";
export const PNR_SESSION_TIME_LIMIT = 900000;

export const FLIGHT_INFO_TYPE = {
  ARRIVAL: "RETURN",
  DEPARTURE: "DEPARTURE",
};

export const VIEW = {
  TICKET_BOOKING: "TICKET_BOOKING",
};

export const PATH = {
  FLIGHTBOOK: "flightbook",
};

export const Filtered_Country_Code_List = ["NP", "IN"];

export const IMAGE_CROPPER_TYPES = {
  OPEN: "open",
  CLOSE: "close",
};

export const PAYMENT_MODE_TYPE = {
  CONNECT_IPS: "CONNECT_IPS",
  FONE_PAY: "FONE_PAY",
};

export const TRANSACTION_RESPONSE = {
  TOP_UP: "TOP",
};

export const UPLOAD_INPUT_TYPE = ".jpg, .jpeg, .png";

export const MEAL_DROPDOWN_OPTION = [
  // { title: "Select Meal Option", code: "" },
  { title: "Baby Meal", code: "BABY_MEAL" },
  { title: "Child Meal", code: "CHILD_MEAL" },
  { title: "Vegetarian Meal", code: "VEG_MEAL" },
  { title: "Non-Vegetarian Meal", code: "NON_VEG_MEAL" },
  { title: "Muslim Meal", code: "MUSLIM_MEAL" },
];

export const WHEELCHAIR_OPTION = [
  // { title: "Select Special Service", code: "" },
  { title: "Wheelchair - all the way to seat", code: "WHEEL_CHAIR_RAMP" },
  { title: "Wheelchair - for ramp", code: "WHEEL_CHAIR_SEAT" },
];
export const TOP_UP_AMOUNT = {
  ONE_THOUSAND: "1000",
  TWENTY_FIVE_HUNDRED: "2500",
  FIVE_THOUSAND: "5000",
  TEN_THOUSAND: "10000",
  TWENTY_FIVE_THOUSAND: "25000",
  FIFTY_THOUSAND: "50000",
};

export const ADDVERTISEMENT_ACTION_TYPE = {
  NONE: "NONE",
  SEARCH: "SEARCH",
  OPEN: "OPEN",
};

export const DEFAULT_PRIVACY_AND_POLICY_URL =
  "https://content.afnuu.com/privacy-policy/";
export const DEFAULT_TERMS_AND_CONDITION_URL =
  "https://content.afnuu.com/terms-conditions/";
export const DEFAULT_RULES_AND_REGULATIONS_URL =
  "https://content.afnuu.com/rules-and-restrictions/";
export const WHATSAPP_CONTACT_URL = "https://wa.me/+9779705030020";
export const SUPPORT_EMAIL_URL = "mailto:tickets@afnuu.com";
export const FACEBOOK_PAGE_URL = "https://www.facebook.com/afnuucom";
export const INSTAGRAM_PAGE_URL = "https://www.instagram.com/afnuucom/";
export const DOMESTIC_AIRLINES_POLICY_URL =
  "https://content.afnuu.com/domestic-airlines/";
export const AFNUU_ABOUT_US_URL = "https://content.afnuu.com/about-us/";
export const AFNUU_CAREER_URL = "https://content.afnuu.com/career/";
export const AIRLINEINFODETAILS = {
  AIRLINE_INFO_LIST: "AIRLINE_INFO_LIST",
  AIRPORT_INFO_LIST: "AIRPORT_INFO_LIST",
  AIRLINE_IMAGE_INFO: "AIRLINE_IMAGE_INFO",
};

export const APP_ENV_TYPE = {
  LOCAL: "localhost",
  DEV: "dev",
  QA: "qa",
  PROD: "prod",
};

export const DEV_APP_URL = "https://dev-afnuu.aricalot.com";
export const QA_APP_URL = "https://qa-afnuu.aricalot.com";
export const PROD_APP_URL = "https://afnuu.com";

export const OTP = {
  TIMER_IN_SECONDS: 120,
  NAME: "OPT_TIMER",
};
export const KEYBOARD_EVENTS = {
  BACKSPACE_KEY: "Backspace",
  BACKSPACE_KEY_CODE: 8,
};

export const DOMESTIC_FLIGHT_TICKET_EXPIRED =
  "Your reservation is no longer valid since your PNR has expired.";

export const FLIGHT_TYPES = {
  DOMESTIC: "DOMESTIC",
  INTERNATIONAL: "INTERNATIONAL",
};

export const TRANSACTION_TYPES = {
  PURCHASE: "PURCHASE",
  TOPUP: "TOPUP",
  TRANSFER: "TRANSFER",
};

export const ERROR_MESSAGE_TRY_AGAIN = "Please try again";
