import React from "react";

import { DefaultAirlineImageProps } from "@/app/interfaces/ticketInfos";

const DefaultAirlineImageView = (props: DefaultAirlineImageProps) => {
  const { airlineCode } = props;
  return <div className="default-airline-image">{airlineCode}</div>;
};

export default DefaultAirlineImageView;
