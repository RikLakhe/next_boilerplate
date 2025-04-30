/* eslint-disable */
// @ts-nocheck

import { Modal, notification } from "antd";
import Image from "next/image";
import React, { RefObject, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

import { AirplaneIcon, LuggageIcon, NoFlightFound } from "@/app/assets/images";
import { AllFlightDetailProps, SegmentInfo, TravelData } from "@/app/interfaces";
import {
  clearLocalStorage,
  convertTimeToStandardTime,
  decodeBase64DataIntoJsonParsedData,
  encodeStringifyDataIntoBase64Data,
  getLocalStorage,
  getNamePascalCase,
  isEmpty,
  isUserAuthenticated,
  setLocalStorage,
  showCustomToastError,
  signoutBySessionId,
} from "@/app/utils/ui";
import {
  changeCabinClassName,
  checkAirlineImages,
  checkBaggageInfo,
  checkIfFlightHasMoreSegments,
  checkNumberOfStops,
  convertFlightTime,
  convertPriceIntoStandardPriceFormat,
} from "./flightUtils";
import LoginModal from "./LoginModal";
import FlightDetails from "./flightDetails";
import VerifyUserEmail from "./verifyUserEmail";
import { fetchFareRule, ReduxState, userInfoFetch } from "@/app/redux";
import {
  AIRLINE_STATUS,
  appConfig,
  countryConfig,
  ERROR_CODE,
  FLIGHT_INFO_TYPE,
  PNR_SESSION_TIME,
  PNR_SESSION_TIME_LIMIT,
  refundStatusConfig,
} from "@/app/constants/ui/app-config";
import CustomLabel from "../../../CustomLabel";
import FlightType from "@/app/ui/components/Common/FlightDetailHeader/FlightType";
import DefaultAirlineImageView from "./defaultAirlineImageView";
import ImageWrapper from "./imageWrapper";
import { FlightListTwoWay } from "@/app/ui/components/Common/SearchedFlights/_helpers/flightListTwoWay";
import { FlightListOneWay } from "@/app/ui/components/Common/SearchedFlights/_helpers/FlightListOneWay";
import FlightListsForWebView from "@/app/ui/components/Common/SearchedFlights/_helpers/flightListForWebView";
import FlightListsForMobileView from "@/app/ui/components/Common/SearchedFlights/_helpers/flightListForMobileView";
import FlightDetailsForMobileView from "@/app/ui/components/Common/SearchedFlights/_helpers/flightDetailsForMobileView";

type NotificationType = "success" | "info" | "warning" | "error";

const FlightLists: React.FC<AllFlightDetailProps> = (props) => {
  const {
    flightDetailLists,
    handleFlightPriceSort,
    flightPriceSort,
    searchFlightAirlineList,
    searchFlightAirportInfoList,
    noFlightFound,
    airlineImageLists,
    flightAds,
    isFlightPriceSortEmpty,
    setOpenFlightFilterDrawer,
    setOpenSearchFlightForSmallScreenSize,
  } = props;

  const router = useRouter();
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const [openFlightDetail, setOpenFlightDetail] = useState<number | null>(null);
  const [openMultipleFlightDetail, setOpenMultipleFlightDetail] = useState<
    number | null
  >(null);

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [singleFlightDetailForStorage, setSingleFlightDetailForStorage] =
    useState("");
  const [openEmailVerifyModal, setOpenEmailVerifyModal] =
    useState<boolean>(false);
  const [openFareChangeModal, setOpenFareChangeModal] =
    useState<boolean>(false);
  const [fareChangeData, setFareChangeData] = useState(0);
  const [oldFareData, setOldFareData] = useState(0);
  const [flightRefs, setFlightRefs] = useState<RefObject<HTMLDivElement>[]>([]);
  const [newFareData, setNewFareData] = useState(null);

  const toggleFareChangeModal = () => {
    setOpenFareChangeModal(false);
    let formData = { id: "" };
    formData.id = newFareData?.sessionId;
    signoutBySessionId(formData);
    clearLocalStorage(appConfig?.PNR_SESSION_ID);
    setNewFareData(null);
    clearLocalStorage(PNR_SESSION_TIME);
  };

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Warning",
      description:
        "Please reach out to the support team to proceed with the booking.",
    });
  };

  const handleFlightBookEvenAfterPriceChange = () => {
    const flightDetails = getLocalStorage(appConfig?.FLIGHT_DETAILS);
    const parsedBase64DecodedFlightDetailData =
      decodeBase64DataIntoJsonParsedData(flightDetails);
    const updatedFlightDetails = { ...parsedBase64DecodedFlightDetailData };
    updatedFlightDetails.fareInfo = newFareData?.recommendation?.fareInfo;
    const stringfyUpdatedFlightDetails = JSON.stringify(updatedFlightDetails);

    const base64EncodedData = encodeStringifyDataIntoBase64Data(
      stringfyUpdatedFlightDetails,
    );

    setLocalStorage(appConfig.FLIGHT_DETAILS, base64EncodedData);
    setNewFareData(null);
    setLocalStorage(PNR_SESSION_TIME, JSON.stringify(PNR_SESSION_TIME_LIMIT));
    router.push({
      pathname: "/flightbook",
      query: router.query,
    });
  };

  const checkAirportLocationName = (airportCode: string) => {
    if (
      searchFlightAirportInfoList &&
      airportCode in searchFlightAirportInfoList
    ) {
      return getNamePascalCase(
        searchFlightAirportInfoList?.[airportCode]?.city,
      );
    } else {
      return airportCode;
    }
  };

  const checkIfAirlineIsOpenForBooking = (flightDetail: TravelData) => {
    let allAirlineIataCodes = [];
    allAirlineIataCodes = flightDetail?.segmentInfos?.flatMap((segmentDetail) =>
      segmentDetail?.flightInfos?.map(
        (flightInfoDetail) => flightInfoDetail?.airline,
      ),
    );
    return allAirlineIataCodes?.some(
      (code) =>
        searchFlightAirlineList[code] &&
        searchFlightAirlineList?.[code]?.status === AIRLINE_STATUS?.BOOKING,
    );
  };

  const redirectToFlightDetail = () => {
    const flightDataToString = JSON.stringify(singleFlightDetailForStorage);
    const base64EncodedData =
      encodeStringifyDataIntoBase64Data(flightDataToString);

    setLocalStorage(appConfig.FLIGHT_DETAILS, base64EncodedData);
    const flightDetail = getLocalStorage(appConfig?.FLIGHT_DETAILS);
    const parsedFlightDetailData =
      decodeBase64DataIntoJsonParsedData(flightDetail);

    if (checkIfAirlineIsOpenForBooking(parsedFlightDetailData)) {
      openNotificationWithIcon("warning");
    } else {
      dispatch(fetchFareRule(parsedFlightDetailData)).then((res) => {
        if (res?.status === 200) {
          setLocalStorage(
            appConfig?.PNR_SESSION_ID,
            res?.data?.data?.sessionId,
          );
          router.push({
            pathname: "/flightbook",
            query: router.query,
          });
        } else if (
          res?.response?.status === 400 &&
          res?.response?.data?.code === ERROR_CODE.FARE_CHANGED
        ) {
          setLocalStorage(
            appConfig?.PNR_SESSION_ID,
            res?.response?.data?.data?.sessionId,
          );

          setOpenFareChangeModal(true);
          setFareChangeData(
            res?.response?.data?.data?.recommendation?.fareInfo?.totalFinalFare,
          );
          setNewFareData(res?.response?.data?.data);
        } else {
          showCustomToastError("Server Error. Please try again");
        }
      });
    }
  };

  const handleBookFlight = () => {
    if (isUserAuthenticated()) {
      const userId = getLocalStorage(appConfig?.USER_UNIQUE_ID);
      if (!isEmpty(userId)) {
        dispatch(userInfoFetch(userId)).then((res) => {
          if (res?.status === 200) {
            const isEmailVerified = res?.data?.data?.emailVerified;
            if (isEmailVerified) {
              redirectToFlightDetail();
            } else {
              setOpenEmailVerifyModal(true);
            }
          }
        });
      } else {
        setOpenLoginModal(true);
      }
    } else {
      setOpenLoginModal(true);
    }
  };

  const toggleVerifyModal = () => {
    setOpenEmailVerifyModal((prevState) => !prevState);
  };

  const toggleLoginModal = () => {
    setOpenLoginModal((prevState) => !prevState);
  };

  const checkAirlineImageLink = (
    airlineImageLists: [],
    airlineCode: string | any,
  ) => {
    if (checkAirlineImages(airlineImageLists, airlineCode)) {
      return (
        <ImageWrapper
          imageUrl={checkAirlineImages(airlineImageLists, airlineCode)}
          airlineCode={airlineCode}
        />
      );
    } else {
      return <DefaultAirlineImageView airlineCode={airlineCode} />;
    }
  };

  const FlightDetailView = (props: any) => {
    const { flightDetails } = props;
    setSingleFlightDetailForStorage(flightDetails);
    setOldFareData(flightDetails?.fareInfo?.totalFinalFare);

    return (
      <FlightDetails
        flightDetails={flightDetails}
        searchFlightAirportInfoList={searchFlightAirportInfoList}
        searchFlightAirlineList={searchFlightAirlineList}
        handleBookFlight={handleBookFlight}
        from="flightlist"
      />
    );
  };

  const handleFlightDetailView = (flightIndex: number) => {
    if (flightIndex === openFlightDetail) {
      setOpenFlightDetail(null);
    } else {
      setOpenFlightDetail(flightIndex);
      const selectedDiv = flightRefs[flightIndex].current;
      if (selectedDiv) {
        selectedDiv.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const handleRoundTripFlightDetailView = (flightIndex: number) => {
    if (flightIndex === openMultipleFlightDetail) {
      setOpenMultipleFlightDetail(null);
    } else {
      setOpenMultipleFlightDetail(flightIndex);
      const selectedDiv = flightRefs[flightIndex].current;
      if (selectedDiv) {
        selectedDiv.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  useEffect(() => {
    if (flightDetailLists) {
      setFlightRefs(flightDetailLists.map(() => React.createRef()));
    }
  }, [flightDetailLists]);

  return (
    <>
      <FlightListsForWebView
        flightDetailLists={flightDetailLists}
        handleFlightPriceSort={handleFlightPriceSort}
        flightPriceSort={flightPriceSort}
        searchFlightAirlineList={searchFlightAirlineList}
        searchFlightAirportInfoList={searchFlightAirportInfoList}
        noFlightFound={noFlightFound}
        airlineImageLists={airlineImageLists}
        flightAds={flightAds}
        isFlightPriceSortEmpty={isFlightPriceSortEmpty}
        openFlightDetail={openFlightDetail}
        setOpenFlightDetail={setOpenFlightDetail}
        openMultipleFlightDetail={openMultipleFlightDetail}
        setOpenMultipleFlightDetail={setOpenMultipleFlightDetail}
        singleFlightDetailForStorage={singleFlightDetailForStorage}
        setSingleFlightDetailForStorage={setSingleFlightDetailForStorage}
        fareChangeData={fareChangeData}
        setFareChangeData={setFareChangeData}
        handleFlightBookEvenAfterPriceChange={
          handleFlightBookEvenAfterPriceChange
        }
        checkAirportLocationName={checkAirportLocationName}
        checkIfAirlineIsOpenForBooking={checkIfAirlineIsOpenForBooking}
        redirectToFlightDetail={redirectToFlightDetail}
        handleBookFlight={handleBookFlight}
        checkAirlineImageLink={checkAirlineImageLink}
        FlightDetailView={FlightDetailView}
        handleFlightDetailView={handleFlightDetailView}
        handleRoundTripFlightDetailView={handleRoundTripFlightDetailView}
        oldFareData={oldFareData}
        setOldFareData={setOldFareData}
        newFareData={newFareData}
        setNewFareData={setNewFareData}
        flightRefs={flightRefs}
        setFlightRefs={setFlightRefs}
      />
      <FlightListsForMobileView
        flightDetailLists={flightDetailLists}
        handleFlightPriceSort={handleFlightPriceSort}
        flightPriceSort={flightPriceSort}
        searchFlightAirlineList={searchFlightAirlineList}
        searchFlightAirportInfoList={searchFlightAirportInfoList}
        noFlightFound={noFlightFound}
        airlineImageLists={airlineImageLists}
        setOpenFlightFilterDrawer={setOpenFlightFilterDrawer}
        setOpenSearchFlightForSmallScreenSize={
          setOpenSearchFlightForSmallScreenSize
        }
        openFlightDetail={openFlightDetail}
        setOpenFlightDetail={setOpenFlightDetail}
        isFlightPriceSortEmpty={isFlightPriceSortEmpty}
        singleFlightDetailForStorage={singleFlightDetailForStorage}
        setSingleFlightDetailForStorage={setSingleFlightDetailForStorage}
        fareChangeData={fareChangeData}
        setFareChangeData={setFareChangeData}
        handleFlightBookEvenAfterPriceChange={
          handleFlightBookEvenAfterPriceChange
        }
        checkAirportLocationName={checkAirportLocationName}
        checkIfAirlineIsOpenForBooking={checkIfAirlineIsOpenForBooking}
        redirectToFlightDetail={redirectToFlightDetail}
        handleBookFlight={handleBookFlight}
        checkAirlineImageLink={checkAirlineImageLink}
        FlightDetailView={FlightDetailView}
        handleRoundTripFlightDetailView={handleRoundTripFlightDetailView}
        oldFareData={oldFareData}
        setOldFareData={setOldFareData}
        newFareData={newFareData}
        setNewFareData={setNewFareData}
      />
      {openLoginModal && (
        <Modal
          title="Login"
          open={openLoginModal}
          onCancel={toggleLoginModal}
          footer={null}
        >
          <LoginModal
            toggleLoginModal={toggleLoginModal}
            singleFlightDetailForStorage={singleFlightDetailForStorage}
          />
        </Modal>
      )}
      {openEmailVerifyModal && (
        <Modal
          title="Email not verified"
          open={openEmailVerifyModal}
          onCancel={toggleVerifyModal}
          footer={null}
        >
          <VerifyUserEmail
            redirectToFlightDetail={redirectToFlightDetail}
            toggleVerifyModal={toggleVerifyModal}
          />
        </Modal>
      )}
      {openFareChangeModal && (
        <Modal
          title="Fare has been changed"
          className="fare-change-modal"
          open={openFareChangeModal}
          onCancel={toggleFareChangeModal}
          onOk={handleFlightBookEvenAfterPriceChange}
          okText="Proceed"
          confirmLoading={false}
        >
          <p>Do you want to proceed with new fare?</p>
          <div className="modal-body">
            <div className="old-fare">
              <CustomLabel label={"Old Fare"} required={false} />
              <div className="fare-section">
                <p className="fare_type">NPR</p>
                <p className="fare_total">
                  {convertPriceIntoStandardPriceFormat(oldFareData)}
                </p>
              </div>
            </div>
            <div className="airplane-img">
              <Image src={AirplaneIcon} alt="icon" />
            </div>
            <div className="new-fare">
              <CustomLabel label={"New Fare"} required={false} />
              <div className="fare-section">
                <p className="fare_type">NPR</p>
                <p className="fare_total">
                  {convertPriceIntoStandardPriceFormat(fareChangeData)}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default FlightLists;
