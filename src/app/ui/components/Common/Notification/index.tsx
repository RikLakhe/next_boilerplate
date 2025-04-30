/* eslint-disable */
// @ts-nocheck

import { notification } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";

const CustomNotification = (
  type: NotificationType,
  message: string,
  description?: string,
  placement?:
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | undefined,
) => {
  notification[type]({
    message: message,
    description: description,
    placement: placement,
  });
};

export default CustomNotification;
