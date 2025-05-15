import React from "react";
import { Layout, theme, Button } from "antd";
import { disableAdminMode } from "@/app/utils";
import TitleBanner from "../shared/TitleBanner";

const { Header } = Layout;

const AdminHeader: React.FC = () => {
  const {
    token: { colorBgSpotlight },
  } = theme.useToken();

  return (
    <Header
      style={{
        background: colorBgSpotlight,
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >
      <TitleBanner
        title="Administration"
        buttons={
          <Button
            type="dashed"
            onClick={() => {
              disableAdminMode();
            }}
            style={{ marginRight: "16px" }}
          >
            Exit Admin Mode
          </Button>
        }
      />
    </Header>
  );
};

export default AdminHeader;
