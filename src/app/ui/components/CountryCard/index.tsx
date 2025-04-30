import { FC } from "react";
import { Button } from "antd";
import { Adds } from "@/app/interfaces/flightConfig";

export const CountryCard: FC<Adds> = ({ title, image }) => {
  return (
    <div className="country_card_wrapper">
      <div className="country_card_image">
        <img src={image} alt={title} />
      </div>
      <div className="country_card--button">
        <Button className="btn-primary-alternate">Discover</Button>
      </div>
    </div>
  );
};
