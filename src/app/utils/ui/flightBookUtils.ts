/* eslint-disable */
// @ts-nocheck

import { UploadFile } from "antd";
import Tesseract from "tesseract.js";

import { IMAGE_CROPPER_TYPES } from "@/app/constants/ui/app-config";
import {
  convertRecognizedDateIntoStandardDateFormat,
  convertRecognizedDateOfBirth,
} from "@/app/utils/ui";

export const handleOCR = async (
  index: number,
  file: any,
  setTravellerData: any,
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadFile[]>>,
) => {
  if (file) {
    const objectFile = URL.createObjectURL(file);
    const imageResult = await Tesseract.recognize(objectFile, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text" && m.progress === 1) {
          setTravellerData((prevData: any) => {
            const newData = [...prevData];
            newData[index] = {
              ...newData[index],
              index,
              parsedPassportDataLoading: false,
            };
            return newData;
          });
        } else {
          setTravellerData((prevData: any) => {
            const newData = [...prevData];
            newData[index] = {
              ...newData[index],
              index,
              parsedPassportDataLoading: true,
            };
            return newData;
          });
        }
      },
    });
    const imageData = imageResult.data.lines.map((item: any) => {
      return item.words[0].text;
    });
    const filteredImageData = imageData.filter((item: any) => {
      return item.length >= 30;
    });
    const { parse } = require("mrz");
    const mrz = [filteredImageData[0], filteredImageData[1]];

    try {
      const convertedResult = parse(mrz);
      if (convertedResult) {
        setTravellerData((prevData: any) => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            index,
            firstName: convertedResult.fields.firstName,
            lastName: convertedResult.fields.lastName,
            identificationNumber: convertedResult.fields.documentNumber,
            dob: convertRecognizedDateOfBirth(convertedResult.fields.birthDate),
            identificationExpiryDate:
              convertRecognizedDateIntoStandardDateFormat(
                convertedResult.fields.expirationDate,
              ),
            gender: convertedResult.fields.sex.toUpperCase(),
            parsedPassportDataSuccess: true,
            parsedPassportDataLoading: false,
          };
          return newData;
        });
      } else {
        setTravellerData((prevData: any) => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            index,
            parsedPassportDataFailed: true,
            parsedPassportDataLoading: false,
            parsedPassportDataSuccess: false,
          };
          return newData;
        });
      }
    } catch {
      setTravellerData((prevData: any) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          index,
          parsedPassportDataFailed: true,
          parsedPassportDataLoading: false,
        };
        return newData;
      });
    }

    setUploadedFile([]);
  }
};

export const handleModalForImageCrop = (
  type: string,
  index: number,
  setTravellerData: any,
) => {
  setTravellerData((prevData: any) => {
    const newData = [...prevData];
    newData[index] = {
      ...newData[index],
      index,
      openImageCropper: type === IMAGE_CROPPER_TYPES?.OPEN,
    };
    return newData;
  });
};
