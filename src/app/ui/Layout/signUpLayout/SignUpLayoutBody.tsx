/* eslint-disable */
// @ts-nocheck

import { Layout } from "antd";
import React from "react";

const { Content } = Layout;

const SignUpLayoutBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      className="site-layout"
      style={{
        padding: "80px 50px",
        display: "flex",
        justifyContent: "center",
        minHeight: "72vh",
        zIndex: "1",
      }}
    >
      <div
        style={{
          padding: 24,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SignUpLayoutBody;
