import React from "react";
import { Layout, Dropdown, Avatar } from "antd";
import {
  BellOutlined,
  UserOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

import { enableAdminMode } from "@/client/utils";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const router = useRouter();

  const userMenuItems = [
    {
      key: "1",
      label: <div>View Profile</div>,
      onClick: () => {
        router.push("/profile");
      },
    },
    {
      key: "2",
      label: <div>Switch to Admin</div>,
      onClick: () => {
        enableAdminMode();
      },
    },
    {
      key: "5",
      label: <div>Logout</div>,
      onClick: () => {
        signOut({ callbackUrl: "/" });
      },
    },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 16px",
      }}
    >
      <SnippetsOutlined
        style={{ fontSize: "18px", marginRight: "16px", cursor: "pointer" }}
        onClick={() => {
          router.push("/tasks");
        }}
      />
      <BellOutlined
        style={{ fontSize: "18px", marginRight: "16px", cursor: "pointer" }}
        onClick={() => {
          router.push("/notifications");
        }}
      />
      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
        <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
