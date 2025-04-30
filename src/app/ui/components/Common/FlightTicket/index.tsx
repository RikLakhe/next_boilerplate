/* eslint-disable */
// @ts-nocheck

//use client
import jsPDF from "jspdf";
import Image from "next/image";
import { Button } from "antd";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

import {
  ArrowRightOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { AfnuuIcon } from "@/app/assets/images";
import {
  AiportDetailConfigs,
  appConfig,
  cabinClassConfig,
  FLIGHT_BOARD_TYPE,
  FLIGHT_TICKET_TYPE_PROPS,
  FLIGHT_TYPES,
  flightBookingConfig,
  nationalityList,
  noticeList,
  passengerTypes,
} from "@/app/constants/ui/app-config";
import {
  AirportInfos,
  PassengerTicketInfos,
  SegmentInfoProps,
  travellerData,
} from "@/app/interfaces";
import {
  convertDateIntoTicketDownloadFormat,
  convertTimeToStandardTime,
  getFullName,
  getLocalStorage,
  getNamePascalCase,
  getNationalityByCode,
  isEmpty,
  isUserAuthenticated,
} from "@/app/utils/ui";
import {
  checkAirlineImages,
  checkAirlineName,
  checkBaggageInfo,
  convertPriceIntoStandardPriceFormat,
} from "../SearchedFlights/_helpers/flightUtils";
import { fetchFlightTicketDetailByPNRId, ReduxState } from "@/app/redux";
import SupportPage from "../SupportPage";
import useWindowViewPort from "@/app/Hooks/useWindowViewPort";
import ImageWrapper from "../SearchedFlights/_helpers/imageWrapper";
import DefaultAirlineImageView from "../SearchedFlights/_helpers/defaultAirlineImageView";
import { CustomLoader } from "@/app/ui/components/Common/CustomLoader";
import BackButtonRedirect from "@/app/ui/components/BackButtonRedirect";

interface FlightTicketProps {
  pnrId: string;
  from: string;
  handleToRedirectPaymentPage?: (pnrId: string | undefined) => void;
  flightTicketStatus?: string;
  setFlightTicketStatus?: Dispatch<SetStateAction<string>>;
  toggleTicketDetailModal?: () => void;
}

const FlightTicket = (props: FlightTicketProps) => {
  const getUserToken = getLocalStorage(appConfig.CLIENT_JWT_TOKEN);
  const {
    pnrId,
    from,
    handleToRedirectPaymentPage,
    flightTicketStatus,
    setFlightTicketStatus = () => { },
    toggleTicketDetailModal,
  } = props;

  const router = useRouter();
  const [downloadPdf, setDownloadPdf] = useState<boolean>(false);
  const [displaySupportPage, setDisplaySupportPage] = useState<boolean>(false);

  const { windowViewport, setWindowViewport } = useWindowViewPort();

  const [downloadClick, setDownloadClick] = useState(0);
  const [validateUserloading, setValidateUserLoading] = useState(true);
  const [isTheFlightDomesticOrNot, setIsTheFlightDomesticOrNot] =
    useState(false);
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const {
    searchFlightAirlineList,
    flightTicketSingleDetailPayload,
    flightTicketSingleDetailLoading,
  } = useSelector((state: any) => state.flight);

  const checkPassengerType = (type: string) => {
    switch (type) {
      case passengerTypes?.ADULT:
        return "ADULT";
      case passengerTypes?.CHILD:
        return "CHILD";
      case passengerTypes?.INFANT:
        return "INFANT";
      default:
        return "-";
    }
  };

  const checkCountryNameWithCountryCode = (countryCode: string) => {
    return (
      nationalityList?.find(
        (nationalityItem) =>
          nationalityItem?.code === countryCode?.toUpperCase(),
      )?.country ?? ""
    );
  };

  const checkAiportDetailWithAirportCode = (
    airportCode: string,
    type: string,
  ) => {
    if (!airportCode) {
      return " ";
    }
    const airport = flightTicketSingleDetailPayload?.airportInfos.find(
      (airportInfo: AirportInfos) => airportInfo.iataCode === airportCode,
    );
    switch (type) {
      case AiportDetailConfigs?.CITY_NAME:
        return getNamePascalCase(airport ? airport?.city : airportCode);
      case AiportDetailConfigs?.COUNTRY_NAME:
        return getNamePascalCase(
          airport
            ? checkCountryNameWithCountryCode(airport?.country)
            : airportCode,
        );
      case AiportDetailConfigs?.AIRPORT_NAME:
        return getNamePascalCase(airport ? airport?.name : airportCode);
      default:
        return "";
    }
  };

  const checkFlightClassType = (cabinClass: string) => {
    if (!cabinClass) {
      return;
    }
    switch (cabinClass) {
      case cabinClassConfig?.BUSINESS:
        return "Business Class";
      case cabinClassConfig?.FIRST:
        return "First Class";
      case cabinClassConfig?.ECONOMIC:
        return "Economic Class";
      case cabinClassConfig?.ECONOMIC_STANDARD:
        return "Economic Standard Class";
      case cabinClassConfig?.ECONOMIC_PREMIUM:
        return "Economic Premium Class";
      default:
        return cabinClass;
    }
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

  const checkNameForTicket = () => {
    if (flightTicketSingleDetailPayload)
      return flightTicketSingleDetailPayload?.pnrInfo?.controlNumber;
    else return "";
  };

  const handleDownloadClick = () => {
    setWindowViewport(1000);
    setDownloadClick((prev) => prev + 1);
  };

  const handleTicketDownload = async () => {
    try {
      setDownloadPdf(true);

      const pdfDom = document.getElementById("download-ticket");
      const contentToConvert = document.getElementById(
        "ticket-detail-download",
      );

      if (!pdfDom || !contentToConvert) {
        console.error("PDF DOM or content to convert not found.");
        setDownloadPdf(false);
        return;
      }

      pdfDom.style.setProperty("width", "1200px", "important");

      await document.fonts.ready;

      const getContentWidth = pdfDom.scrollWidth;
      const getContentHeight = pdfDom.scrollHeight;

      const canvas = await html2canvas(contentToConvert, {
        allowTaint: true,
        useCORS: true,
        scale: window.devicePixelRatio || 5,
        backgroundColor: "#FFFFFF",
        logging: false,
        width: 1200,
        height: getContentHeight,
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 290;
      let heightLeft = imgHeight;

      const doc = new jsPDF("p", "mm");
      let position = 0;
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(
        `${checkNameForTicket()}- ${!checkViewFrom() ? "Afnuu-Booking" : "Afnuu-Ticket"
        }.pdf`,
      );
      pdfDom.style.setProperty("width", "auto", "important");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setDownloadClick(0);
    } finally {
      setDownloadPdf(false);
      setDownloadClick(0);
    }
  };

  useEffect(() => {
    if (windowViewport > 850 && downloadClick > 0) {
      handleTicketDownload();
    }
  }, [downloadClick]);

  useEffect(() => {
    if (!isUserAuthenticated()) {
      if (router?.query.token && !getUserToken) {
        router
          .push(
            `/auth/login?token=${router?.query?.token}&&redirect=/flightTicket`,
          )
          .then((data) => {
            setValidateUserLoading(!data);
          });
      }
      return;
    } else {
      setValidateUserLoading(false);
    }
    if (!pnrId) return;
    dispatch(fetchFlightTicketDetailByPNRId(pnrId)).then((res) => {
      if (res?.status === 200) {
        const flightTicketStausFromResponse =
          res && res?.data?.data?.pnrInfo?.status;
        setFlightTicketStatus(flightTicketStausFromResponse);
        const flightType = res?.data?.data?.pnrInfo?.flightType;
        if (flightType === FLIGHT_TYPES?.DOMESTIC) {
          setIsTheFlightDomesticOrNot(true);
        } else {
          setIsTheFlightDomesticOrNot(false);
        }
      } else {
        if (from === FLIGHT_TICKET_TYPE_PROPS?.FROM_DASHBOARD)
          toggleTicketDetailModal();
      }
    });
  }, [from, pnrId]);

  const checkViewFrom = () => {
    if (flightTicketStatus !== flightBookingConfig?.BOOK) {
      return true;
    }
  };
  const isTheTicketStatusBooked = () => {
    if (flightTicketStatus === flightBookingConfig?.BOOK) {
      return true;
    }
  };

  const isTheTicketStatusTicketed = () => {
    if (
      flightTicketStatus === flightBookingConfig?.TICKETED ||
      router.pathname === "/flightTicket"
    ) {
      return true;
    }
  };

  const isTheTicketStatusCancelled = () => {
    if (flightTicketStatus === flightBookingConfig?.CANCEL) {
      return true;
    }
  };

  const isTheFlightTicketOpenFromPath = () => {
    if (router.pathname === "/flightTicket") {
      return true;
    }
  };

  const checkIfFlightIsOutbound = (
    segmentInfos: SegmentInfoProps[] | undefined,
  ) => {
    if (!segmentInfos) return [];
    const outBoundFlights = segmentInfos?.filter(
      (segmentDetails) =>
        segmentDetails?.type?.toUpperCase() === FLIGHT_BOARD_TYPE?.OUTBOUND,
    );
    if (outBoundFlights?.length === 0) {
      return [...segmentInfos]?.sort(
        (ascItem, descItem) =>
          parseInt(ascItem?.referenceNumber) -
          parseInt(descItem?.referenceNumber),
      );
    }
    return outBoundFlights?.sort(
      (ascItem, descItem) =>
        parseInt(ascItem?.referenceNumber) -
        parseInt(descItem?.referenceNumber),
    );
  };

  const checkIfFlightIsInbound = (
    segmentInfos: SegmentInfoProps[] | undefined,
  ) => {
    if (!segmentInfos) return [];
    const inBoundFlights = segmentInfos?.filter(
      (segmentDetails) =>
        segmentDetails?.type?.toUpperCase() === FLIGHT_BOARD_TYPE?.INBOUND,
    );
    if (inBoundFlights?.length === 0) {
      return [];
    }
    return inBoundFlights?.sort(
      (ascItem, descItem) =>
        parseInt(ascItem?.referenceNumber) -
        parseInt(descItem?.referenceNumber),
    );
  };

  const DownloadPdf = () => {
    return (
      <div className="flight_ticket--screen_large">
        <div className="flight-ticket__details">
          {isTheFlightTicketOpenFromPath() && (
            <div className="detail__header">
              <p className="header__title">
                {!checkViewFrom()
                  ? "Your Booking Details"
                  : "Your Ticket Details"}
              </p>
              <div
                className="header__download"
                onClick={() => {
                  handleDownloadClick();
                }}
              >
                <DownloadOutlined style={{ fontSize: "14px" }} />
                <p>Download</p>
              </div>
            </div>
          )}
          {!isTheFlightTicketOpenFromPath() && isTheTicketStatusTicketed() && (
            <div
              className="download__ticketed-ticket"
              onClick={() => {
                handleDownloadClick();
              }}
            >
              <DownloadOutlined style={{ fontSize: "14px" }} />
              <p>Download</p>
            </div>
          )}
          <div id="ticket-detail" className="detail__main-section">
            <div className="main-section___header">
              <div className="header__left-section">
                {flightTicketSingleDetailPayload?.logo ? (
                  <img src={flightTicketSingleDetailPayload?.logo} alt="logo" />
                ) : (
                  <Image src={AfnuuIcon} alt="logo" />
                )}
              </div>
              <p className="left-section__e-ticket">
                {!isTheTicketStatusBooked() && " E-Ticket &  "}Itinerary
              </p>
              <div className="header__right-section">
                <p>Booking Reference</p>
                <h1>
                  {flightTicketSingleDetailPayload?.pnrInfo?.controlNumber}
                </h1>
                <p>
                  {router.pathname === "/flightTicket"
                    ? flightTicketSingleDetailPayload?.pnrInfo?.status
                    : flightTicketStatus}
                </p>
              </div>
            </div>

            <div className="detail__ticket-details">
              {checkViewFrom() && (
                <div>
                  <div className="ticket-details__header">
                    <p>E-Tickets</p>
                  </div>
                  <div className="ticket-details__passenger-detail">
                    <table>
                      <tr>
                        <th>Passenger Name</th>
                        <th>E-Ticket Number</th>
                        <th>Passenger Type</th>
                      </tr>
                      {flightTicketSingleDetailPayload.ticketInfos?.map(
                        (
                          passengerData: PassengerTicketInfos,
                          passengerIndex: number,
                        ) => (
                          <tbody key={passengerIndex}>
                            <td>
                              {passengerData?.passengerLastName}/
                              {passengerData?.passengerFirstName}
                            </td>

                            <td>{passengerData?.ticketNumber}</td>
                            <td>
                              {checkPassengerType(passengerData?.passengerType)}
                            </td>
                          </tbody>
                        ),
                      )}
                    </table>
                  </div>
                </div>
              )}
              <div className="ticket-details__iternary-detail">
                {checkIfFlightIsOutbound(
                  flightTicketSingleDetailPayload?.segmentInfos,
                )?.map((flightDetail, flightIndex: number) => (
                  <>
                    {flightIndex === 0 && (
                      <div className="iternary-detail__header">
                        <p>Departures</p>
                      </div>
                    )}
                    <div
                      className="iternary-detail__flight-detail screen_lg"
                      key={flightIndex}
                    >
                      <div className="flight-detail__header">
                        <p className="header__flight">Flight </p>
                        <p className="header__from">From </p>
                        <p className="header__to">To </p>
                      </div>
                      <div className="flight-detail__flight-section">
                        <div className="flight-section__left-section">
                          {checkAirlineImageLink(
                            flightTicketSingleDetailPayload?.imageInfo,
                            flightDetail?.airline,
                          )}

                          <p className="airline-name">
                            {checkAirlineName(
                              flightTicketSingleDetailPayload?.airlineInfo,
                              flightDetail?.airline,
                            )}
                          </p>
                          <p className="airline-number">
                            {flightDetail?.airline} -{" "}
                            {flightDetail?.flightNumber}
                          </p>
                        </div>
                        <div className="flight-section__middle-section">
                          <div className="middle-section__top">
                            <p className="top__departure-code">
                              {flightDetail?.boardPoint}
                            </p>
                            &nbsp;
                            <p>
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.boardPoint,
                                AiportDetailConfigs?.CITY_NAME,
                              )}
                            </p>
                            , &nbsp;
                            <p>
                              {" "}
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.boardPoint,
                                AiportDetailConfigs?.COUNTRY_NAME,
                              )}
                            </p>
                          </div>
                          <div className="top__departure-date">
                            <p className="departure-date">
                              {convertDateIntoTicketDownloadFormat(
                                flightDetail?.departureDate,
                              )}
                            </p>
                            &nbsp;
                            <p className="departure-time">
                              {flightDetail?.departureTime}
                            </p>
                            <p className="local-time">(Local Time)</p>
                          </div>
                          <p className="airport-name">
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.boardPoint,
                              AiportDetailConfigs?.AIRPORT_NAME,
                            )}
                          </p>
                          <p className="departure-terminal">
                            {flightDetail?.departureTerminal}
                          </p>
                        </div>
                        <div className="flight-section__right-section">
                          <div className="right-section__top">
                            <p className="top__departure-code">
                              {flightDetail?.offPoint}
                            </p>
                            &nbsp;
                            <p>
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.offPoint,
                                AiportDetailConfigs?.CITY_NAME,
                              )}
                            </p>
                            , &nbsp;
                            <p>
                              {" "}
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.offPoint,
                                AiportDetailConfigs?.COUNTRY_NAME,
                              )}
                            </p>
                          </div>
                          <div className="top__departure-date">
                            <p className="departure-date">
                              {convertDateIntoTicketDownloadFormat(
                                flightDetail?.arrivalDate,
                              )}
                            </p>
                            &nbsp;
                            <p className="departure-time">
                              {" "}
                              {flightDetail?.arrivalTime}
                            </p>
                            <p className="local-time">(Local Time)</p>
                          </div>
                          <p className="airport-name">
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.AIRPORT_NAME,
                            )}
                          </p>
                          <p className="departure-terminal">
                            {flightDetail?.arrivalTerminal}
                          </p>
                        </div>
                      </div>
                      <div className="iternary-section__cabin-detail">
                        <div className="cabin-detail__left-section">
                          <p>
                            Class: &nbsp;
                            <strong>
                              {checkFlightClassType(
                                flightDetail?.cabinClass
                                  ? flightDetail?.cabinClass?.toUpperCase()
                                  : "",
                              )}
                            </strong>
                          </p>
                        </div>
                        <div>
                          <p>
                            Flight Duration:{" "}
                            <strong>
                              {convertTimeToStandardTime(
                                flightDetail?.flightDuration,
                              )}
                            </strong>
                          </p>
                        </div>

                        <div className="cabin-detail__right-section">
                          <div className="right-section__check-in">
                            <p>Check-in: </p>&nbsp;
                            {flightDetail?.baggageInfo ? (
                              <strong>
                                {checkBaggageInfo(flightDetail?.baggageInfo)}
                              </strong>
                            ) : (
                              <p>N/A</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {flightDetail?.transitTime !== 0 && (
                        <div className="transit-detail">
                          <div className="transit-left-section">
                            <p className="transit-time">
                              {convertTimeToStandardTime(
                                flightDetail?.transitTime,
                              )}
                            </p>
                            &nbsp;
                            <p>transit time in</p>
                            &nbsp;
                            <p className="transit-location">
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.offPoint,
                                AiportDetailConfigs?.CITY_NAME,
                              )}
                            </p>
                          </div>
                          <div className="transit-right-section">
                            <p>Kindly verify with the airline if you need a</p>
                            &nbsp;
                            <p className="transit-visa">Transist Visa</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ))}
                {checkIfFlightIsInbound(
                  flightTicketSingleDetailPayload?.segmentInfos,
                )?.map((flightDetail, flightIndex: number) => (
                  <>
                    {flightIndex === 0 && (
                      <div className="iternary-detail__header">
                        <p>
                          {flightTicketSingleDetailPayload?.pnrInfo
                            ?.tripType === "MULTI_CITY"
                            ? "Departure"
                            : "Arrival"}
                        </p>
                      </div>
                    )}
                    <div
                      className="iternary-detail__flight-detail screen_lg"
                      key={flightIndex}
                    >
                      <div className="flight-detail__header">
                        <p className="header__flight">Flight </p>
                        <p className="header__from">From </p>
                        <p className="header__to">To </p>
                      </div>
                      <div className="flight-detail__flight-section">
                        <div className="flight-section__left-section">
                          {checkAirlineImageLink(
                            flightTicketSingleDetailPayload?.imageInfo,
                            flightDetail?.airline,
                          )}
                          <p className="airline-name">
                            {checkAirlineName(
                              flightTicketSingleDetailPayload?.airlineInfo,
                              flightDetail?.airline,
                            )}
                          </p>
                          <p className="airline-number">
                            {flightDetail?.airline} -{" "}
                            {flightDetail?.flightNumber}
                          </p>
                        </div>
                        <div className="flight-section__middle-section">
                          <div className="middle-section__top">
                            <p className="top__departure-code">
                              {flightDetail?.boardPoint}
                            </p>
                            &nbsp;
                            <p>
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.boardPoint,
                                AiportDetailConfigs?.CITY_NAME,
                              )}
                            </p>
                            , &nbsp;
                            <p>
                              {" "}
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.boardPoint,
                                AiportDetailConfigs?.COUNTRY_NAME,
                              )}
                            </p>
                          </div>
                          <div className="top__departure-date">
                            <p className="departure-date">
                              {convertDateIntoTicketDownloadFormat(
                                flightDetail?.departureDate,
                              )}
                            </p>
                            &nbsp;
                            <p className="departure-time">
                              {flightDetail?.departureTime}
                            </p>
                            <p className="local-time">(Local Time)</p>
                          </div>
                          <p className="airport-name">
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.boardPoint,
                              AiportDetailConfigs?.AIRPORT_NAME,
                            )}
                          </p>
                          <p className="departure-terminal">
                            {flightDetail?.departureTerminal}
                          </p>
                        </div>
                        <div className="flight-section__right-section">
                          <div className="right-section__top">
                            <p className="top__departure-code">
                              {flightDetail?.offPoint}
                            </p>
                            &nbsp;
                            <p>
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.offPoint,
                                AiportDetailConfigs?.CITY_NAME,
                              )}
                            </p>
                            , &nbsp;
                            <p>
                              {" "}
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.offPoint,
                                AiportDetailConfigs?.COUNTRY_NAME,
                              )}
                            </p>
                          </div>
                          <div className="top__departure-date">
                            <p className="departure-date">
                              {convertDateIntoTicketDownloadFormat(
                                flightDetail?.arrivalDate,
                              )}
                            </p>
                            &nbsp;
                            <p className="departure-time">
                              {" "}
                              {flightDetail?.arrivalTime}
                            </p>
                            <p className="local-time">(Local Time)</p>
                          </div>
                          <p className="airport-name">
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.AIRPORT_NAME,
                            )}
                          </p>
                          <p className="departure-terminal">
                            {flightDetail?.arrivalTerminal}
                          </p>
                        </div>
                      </div>
                      <div className="iternary-section__cabin-detail">
                        <div className="cabin-detail__left-section">
                          <p>
                            Class:&nbsp;
                            <strong>
                              {checkFlightClassType(
                                flightDetail?.cabinClass
                                  ? flightDetail?.cabinClass?.toUpperCase()
                                  : "",
                              )}
                            </strong>
                          </p>
                        </div>
                        <div>
                          <p>
                            Flight Duration:{" "}
                            <strong>
                              {convertTimeToStandardTime(
                                flightDetail?.flightDuration,
                              )}
                            </strong>
                          </p>
                        </div>

                        <div className="cabin-detail__right-section">
                          <div className="right-section__check-in">
                            <p>Check-in: </p>&nbsp;
                            {flightDetail?.baggageInfo ? (
                              <strong>
                                {checkBaggageInfo(flightDetail?.baggageInfo)}
                              </strong>
                            ) : (
                              <p>N/A</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {flightDetail?.transitTime !== 0 && (
                        <div className="transit-detail">
                          <div className="transit-left-section">
                            <p className="transit-time">
                              {convertTimeToStandardTime(
                                flightDetail?.transitTime,
                              )}
                            </p>
                            &nbsp;
                            <p>transit time in</p>
                            &nbsp;
                            <p className="transit-location">
                              {checkAiportDetailWithAirportCode(
                                flightDetail?.offPoint,
                                AiportDetailConfigs?.CITY_NAME,
                              )}
                            </p>
                          </div>
                          <div className="transit-right-section">
                            <p>Kindly verify with the airline if you need a</p>
                            &nbsp;
                            <p className="transit-visa">Transist Visa</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ))}
                {!isTheTicketStatusCancelled() && (
                  <>
                    <div className="important-notice">
                      <div className="notice-header">
                        <p>IMPORTANT NOTICE</p>
                      </div>
                      <div className="notice-list">
                        {noticeList?.map((notice, noticeIndex) => (
                          <div key={noticeIndex}>
                            <ul>
                              <li>{notice.list}</li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isTheTicketStatusTicketed() && (
                      <div
                        className="greetings"
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <p>HAVE A NICE FLIGHT</p>
                      </div>
                    )}
                  </>
                )}
                {!isTheTicketStatusTicketed() && (
                  <table className="ticket-details__passenger-detail-booking">
                    <tr>
                      <th>SN</th>
                      <th>Full Name</th>
                      {!isTheFlightDomesticOrNot && <th>Document Id Number</th>}
                      {!isTheFlightDomesticOrNot && (
                        <th>Document Expiry Date</th>
                      )}
                      <th>Nationality</th>
                      {!isTheFlightDomesticOrNot && <th>Date of Birth</th>}
                      <th>Passenger Type</th>
                    </tr>
                    {flightTicketSingleDetailPayload?.pnrInfo?.passengers?.map(
                      (passengerDetail: travellerData, index: number) => (
                        <tbody key={index}>
                          <td>{index + 1}.</td>
                          <td>
                            {getFullName(
                              passengerDetail?.firstName,
                              passengerDetail?.middleName,
                              passengerDetail?.lastName,
                            )}
                          </td>
                          {!isTheFlightDomesticOrNot && (
                            <td>
                              {!isEmpty(passengerDetail?.identificationNumber)
                                ? passengerDetail?.identificationNumber
                                : "-"}
                            </td>
                          )}
                          {!isTheFlightDomesticOrNot && (
                            <td>
                              {!isEmpty(
                                passengerDetail?.identificationExpiryDate,
                              )
                                ? passengerDetail?.identificationExpiryDate
                                : "-"}
                            </td>
                          )}

                          <td>
                            {getNationalityByCode(passengerDetail?.nationality)}
                          </td>
                          {!isTheFlightDomesticOrNot && (
                            <td>
                              {!isEmpty(passengerDetail?.dob)
                                ? passengerDetail?.dob
                                : "-"}
                            </td>
                          )}
                          <td>{checkPassengerType(passengerDetail?.type!)}</td>
                        </tbody>
                      ),
                    )}
                  </table>
                )}
                {!checkViewFrom() && (
                  <div className="ticket-details__total-fare">
                    <p>Total Fare:</p> &nbsp;
                    <strong>
                      <p className="total-fare__amount">
                        {convertPriceIntoStandardPriceFormat(
                          flightTicketSingleDetailPayload?.totalFinalFare,
                        )}
                      </p>
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isTheTicketStatusTicketed() && (
            <div className="download-btn-section">
              <Button
                className="btn-primary"
                onClick={() => {
                  setWindowViewport(1000);
                  if (windowViewport > 850) {
                    handleTicketDownload();
                  }
                }}
              >
                <DownloadOutlined style={{ fontSize: "14px" }} />
                Download
              </Button>
            </div>
          )}
          {!checkViewFrom() && (
            <div className="download-btn-section">
              <Button
                className="btn-primary"
                onClick={() => {
                  handleToRedirectPaymentPage &&
                    handleToRedirectPaymentPage(pnrId);
                }}
              >
                <ArrowRightOutlined style={{ fontSize: "14px" }} />
                Proceed for payment
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flight_ticket_wrapper"
      style={{
        position: `${router?.pathname === "/flightTicket" ? "fixed" : '"static"'}`,
      }}
    >
      <BackButtonRedirect redirectPath="/" />
      {validateUserloading ? (
        <CustomLoader />
      ) : (
        <>
          {downloadPdf || flightTicketSingleDetailLoading ? (
            <div className="flight-ticket__loading">
              <LoadingOutlined style={{ fontSize: "50px" }} />
              <p>
                {flightTicketSingleDetailLoading
                  ? "Loading..."
                  : "Downloading..."}
              </p>
            </div>
          ) : (
            <div>
              {displaySupportPage ? (
                <SupportPage shouldRenderButton="notRequired" />
              ) : (
                <>
                  {windowViewport <= 850 ? (
                    <div className="flight_ticket">
                      subadh
                      <div className="flight-ticket__details">
                        {isTheFlightTicketOpenFromPath() && (
                          <div className="detail__header">
                            <p className="header__title">
                              {!checkViewFrom()
                                ? "Your Booking Details"
                                : "Your Ticket Details"}
                            </p>
                            <div
                              className="header__download"
                              onClick={() => {
                                handleDownloadClick();
                              }}
                            >
                              <DownloadOutlined style={{ fontSize: "14px" }} />
                              <p>Download</p>
                            </div>
                          </div>
                        )}
                        {!isTheFlightTicketOpenFromPath() &&
                          isTheTicketStatusTicketed() && (
                            <div
                              className="download__ticketed-ticket"
                              onClick={() => {
                                handleDownloadClick();
                              }}
                            >
                              <DownloadOutlined style={{ fontSize: "14px" }} />
                              <p>Download</p>
                            </div>
                          )}
                        <div className="detail__main-section">
                          <div className="main-section___header">
                            <div className="header__left-section">
                              {flightTicketSingleDetailPayload?.logo ? (
                                <img
                                  src={flightTicketSingleDetailPayload?.logo}
                                  alt="logo"
                                />
                              ) : (
                                <Image src={AfnuuIcon} alt="logo" />
                              )}
                            </div>
                            <p className="left-section__e-ticket ">
                              E-Ticket & Itinerary
                            </p>
                            <div className="header__right-section">
                              <p>Booking Reference</p>
                              <h1>
                                {
                                  flightTicketSingleDetailPayload?.pnrInfo
                                    ?.controlNumber
                                }
                              </h1>
                            </div>
                          </div>

                          <div className="detail__ticket-details">
                            {checkViewFrom() && (
                              <div>
                                <div className="ticket-details__header">
                                  <p>E-Tickets</p>
                                </div>
                                <div className="ticket-details__passenger-detail">
                                  <table>
                                    <tr>
                                      <th>Passenger Name</th>
                                      <th>E-Ticket Number</th>
                                      <th>Passenger Type</th>
                                    </tr>
                                    {flightTicketSingleDetailPayload.ticketInfos?.map(
                                      (
                                        passengerData: PassengerTicketInfos,
                                        passengerIndex: number,
                                      ) => (
                                        <tbody key={passengerIndex}>
                                          <td>
                                            {passengerData?.passengerLastName}/
                                            {passengerData?.passengerFirstName}
                                          </td>

                                          <td>{passengerData?.ticketNumber}</td>
                                          <td>
                                            {checkPassengerType(
                                              passengerData?.passengerType,
                                            )}
                                          </td>
                                        </tbody>
                                      ),
                                    )}
                                  </table>
                                </div>
                              </div>
                            )}
                            <div className="ticket-details__iternary-detail">
                              {checkIfFlightIsOutbound(
                                flightTicketSingleDetailPayload?.segmentInfos,
                              )?.map((flightDetail, flightIndex: number) => (
                                <>
                                  {flightIndex === 0 && (
                                    <div className="iternary-detail__header">
                                      <p>Departure</p>
                                    </div>
                                  )}
                                  {windowViewport <= 850 ? (
                                    <div
                                      className="screen_sm"
                                      key={flightIndex}
                                      id="smallScreen"
                                    >
                                      <div className="flight-detail__flight-section">
                                        <div className="flight-section_left-section">
                                          <p className="header__flight">
                                            Flight{" "}
                                          </p>
                                          <div className="flight-section__left-section">
                                            {checkAirlineImageLink(
                                              flightTicketSingleDetailPayload?.imageInfo,
                                              flightDetail?.airline,
                                            )}
                                            <p className="airline-name">
                                              {checkAirlineName(
                                                flightTicketSingleDetailPayload?.airlineInfo,
                                                flightDetail?.airline,
                                              )}
                                            </p>
                                            <p className="airline-number">
                                              {flightDetail?.airline} -{" "}
                                              {flightDetail?.flightNumber}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flight-section_middle-section">
                                          <p className="header__from">From </p>
                                          <div className="flight-section__middle-section">
                                            <div className="middle-section__top">
                                              <p className="top__departure-code">
                                                {flightDetail?.boardPoint}
                                              </p>
                                              &nbsp;
                                              <p>
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.boardPoint,
                                                  AiportDetailConfigs?.CITY_NAME,
                                                )}
                                              </p>
                                              , &nbsp;
                                              <p>
                                                {" "}
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.boardPoint,
                                                  AiportDetailConfigs?.COUNTRY_NAME,
                                                )}
                                              </p>
                                            </div>
                                            <div className="top__departure-date">
                                              <p className="departure-date">
                                                {convertDateIntoTicketDownloadFormat(
                                                  flightDetail?.departureDate,
                                                )}
                                              </p>
                                              &nbsp;
                                              <p className="departure-time">
                                                {flightDetail?.departureTime}
                                              </p>
                                              <p className="local-time">
                                                (Local Time)
                                              </p>
                                            </div>
                                            <p className="airport-name">
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.boardPoint,
                                                AiportDetailConfigs?.AIRPORT_NAME,
                                              )}
                                            </p>
                                            <p className="departure-terminal">
                                              {flightDetail?.departureTerminal}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flight-section_right-section">
                                          <p className="header__to">To </p>
                                          <div className="flight-section__right-section">
                                            <div className="right-section__top">
                                              <p className="top__departure-code">
                                                {flightDetail?.offPoint}
                                              </p>
                                              &nbsp;
                                              <p>
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.offPoint,
                                                  AiportDetailConfigs?.CITY_NAME,
                                                )}
                                              </p>
                                              , &nbsp;
                                              <p>
                                                {" "}
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.offPoint,
                                                  AiportDetailConfigs?.COUNTRY_NAME,
                                                )}
                                              </p>
                                            </div>
                                            <div className="top__departure-date">
                                              <p className="departure-date">
                                                {convertDateIntoTicketDownloadFormat(
                                                  flightDetail?.arrivalDate,
                                                )}
                                              </p>
                                              &nbsp;
                                              <p className="departure-time">
                                                {" "}
                                                {flightDetail?.arrivalTime}
                                              </p>
                                              <p className="local-time">
                                                (Local Time)
                                              </p>
                                            </div>
                                            <p className="airport-name">
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.AIRPORT_NAME,
                                              )}
                                            </p>
                                            <p className="departure-terminal">
                                              {flightDetail?.arrivalTerminal}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="iternary-section__cabin-detail">
                                          <div className="cabin-detail__left-section">
                                            <p>
                                              Class:&nbsp;
                                              <strong>
                                                {checkFlightClassType(
                                                  flightDetail?.cabinClass
                                                    ? flightDetail?.cabinClass?.toUpperCase()
                                                    : "",
                                                )}
                                              </strong>
                                            </p>
                                          </div>
                                          <div>
                                            <p>
                                              Flight Duration:{" "}
                                              <strong>
                                                {convertTimeToStandardTime(
                                                  flightDetail?.flightDuration,
                                                )}
                                              </strong>
                                            </p>
                                          </div>

                                          <div className="cabin-detail__right-section">
                                            <div className="right-section__check-in">
                                              <p>Check-in: </p>&nbsp;
                                              {flightDetail?.baggageInfo ? (
                                                <strong>
                                                  {checkBaggageInfo(
                                                    flightDetail?.baggageInfo,
                                                  )}
                                                </strong>
                                              ) : (
                                                <p>N/A</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {flightDetail?.transitTime !== 0 && (
                                          <div className="transit-detail">
                                            <div className="transit-left-section">
                                              <p className="transit-time">
                                                {convertTimeToStandardTime(
                                                  flightDetail?.transitTime,
                                                )}
                                              </p>
                                              &nbsp;
                                              <p>transit time in</p>
                                              &nbsp;
                                              <p className="transit-location">
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.offPoint,
                                                  AiportDetailConfigs?.CITY_NAME,
                                                )}
                                              </p>
                                            </div>
                                            <div className="transit-right-section">
                                              <p>
                                                Kindly verify with the airline
                                                if you need a
                                              </p>
                                              &nbsp;
                                              <p className="transit-visa">
                                                Transist Visa
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="iternary-detail__flight-detail screen_lg"
                                      key={flightIndex}
                                    >
                                      <div className="flight-detail__header">
                                        <p className="header__flight">
                                          Flight{" "}
                                        </p>
                                        <p className="header__from">From </p>
                                        <p className="header__to">To </p>
                                      </div>
                                      <div className="flight-detail__flight-section">
                                        <div className="flight-section__left-section">
                                          {checkAirlineImageLink(
                                            flightTicketSingleDetailPayload?.imageInfo,
                                            flightDetail?.airline,
                                          )}
                                          <p className="airline-name">
                                            {checkAirlineName(
                                              flightTicketSingleDetailPayload?.airlineInfo,
                                              flightDetail?.airline,
                                            )}
                                          </p>
                                          <p className="airline-number">
                                            {flightDetail?.airline} -{" "}
                                            {flightDetail?.flightNumber}
                                          </p>
                                        </div>
                                        <div className="flight-section__middle-section">
                                          <div className="middle-section__top">
                                            <p className="top__departure-code">
                                              {flightDetail?.boardPoint}
                                            </p>
                                            &nbsp;
                                            <p>
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.boardPoint,
                                                AiportDetailConfigs?.CITY_NAME,
                                              )}
                                            </p>
                                            , &nbsp;
                                            <p>
                                              {" "}
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.boardPoint,
                                                AiportDetailConfigs?.COUNTRY_NAME,
                                              )}
                                            </p>
                                          </div>
                                          <div className="top__departure-date">
                                            <p className="departure-date">
                                              {convertDateIntoTicketDownloadFormat(
                                                flightDetail?.departureDate,
                                              )}
                                            </p>
                                            &nbsp;
                                            <p className="departure-time">
                                              {flightDetail?.departureTime}
                                            </p>
                                            <p className="local-time">
                                              (Local Time)
                                            </p>
                                          </div>
                                          <p className="airport-name">
                                            {checkAiportDetailWithAirportCode(
                                              flightDetail?.boardPoint,
                                              AiportDetailConfigs?.AIRPORT_NAME,
                                            )}
                                          </p>
                                          <p className="departure-terminal">
                                            {flightDetail?.departureTerminal}
                                          </p>
                                        </div>
                                        <div className="flight-section__right-section">
                                          <div className="right-section__top">
                                            <p className="top__departure-code">
                                              {flightDetail?.offPoint}
                                            </p>
                                            &nbsp;
                                            <p>
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.CITY_NAME,
                                              )}
                                            </p>
                                            , &nbsp;
                                            <p>
                                              {" "}
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.COUNTRY_NAME,
                                              )}
                                            </p>
                                          </div>
                                          <div className="top__departure-date">
                                            <p className="departure-date">
                                              {convertDateIntoTicketDownloadFormat(
                                                flightDetail?.arrivalDate,
                                              )}
                                            </p>
                                            &nbsp;
                                            <p className="departure-time">
                                              {" "}
                                              {flightDetail?.arrivalTime}
                                            </p>
                                            <p className="local-time">
                                              (Local Time)
                                            </p>
                                          </div>
                                          <p className="airport-name">
                                            {checkAiportDetailWithAirportCode(
                                              flightDetail?.offPoint,
                                              AiportDetailConfigs?.AIRPORT_NAME,
                                            )}
                                          </p>
                                          <p className="departure-terminal">
                                            {flightDetail?.arrivalTerminal}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="iternary-section__cabin-detail">
                                        <div className="cabin-detail__left-section">
                                          <p>
                                            Class:&nbsp;
                                            <strong>
                                              {checkFlightClassType(
                                                flightDetail?.cabinClass
                                                  ? flightDetail?.cabinClass?.toUpperCase()
                                                  : "",
                                              )}
                                            </strong>
                                          </p>
                                        </div>
                                        <div>
                                          <p>
                                            Flight Duration:{" "}
                                            <strong>
                                              {convertTimeToStandardTime(
                                                flightDetail?.flightDuration,
                                              )}
                                            </strong>
                                          </p>
                                        </div>

                                        <div className="cabin-detail__right-section">
                                          <div className="right-section__check-in">
                                            <p>Check-in: </p>&nbsp;
                                            {flightDetail?.baggageInfo ? (
                                              <strong>
                                                {checkBaggageInfo(
                                                  flightDetail?.baggageInfo,
                                                )}
                                              </strong>
                                            ) : (
                                              <p>N/A</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {flightDetail?.transitTime !== 0 && (
                                        <div className="transit-detail">
                                          <div className="transit-left-section">
                                            <p className="transit-time">
                                              {convertTimeToStandardTime(
                                                flightDetail?.transitTime,
                                              )}
                                            </p>
                                            &nbsp;
                                            <p>transit time in</p>
                                            &nbsp;
                                            <p className="transit-location">
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.CITY_NAME,
                                              )}
                                            </p>
                                          </div>
                                          <div className="transit-right-section">
                                            <p>
                                              Kindly verify with the airline if
                                              you need a
                                            </p>
                                            &nbsp;
                                            <p className="transit-visa">
                                              Transist Visa
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              ))}
                              {checkIfFlightIsInbound(
                                flightTicketSingleDetailPayload?.segmentInfos,
                              )?.map((flightDetail, flightIndex: number) => (
                                <>
                                  {flightIndex === 0 && (
                                    <div className="iternary-detail__header">
                                      <p>
                                        {flightTicketSingleDetailPayload
                                          ?.pnrInfo?.tripType === "MULTI_CITY"
                                          ? "Departure"
                                          : "Arrival"}
                                      </p>
                                    </div>
                                  )}
                                  {windowViewport <= 850 ? (
                                    <div
                                      className="screen_sm"
                                      key={flightIndex}
                                      id="smallScreen"
                                    >
                                      <div className="flight-detail__flight-section">
                                        <div className="flight-section_left-section">
                                          <p className="header__flight">
                                            Flight{" "}
                                          </p>
                                          <div className="flight-section__left-section">
                                            {checkAirlineImageLink(
                                              flightTicketSingleDetailPayload?.imageInfo,
                                              flightDetail?.airline,
                                            )}
                                            <p className="airline-name">
                                              {checkAirlineName(
                                                flightTicketSingleDetailPayload?.airlineInfo,
                                                flightDetail?.airline,
                                              )}
                                            </p>
                                            <p className="airline-number">
                                              {flightDetail?.airline} -{" "}
                                              {flightDetail?.flightNumber}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flight-section_middle-section">
                                          <p className="header__from">From </p>
                                          <div className="flight-section__middle-section">
                                            <div className="middle-section__top">
                                              <p className="top__departure-code">
                                                {flightDetail?.boardPoint}
                                              </p>
                                              &nbsp;
                                              <p>
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.boardPoint,
                                                  AiportDetailConfigs?.CITY_NAME,
                                                )}
                                              </p>
                                              , &nbsp;
                                              <p>
                                                {" "}
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.boardPoint,
                                                  AiportDetailConfigs?.COUNTRY_NAME,
                                                )}
                                              </p>
                                            </div>
                                            <div className="top__departure-date">
                                              <p className="departure-date">
                                                {convertDateIntoTicketDownloadFormat(
                                                  flightDetail?.departureDate,
                                                )}
                                              </p>
                                              &nbsp;
                                              <p className="departure-time">
                                                {flightDetail?.departureTime}
                                              </p>
                                              <p className="local-time">
                                                (Local Time)
                                              </p>
                                            </div>
                                            <p className="airport-name">
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.boardPoint,
                                                AiportDetailConfigs?.AIRPORT_NAME,
                                              )}
                                            </p>
                                            <p className="departure-terminal">
                                              {flightDetail?.departureTerminal}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flight-section_right-section">
                                          <p className="header__to">To </p>
                                          <div className="flight-section__right-section">
                                            <div className="right-section__top">
                                              <p className="top__departure-code">
                                                {flightDetail?.offPoint}
                                              </p>
                                              &nbsp;
                                              <p>
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.offPoint,
                                                  AiportDetailConfigs?.CITY_NAME,
                                                )}
                                              </p>
                                              , &nbsp;
                                              <p>
                                                {" "}
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.offPoint,
                                                  AiportDetailConfigs?.COUNTRY_NAME,
                                                )}
                                              </p>
                                            </div>
                                            <div className="top__departure-date">
                                              <p className="departure-date">
                                                {convertDateIntoTicketDownloadFormat(
                                                  flightDetail?.arrivalDate,
                                                )}
                                              </p>
                                              &nbsp;
                                              <p className="departure-time">
                                                {" "}
                                                {flightDetail?.arrivalTime}
                                              </p>
                                              <p className="local-time">
                                                (Local Time)
                                              </p>
                                            </div>
                                            <p className="airport-name">
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.AIRPORT_NAME,
                                              )}
                                            </p>
                                            <p className="departure-terminal">
                                              {flightDetail?.arrivalTerminal}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="iternary-section__cabin-detail">
                                          <div className="cabin-detail__left-section">
                                            <p>
                                              Class:&nbsp;
                                              <strong>
                                                {checkFlightClassType(
                                                  flightDetail?.cabinClass
                                                    ? flightDetail?.cabinClass?.toUpperCase()
                                                    : "",
                                                )}
                                              </strong>
                                            </p>
                                          </div>
                                          <div>
                                            <p>
                                              Flight Duration:{" "}
                                              <strong>
                                                {convertTimeToStandardTime(
                                                  flightDetail?.flightDuration,
                                                )}
                                              </strong>
                                            </p>
                                          </div>

                                          <div className="cabin-detail__right-section">
                                            <div className="right-section__check-in">
                                              <p>Check-in: </p>&nbsp;
                                              {flightDetail?.baggageInfo ? (
                                                <strong>
                                                  {checkBaggageInfo(
                                                    flightDetail?.baggageInfo,
                                                  )}
                                                </strong>
                                              ) : (
                                                <p>N/A</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        {flightDetail?.transitTime !== 0 && (
                                          <div className="transit-detail">
                                            <div className="transit-left-section">
                                              <p className="transit-time">
                                                {convertTimeToStandardTime(
                                                  flightDetail?.transitTime,
                                                )}
                                              </p>
                                              &nbsp;
                                              <p>transit time in</p>
                                              &nbsp;
                                              <p className="transit-location">
                                                {checkAiportDetailWithAirportCode(
                                                  flightDetail?.offPoint,
                                                  AiportDetailConfigs?.CITY_NAME,
                                                )}
                                              </p>
                                            </div>
                                            <div className="transit-right-section">
                                              <p>
                                                Kindly verify with the airline
                                                if you need a
                                              </p>
                                              &nbsp;
                                              <p className="transit-visa">
                                                Transist Visa
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className="iternary-detail__flight-detail screen_lg"
                                      key={flightIndex}
                                    >
                                      <div className="flight-detail__header">
                                        <p className="header__flight">
                                          Flight{" "}
                                        </p>
                                        <p className="header__from">From </p>
                                        <p className="header__to">To </p>
                                      </div>
                                      <div className="flight-detail__flight-section">
                                        <div className="flight-section__left-section">
                                          {checkAirlineImageLink(
                                            flightTicketSingleDetailPayload?.imageInfo,
                                            flightDetail?.airline,
                                          )}
                                          <p className="airline-name">
                                            {checkAirlineName(
                                              flightTicketSingleDetailPayload?.airlineInfo,
                                              flightDetail?.airline,
                                            )}
                                          </p>
                                          <p className="airline-number">
                                            {flightDetail?.airline} -{" "}
                                            {flightDetail?.flightNumber}
                                          </p>
                                        </div>
                                        <div className="flight-section__middle-section">
                                          <div className="middle-section__top">
                                            <p className="top__departure-code">
                                              {flightDetail?.boardPoint}
                                            </p>
                                            &nbsp;
                                            <p>
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.boardPoint,
                                                AiportDetailConfigs?.CITY_NAME,
                                              )}
                                            </p>
                                            , &nbsp;
                                            <p>
                                              {" "}
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.boardPoint,
                                                AiportDetailConfigs?.COUNTRY_NAME,
                                              )}
                                            </p>
                                          </div>
                                          <div className="top__departure-date">
                                            <p className="departure-date">
                                              {convertDateIntoTicketDownloadFormat(
                                                flightDetail?.departureDate,
                                              )}
                                            </p>
                                            &nbsp;
                                            <p className="departure-time">
                                              {flightDetail?.departureTime}
                                            </p>
                                            <p className="local-time">
                                              (Local Time)
                                            </p>
                                          </div>
                                          <p className="airport-name">
                                            {checkAiportDetailWithAirportCode(
                                              flightDetail?.boardPoint,
                                              AiportDetailConfigs?.AIRPORT_NAME,
                                            )}
                                          </p>
                                          <p className="departure-terminal">
                                            {flightDetail?.departureTerminal}
                                          </p>
                                        </div>
                                        <div className="flight-section__right-section">
                                          <div className="right-section__top">
                                            <p className="top__departure-code">
                                              {flightDetail?.offPoint}
                                            </p>
                                            &nbsp;
                                            <p>
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.CITY_NAME,
                                              )}
                                            </p>
                                            , &nbsp;
                                            <p>
                                              {" "}
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.COUNTRY_NAME,
                                              )}
                                            </p>
                                          </div>
                                          <div className="top__departure-date">
                                            <p className="departure-date">
                                              {convertDateIntoTicketDownloadFormat(
                                                flightDetail?.arrivalDate,
                                              )}
                                            </p>
                                            &nbsp;
                                            <p className="departure-time">
                                              {" "}
                                              {flightDetail?.arrivalTime}
                                            </p>
                                            <p className="local-time">
                                              (Local Time)
                                            </p>
                                          </div>
                                          <p className="airport-name">
                                            {checkAiportDetailWithAirportCode(
                                              flightDetail?.offPoint,
                                              AiportDetailConfigs?.AIRPORT_NAME,
                                            )}
                                          </p>
                                          <p className="departure-terminal">
                                            {flightDetail?.arrivalTerminal}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="iternary-section__cabin-detail">
                                        <div className="cabin-detail__left-section">
                                          <p>
                                            Class:&nbsp;
                                            <strong>
                                              {checkFlightClassType(
                                                flightDetail?.cabinClass
                                                  ? flightDetail?.cabinClass?.toUpperCase()
                                                  : "",
                                              )}
                                            </strong>
                                          </p>
                                        </div>
                                        <div>
                                          <p>
                                            Flight Duration:{" "}
                                            <strong>
                                              {convertTimeToStandardTime(
                                                flightDetail?.flightDuration,
                                              )}
                                            </strong>
                                          </p>
                                        </div>

                                        <div className="cabin-detail__right-section">
                                          <div className="right-section__check-in">
                                            <p>Check-in: </p>&nbsp;
                                            {flightDetail?.baggageInfo ? (
                                              <strong>
                                                {checkBaggageInfo(
                                                  flightDetail?.baggageInfo,
                                                )}
                                              </strong>
                                            ) : (
                                              <p>N/A</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {flightDetail?.transitTime !== 0 && (
                                        <div className="transit-detail">
                                          <div className="transit-left-section">
                                            <p className="transit-time">
                                              {convertTimeToStandardTime(
                                                flightDetail?.transitTime,
                                              )}
                                            </p>
                                            &nbsp;
                                            <p>transit time in</p>
                                            &nbsp;
                                            <p className="transit-location">
                                              {checkAiportDetailWithAirportCode(
                                                flightDetail?.offPoint,
                                                AiportDetailConfigs?.CITY_NAME,
                                              )}
                                            </p>
                                          </div>
                                          <div className="transit-right-section">
                                            <p>
                                              Kindly verify with the airline if
                                              you need a
                                            </p>
                                            &nbsp;
                                            <p className="transit-visa">
                                              Transist Visa
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              ))}
                              {!isTheTicketStatusCancelled() && (
                                <>
                                  <div className="important-notice">
                                    <div className="notice-header">
                                      <p>IMPORTANT NOTICE</p>
                                    </div>
                                    <div className="notice-list">
                                      {noticeList?.map(
                                        (notice, noticeIndex) => (
                                          <div key={noticeIndex}>
                                            <ul>
                                              <li>{notice.list}</li>
                                            </ul>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                  {isTheTicketStatusTicketed() && (
                                    <div
                                      className="greetings"
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      <p>HAVE A NICE FLIGHT</p>
                                    </div>
                                  )}
                                </>
                              )}
                              {!isTheTicketStatusTicketed() && (
                                <table className="ticket-details__passenger-detail-booking">
                                  <tr>
                                    <th>SN</th>
                                    <th>Full Name</th>
                                    {!isTheFlightDomesticOrNot && (
                                      <th> Document Id Number</th>
                                    )}

                                    {!isTheFlightDomesticOrNot && (
                                      <th>Document Expiry Date</th>
                                    )}
                                    <th>Nationality</th>
                                    {!isTheFlightDomesticOrNot && (
                                      <th>Date of Birth</th>
                                    )}
                                    <th>Passenger Type</th>
                                  </tr>
                                  {flightTicketSingleDetailPayload?.pnrInfo?.passengers?.map(
                                    (
                                      passengerDetail: travellerData,
                                      index: number,
                                    ) => (
                                      <tbody key={index}>
                                        <td>{index + 1}.</td>
                                        <td>
                                          {getFullName(
                                            passengerDetail?.firstName,
                                            passengerDetail?.middleName,
                                            passengerDetail?.lastName,
                                          )}
                                        </td>

                                        {!isTheFlightDomesticOrNot && (
                                          <td>
                                            {!isEmpty(
                                              passengerDetail?.identificationNumber,
                                            )
                                              ? passengerDetail?.identificationNumber
                                              : "-"}
                                          </td>
                                        )}
                                        {!isTheFlightDomesticOrNot && (
                                          <td>
                                            {!isEmpty(
                                              passengerDetail?.identificationExpiryDate,
                                            )
                                              ? passengerDetail?.identificationExpiryDate
                                              : "-"}
                                          </td>
                                        )}
                                        <td>
                                          {getNationalityByCode(
                                            passengerDetail?.nationality,
                                          )}
                                        </td>
                                        {!isTheFlightDomesticOrNot && (
                                          <td>
                                            {!isEmpty(passengerDetail?.dob)
                                              ? passengerDetail?.dob
                                              : "-"}
                                          </td>
                                        )}
                                        <td>
                                          {checkPassengerType(
                                            passengerDetail?.type!,
                                          )}
                                        </td>
                                      </tbody>
                                    ),
                                  )}
                                </table>
                              )}
                              {!checkViewFrom() && (
                                <div className="ticket-details__total-fare">
                                  <p>Total Fare:</p> &nbsp;
                                  <strong>
                                    <p className="total-fare__amount">
                                      {convertPriceIntoStandardPriceFormat(
                                        flightTicketSingleDetailPayload?.totalFinalFare,
                                      )}
                                    </p>
                                  </strong>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {isTheTicketStatusTicketed() && (
                          <div className="download-btn-section">
                            <Button
                              className="btn-primary"
                              onClick={() => {
                                handleDownloadClick();
                              }}
                            >
                              <DownloadOutlined style={{ fontSize: "14px" }} />
                              Download
                            </Button>
                          </div>
                        )}
                        {!checkViewFrom() && (
                          <div className="download-btn-section">
                            <Button
                              className="btn-primary"
                              onClick={() => {
                                handleToRedirectPaymentPage &&
                                  handleToRedirectPaymentPage(pnrId);
                              }}
                            >
                              <ArrowRightOutlined
                                style={{ fontSize: "14px" }}
                              />
                              Proceed for payment
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <DownloadPdf />
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
      {!isEmpty(flightTicketSingleDetailPayload) && (
        <div className="download-ticket" id="download-ticket">
          <div
            id="ticket-detail-download"
            className="ticket-details__iternary-details"
          >
            <div className="main-section___header">
              <div className="header__left-section">
                {flightTicketSingleDetailPayload?.logo ? (
                  <img src={flightTicketSingleDetailPayload?.logo} alt="logo" />
                ) : (
                  <Image src={AfnuuIcon} alt="logo" />
                )}
              </div>
              <p className="left-section__e-ticket">E-Ticket & Itinerary</p>
              <div className="header__right-section">
                <p>Booking Reference</p>
                <h1>
                  {flightTicketSingleDetailPayload?.pnrInfo?.controlNumber}
                </h1>
                <p>{flightTicketSingleDetailPayload?.pnrInfo?.status}</p>
              </div>
            </div>
            <div className="detail__ticket-details">
              <div style={{ marginBottom: "12px" }}>
                <div className="ticket-details__header">
                  <p>E-Tickets</p>
                </div>
                <div className="ticket-details__passenger-detail">
                  <table>
                    <tr>
                      <th>Passenger Name</th>
                      <th>E-Ticket Number</th>
                      <th>Passenger Type</th>
                    </tr>
                    {flightTicketSingleDetailPayload &&
                      flightTicketSingleDetailPayload.ticketInfos?.map(
                        (passengerData, passengerIndex: number) => (
                          <tbody key={passengerIndex}>
                            <td>
                              {passengerData?.passengerLastName}/
                              {passengerData?.passengerFirstName}
                            </td>

                            <td>{passengerData?.ticketNumber}</td>
                            <td>
                              {checkPassengerType(passengerData?.passengerType)}
                            </td>
                          </tbody>
                        ),
                      )}
                  </table>
                </div>
              </div>
              {checkIfFlightIsOutbound(
                flightTicketSingleDetailPayload?.segmentInfos,
              ).map((flightDetail, flightIndex: number) => (
                <>
                  {flightIndex === 0 && (
                    <div className="iternary-detail__header">
                      <p>Departure</p>
                    </div>
                  )}
                  <div
                    className="iternary-detail__flight-detail"
                    key={flightIndex}
                  >
                    <div className="flight-detail__header">
                      <p className="header__flight">Flight </p>
                      <p className="header__from">From </p>
                      <p className="header__to">To </p>
                    </div>
                    <div className="flight-detail__flight-section">
                      <div className="flight-section__left-section">
                        {checkAirlineImageLink(
                          flightTicketSingleDetailPayload?.imageInfo,
                          flightDetail?.airline,
                        )}
                        <p className="airline-name">
                          {checkAirlineName(
                            flightTicketSingleDetailPayload?.airlineInfo,
                            flightDetail?.airline,
                          )}
                        </p>
                        <p className="airline-number">
                          {flightDetail?.airline} - {flightDetail?.flightNumber}
                        </p>
                      </div>
                      <div className="flight-section__middle-section">
                        <div className="middle-section__top">
                          <p className="top__departure-code">
                            {flightDetail?.boardPoint}
                          </p>
                          &nbsp;
                          <p>
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.boardPoint,
                              AiportDetailConfigs?.CITY_NAME,
                            )}
                          </p>
                          , &nbsp;
                          <p>
                            {" "}
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.boardPoint,
                              AiportDetailConfigs?.COUNTRY_NAME,
                            )}
                          </p>
                        </div>
                        <div className="top__departure-date">
                          <p className="departure-date">
                            {convertDateIntoTicketDownloadFormat(
                              flightDetail?.departureDate,
                            )}
                          </p>
                          &nbsp;
                          <p className="depature-time">
                            {flightDetail?.departureTime}
                          </p>
                          <p className="local-time">(Local Time)</p>
                        </div>
                        <p className="airport-name">
                          {checkAiportDetailWithAirportCode(
                            flightDetail?.boardPoint,
                            AiportDetailConfigs?.AIRPORT_NAME,
                          )}
                        </p>
                        <p className="departure-terminal">
                          {flightDetail?.departureTerminal}
                        </p>
                      </div>
                      <div className="flight-section__right-section">
                        <div className="right-section__top">
                          <p className="top__departure-code">
                            {flightDetail?.offPoint}
                          </p>
                          &nbsp;
                          <p>
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.CITY_NAME,
                            )}
                          </p>
                          , &nbsp;
                          <p>
                            {" "}
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.COUNTRY_NAME,
                            )}
                          </p>
                        </div>
                        <div className="top__departure-date">
                          <p className="departure-date">
                            {convertDateIntoTicketDownloadFormat(
                              flightDetail?.arrivalDate,
                            )}
                          </p>
                          &nbsp;
                          <p className="depature-time">
                            {" "}
                            {flightDetail?.arrivalTime}
                          </p>
                          <p className="local-time">(Local Time)</p>
                        </div>
                        <p className="airport-name">
                          {checkAiportDetailWithAirportCode(
                            flightDetail?.offPoint,
                            AiportDetailConfigs?.AIRPORT_NAME,
                          )}
                        </p>
                        <p className="departure-terminal">
                          {flightDetail?.arrivalTerminal}
                        </p>
                      </div>
                    </div>
                    <div className="iternary-section__cabin-detail">
                      <div className="cabin-detail__left-section">
                        <p>
                          Class:{" "}
                          <strong>
                            {checkFlightClassType(
                              flightDetail?.cabinClass
                                ? flightDetail?.cabinClass?.toUpperCase()
                                : "",
                            )}
                          </strong>
                        </p>
                      </div>
                      <div>
                        <p>
                          Flight Duration:{" "}
                          <strong>
                            {convertTimeToStandardTime(
                              flightDetail?.flightDuration,
                            )}
                          </strong>
                        </p>
                      </div>

                      <div className="cabin-detail__right-section">
                        <div className="right-section__check-in">
                          <p>Check-in: </p>&nbsp;
                          {flightDetail?.baggageInfo ? (
                            <strong>
                              {checkBaggageInfo(
                                flightDetail?.baggageInfo as unknown as BaggageInfo,
                              )}
                            </strong>
                          ) : (
                            <p>N/A</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {flightDetail?.transitTime !== 0 && (
                      <div className="transit-detail">
                        <div className="transit-left-section">
                          <p className="transit-time">
                            {convertTimeToStandardTime(
                              flightDetail?.transitTime,
                            )}
                          </p>
                          &nbsp;
                          <p>transit time in</p>
                          &nbsp;
                          <p className="transit-location">
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.CITY_NAME,
                            )}
                          </p>
                        </div>
                        <div className="transit-right-section">
                          <p>Kindly verify with the airline if you need a</p>
                          &nbsp;
                          <p className="transit-visa">Transist Visa</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ))}

              {checkIfFlightIsInbound(
                flightTicketSingleDetailPayload?.segmentInfos,
              ).map((flightDetail, flightIndex: number) => (
                <>
                  {flightIndex === 0 && (
                    <div className="iternary-detail__header">
                      <p>Arrival</p>
                    </div>
                  )}

                  <div
                    className="iternary-detail__flight-detail"
                    key={flightIndex}
                  >
                    <div className="flight-detail__header">
                      <p className="header__flight">Flight </p>
                      <p className="header__from">From </p>
                      <p className="header__to">To </p>
                    </div>
                    <div className="flight-detail__flight-section">
                      <div className="flight-section__left-section">
                        {checkAirlineImageLink(
                          flightTicketSingleDetailPayload?.imageInfo,
                          flightDetail?.airline,
                        )}
                        <p className="airline-name">
                          {checkAirlineName(
                            flightTicketSingleDetailPayload?.airlineInfo,
                            flightDetail?.airline,
                          )}
                        </p>
                        <p className="airline-number">
                          {flightDetail?.airline} - {flightDetail?.flightNumber}
                        </p>
                      </div>
                      <div className="flight-section__middle-section">
                        <div className="middle-section__top">
                          <p className="top__departure-code">
                            {flightDetail?.boardPoint}
                          </p>
                          &nbsp;
                          <p>
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.boardPoint,
                              AiportDetailConfigs?.CITY_NAME,
                            )}
                          </p>
                          , &nbsp;
                          <p>
                            {" "}
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.boardPoint,
                              AiportDetailConfigs?.COUNTRY_NAME,
                            )}
                          </p>
                        </div>
                        <div className="top__departure-date">
                          <p className="departure-date">
                            {convertDateIntoTicketDownloadFormat(
                              flightDetail?.departureDate,
                            )}
                          </p>
                          &nbsp;
                          <p className="depature-time">
                            {flightDetail?.departureTime}
                          </p>
                          <p className="local-time">(Local Time)</p>
                        </div>
                        <p className="airport-name">
                          {checkAiportDetailWithAirportCode(
                            flightDetail?.boardPoint,
                            AiportDetailConfigs?.AIRPORT_NAME,
                          )}
                        </p>
                        <p className="departure-terminal">
                          {flightDetail?.departureTerminal}
                        </p>
                      </div>
                      <div className="flight-section__right-section">
                        <div className="right-section__top">
                          <p className="top__departure-code">
                            {flightDetail?.offPoint}
                          </p>
                          &nbsp;
                          <p>
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.CITY_NAME,
                            )}
                          </p>
                          , &nbsp;
                          <p>
                            {" "}
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.COUNTRY_NAME,
                            )}
                          </p>
                        </div>
                        <div className="top__departure-date">
                          <p className="departure-date">
                            {convertDateIntoTicketDownloadFormat(
                              flightDetail?.arrivalDate,
                            )}
                          </p>
                          &nbsp;
                          <p className="depature-time">
                            {" "}
                            {flightDetail?.arrivalTime}
                          </p>
                          <p className="local-time">(Local Time)</p>
                        </div>
                        <p className="airport-name">
                          {checkAiportDetailWithAirportCode(
                            flightDetail?.offPoint,
                            AiportDetailConfigs?.AIRPORT_NAME,
                          )}
                        </p>
                        <p className="departure-terminal">
                          {flightDetail?.arrivalTerminal}
                        </p>
                      </div>
                    </div>
                    <div className="iternary-section__cabin-detail">
                      <div className="cabin-detail__left-section">
                        <p>
                          <strong>
                            {checkFlightClassType(
                              flightDetail?.cabinClass
                                ? flightDetail?.cabinClass?.toUpperCase()
                                : "",
                            )}
                          </strong>
                        </p>
                      </div>
                      <p>
                        Flight Duration:{" "}
                        <strong>
                          {convertTimeToStandardTime(
                            flightDetail?.flightDuration,
                          )}
                        </strong>
                      </p>

                      <div className="cabin-detail__right-section">
                        <div className="right-section__check-in">
                          <p>Check-in: </p>&nbsp;
                          {flightDetail?.baggageInfo ? (
                            <strong>
                              {checkBaggageInfo(
                                flightDetail?.baggageInfo as unknown as BaggageInfo,
                              )}
                            </strong>
                          ) : (
                            <p>N/A</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {flightDetail?.transitTime !== 0 && (
                      <div className="transit-detail">
                        <div className="transit-left-section">
                          <p className="transit-time">
                            {convertTimeToStandardTime(
                              flightDetail?.transitTime,
                            )}
                          </p>
                          &nbsp;
                          <p>transit time in</p>
                          &nbsp;
                          <p className="transit-location">
                            {checkAiportDetailWithAirportCode(
                              flightDetail?.offPoint,
                              AiportDetailConfigs?.CITY_NAME,
                            )}
                          </p>
                        </div>
                        <div className="transit-right-section">
                          <p>Kindly verify with the airline if you need a</p>
                          &nbsp;
                          <p className="transit-visa">Transist Visa</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ))}
              <div className="important-notice">
                <div className="notice-header">
                  <p>IMPORTANT NOTICE</p>
                </div>
                <div className="notice-list">
                  {noticeList?.map((notice, noticeIndex) => (
                    <div key={noticeIndex}>
                      <ul>
                        <li>{notice.list}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {isTheTicketStatusTicketed() && (
              <div
                className="greetings"
                style={{
                  textAlign: "center",
                }}
              >
                <p>HAVE A NICE FLIGHT</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightTicket;
