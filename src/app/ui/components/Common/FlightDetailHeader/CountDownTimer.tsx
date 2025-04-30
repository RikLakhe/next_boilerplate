/* eslint-disable */
// @ts-nocheck

import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";
import { Button, CountdownProps, Modal, Statistic } from "antd";

import { appConfig, PNR_SESSION_TIME } from "@/app/constants/ui/app-config";
import {
  clearLocalStorage,
  deadlineTime,
  getLocalStorage,
  setLocalStorage,
  signoutBySessionId,
} from "@/app/utils/ui";
import { FlightDetailHeaderProps } from "@/app/ui/components/Common/FlightDetailHeader";

const CountDownTimer: FC<FlightDetailHeaderProps> = ({ setSavedChanged }) => {
  const { Countdown } = Statistic;
  const [openModalView, setOpenModalView] = useState<boolean>(false);
  const router = useRouter();

  const sessionTimer = getLocalStorage(PNR_SESSION_TIME);
  const onChange: CountdownProps["onChange"] = useMemo(
    () => (val) => {
      setLocalStorage(PNR_SESSION_TIME, JSON.stringify(val));
    },
    [sessionTimer],
  );

  const getDeadLineTime = deadlineTime(sessionTimer);

  const handleFinish = () => {
    toggleModalView();
  };
  const toggleModalView = () => {
    setOpenModalView((prev) => !prev);
  };
  const handleRedirectToHome = () => {
    let formData = { id: "" };
    formData.id = getLocalStorage(appConfig?.PNR_SESSION_ID);
    signoutBySessionId(formData);
    clearLocalStorage(appConfig?.PNR_SESSION_ID);
    if (setSavedChanged) {
      setSavedChanged(false);
    }
    router.push("/");
  };

  return (
    <div>
      <div className="booking-timer">
        <p>Booking Time : </p> &nbsp;
        <Countdown
          value={getDeadLineTime}
          onFinish={handleFinish}
          format="mm:ss"
          onChange={onChange}
        />
      </div>

      <Modal
        title="Session Timer has ended."
        open={openModalView}
        onCancel={toggleModalView}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <p> You will be redirected to the home page.</p>
        <Button className="btn-primary" onClick={handleRedirectToHome}>
          Go to Home
        </Button>
      </Modal>
    </div>
  );
};

export default CountDownTimer;
