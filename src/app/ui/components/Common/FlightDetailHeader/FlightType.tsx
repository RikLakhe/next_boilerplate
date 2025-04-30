/* eslint-disable */
// @ts-nocheck

import { FC } from "react";

import { VIEW } from "@/app/constants/ui/app-config";

interface FlightTypeProps {
  flightType: string;
  view?: string;
}

const FlightType: FC<FlightTypeProps> = (props) => {
  const { flightType, view } = props;

  const filghtListClassname = () => {
    if (view === VIEW.TICKET_BOOKING) {
      return "flight_type__ticket-booking";
    } else {
      return "flight_type";
    }
  };
  return (
    <div className={filghtListClassname()}>
      <div className="flight_type__container">
        <div className="flight_type__label">{flightType}</div>
      </div>
    </div>
  );
};
export default FlightType;
