/* eslint-disable */
// @ts-nocheck

import React from "react";

interface LabelProps {
  required: boolean;
  label: String | any;
}

const CustomLabel: React.FC<LabelProps> = ({ label, required }) => {
  return (
    <div className="custom-label">
      <p>{label}</p>
    </div>
  );
};

export default CustomLabel;
