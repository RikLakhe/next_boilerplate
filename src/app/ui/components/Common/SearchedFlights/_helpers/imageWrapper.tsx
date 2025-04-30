/* eslint-disable */
// @ts-nocheck

import React, { useState } from "react";

import { ImageWrapperProps } from "@/app/interfaces/ticketInfos";

const ImageWrapper = (props: ImageWrapperProps) => {
  const { imageUrl, airlineCode } = props;
  const [isImageCorrupted, setIsImageCorrupted] = useState(false);

  return (
    <div>
      {!isImageCorrupted && (
        <img
          className="common-airline-image"
          src={imageUrl}
          onError={() => {
            setIsImageCorrupted(true);
          }}
        />
      )}
      {isImageCorrupted && (
        <div className="default-airline-image">{airlineCode}</div>
      )}
    </div>
  );
};

export default ImageWrapper;
