/* eslint-disable */
// @ts-nocheck

import { LoadingOutlined } from "@ant-design/icons";

export const CustomLoader = () => {
  return (
    <div className="loader">
      <div className="loader_items">
        <LoadingOutlined
          style={{
            fontSize: "36px",
          }}
        />{" "}
        <p style={{ fontSize: "20px" }}> Loading ...</p>
      </div>
    </div>
  );
};
