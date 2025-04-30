/* eslint-disable */
// @ts-nocheck

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import {
  clearLocalStorage,
  formatUnixTimeCountdown,
  getLocalStorage,
} from "@/app/utils/ui";
import { OTP } from "@/app/constants/ui/app-config";

const RenderCountdownTimer: FC<{
  resendCounter: number;
  setResendInviteCounter?: Dispatch<SetStateAction<number>>;
  setIsTimerRunning?: Dispatch<SetStateAction<boolean>>;
}> = ({ resendCounter, setResendInviteCounter, setIsTimerRunning }) => {
  const [remainingTimeStamp, setRemainingTimeStamp] = useState<number | null>(
    null,
  );
  const countDownTimerFromStorage = getLocalStorage(OTP.NAME);

  useEffect(() => {
    const endTime = Number(countDownTimerFromStorage) * 1000;
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;
    setIsTimerRunning(true);
    if (remainingTime <= 0) {
      setRemainingTimeStamp(null);
      setResendInviteCounter(1);
      setIsTimerRunning(false);
    } else {
      const interval = setInterval(() => {
        const newRemainingTime = endTime - Date.now();
        if (newRemainingTime <= 0) {
          setRemainingTimeStamp(null);
          setResendInviteCounter(1);
          setIsTimerRunning(false);
          clearLocalStorage(OTP.NAME);
          clearInterval(interval);
        } else {
          setRemainingTimeStamp(newRemainingTime);
          setResendInviteCounter(0);
          setIsTimerRunning(true);
        }
      }, 1000);
      setResendInviteCounter(0);

      return () => {
        clearInterval(interval);
      };
    }
  }, [resendCounter]);

  return (
    <>
      {(resendCounter > 0 || !!countDownTimerFromStorage) && (
        <div>
          Time Remaining : {formatUnixTimeCountdown(remainingTimeStamp)}
        </div>
      )}
    </>
  );
};

export default RenderCountdownTimer;
