import React from "react";
import { Layout, theme } from "antd";

const { Footer } = Layout;

const AdminFooter: React.FC = () => {
  const {
    token: { colorBgSpotlight },
  } = theme.useToken();

  return (
    <Footer style={{ textAlign: "center", background: colorBgSpotlight }}>
      LakheCompany ©{new Date().getFullYear()}. All Rights Reserved.
    </Footer>
  );
};

export default AdminFooter;
