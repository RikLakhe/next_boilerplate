/* eslint-disable */
// @ts-nocheck

import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Spin } from "antd";
import { PAYMENT_MODE_TYPE, TOP_UP_AMOUNT } from "@/app/constants/ui/app-config";
import { ConnectIpsImage } from "@/app/assets/images";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { ReduxState, topUpAfnuuBalance } from "@/app/redux";
import Image from "next/image";
import { isEmpty } from "@/app/utils/ui";
import { useDispatch, useSelector } from "react-redux";

interface TopupProps {
  openTopupModal: boolean;
  toggleModalView: () => void;
  topUpBalance: string;
  setTopUpBalance: React.Dispatch<React.SetStateAction<string>>;
  topupSubmit: boolean;
  setTopupSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topup: FC<TopupProps> = ({
  openTopupModal,
  toggleModalView,
  topUpBalance,
  setTopUpBalance,
  topupSubmit,
  setTopupSubmit,
}) => {
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();
  const [topUpBalancePartner, setTopUpBalancePartner] =
    useState<boolean>(false);
  const [amountValidationError, setAmountValidationError] =
    useState<boolean>(false);

  const { userTopUpAfnuuBalanceLoading } = useSelector(
    (state: any) => state.userAuth,
  );

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value.replace(/\D/g, "");
    setTopUpBalance(newValue);
    if (newValue >= 10 && newValue <= 50000) {
      setAmountValidationError(false);
    } else {
      setAmountValidationError(true);
    }
  };

  const handleSelectTopUpPartner = () => {
    setTopUpBalancePartner(!topUpBalancePartner);
  };

  const handleTopupSubmit = async () => {
    setTopupSubmit(true);
    if (
      !isEmpty(topUpBalance) &&
      topUpBalancePartner &&
      !amountValidationError
    ) {
      const result = await dispatch(
        topUpAfnuuBalance({
          amount: topUpBalance,
          paymentMode: PAYMENT_MODE_TYPE.CONNECT_IPS,
        }),
      );
      if (result?.status === 200) {
        const connectIpsTokenPayload = result?.data;
        if (connectIpsTokenPayload?.data?.token) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = connectIpsTokenPayload?.data?.actionUrl;
          Object.entries(connectIpsTokenPayload?.data?.data).forEach(
            ([key, value]) => {
              const hiddenField = document.createElement("input");
              hiddenField.type = "hidden";
              hiddenField.name = key;
              hiddenField.value = value as string;
              form.appendChild(hiddenField);
            },
          );

          document.body.appendChild(form);
          form.submit();
        }
      }
    }
  };

  const handleSelectDefaultBalance = (amount) => {
    setAmountValidationError(false);
    setTopUpBalance(amount);
  };

  useEffect(() => {
    handleSelectTopUpPartner();
    return () => {
      setTopUpBalance("");
      setTopupSubmit(false);
    };
  }, []);

  return (
    <Modal
      title="Topup Balance"
      open={openTopupModal}
      onCancel={toggleModalView}
      footer={null}
      closable={true}
      maskClosable={false}
      className="top-up-modal"
    >
      <Spin
        spinning={userTopUpAfnuuBalanceLoading}
        tip={"Processing, Please wait..."}
      >
        <div className="top-up-modal__modal-section">
          <Form
            name="layout-multiple-horizontal"
            layout="vertical"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 25 }}
          >
            <Form.Item
              label="Amount"
              rules={[{ required: true, message: "Please input amount!" }]}
            >
              <Input
                placeholder="Topup Amount"
                className="modal-section__amount-input"
                value={`Rs. ${topUpBalance}`}
                onChange={handleAmountChange}
              />
              {topupSubmit && isEmpty(topUpBalance) && (
                <div className="errors">Enter or select amount</div>
              )}
              {topupSubmit &&
                amountValidationError &&
                !isEmpty(topUpBalance) && (
                  <div className="errors">
                    {topUpBalance < 10
                      ? "Minimum amount must be Rs.10"
                      : "Amount must not exceed Rs.50000"}
                  </div>
                )}
            </Form.Item>
            <div className="modal-section__default-balance">
              {Object.values(TOP_UP_AMOUNT)?.map((amount, index) => (
                <div
                  key={index}
                  className="default-balance__container"
                  onClick={() => handleSelectDefaultBalance(amount)}
                >
                  <div className="container__balance">{amount}</div>
                </div>
              ))}
            </div>
            <div className="modal-section__topup-section">
              <div
                className={
                  topUpBalancePartner
                    ? "topup-section__topup-partner-active"
                    : "topup-section__topup-partner"
                }
              >
                <Image src={ConnectIpsImage} alt={"connect-ips"} />
              </div>
              {topupSubmit && !topUpBalancePartner && (
                <div className="errors">Choose payment method</div>
              )}
            </div>
          </Form>
        </div>
        <Button className="btn-primary" onClick={handleTopupSubmit}>
          Proceed
        </Button>
      </Spin>
    </Modal>
  );
};

export default Topup;
