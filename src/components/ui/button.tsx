import React from "react";
import Link from "next/link";

import buttonClass from "./button.module.css";
import { useRouter } from "next/router";

const sizes = ["btn--medium", "btn--large"];

const style = [
  "btn--primary--solid",
  "btn--warning--solid",
  "btn--danger--solid",
  "btn--success--solid",
  "btn--primary--outline",
  "btn--warning--outline",
  "btn--danger--outline",
  "btn--success--outline",
];

interface ButtonProps {
  link: string;
  className?: string;
  buttonStyle?: (typeof style)[number];
  buttonSize?: (typeof sizes)[number];
  children: string;
}

const Button: React.FC<ButtonProps> = ({
  buttonStyle = "",
  buttonSize = "",
  link,
  children,
}) => {
  const router = useRouter();
  const checkbuttonstyle = style.includes(buttonStyle) ? buttonStyle : style[0];

  const checkbuttonsize = sizes.includes(buttonSize) ? buttonSize : sizes[0];

  const handleButtonClick = () => {
    router.push(link);
  };
  return (
    <button
      className={`${buttonClass.btn} ${checkbuttonstyle} ${checkbuttonsize}`}
      onClick={handleButtonClick}
    >
      {children}
    </button>
  );
};

export default Button;
