import React from "react";
import { Layout, theme } from "antd";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Footer style={{ textAlign: "center", background: colorBgContainer }}>
      LakheCompany ©{new Date().getFullYear()}. All Rights Reserved.
    </Footer>
  );
};

export default AppFooter;
