import React from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { ADMIN_MENU_CONFIG } from "@/client/config/menu";
import { AdminMenuInterface } from "@/types/menu";
import { LogoutOutlined } from "@ant-design/icons";
import { disableAdminMode } from "@/client/utils";

const { Sider } = Layout;

const AdminLeftSidebar: React.FC<{
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}> = ({ collapsed, onCollapse }) => {
  const router = useRouter();

  const renderMenuItems = (items: AdminMenuInterface[]) => {
    return items.map((item) => {
      if (item.key.includes("divider")) {
        return <Menu.Divider key={item.key} />;
      }

      if (item.subMenu) {
        return (
          <Menu.SubMenu key={item.key} title={item.label}>
            {renderMenuItems(item.subMenu)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.key}
          onClick={() => {
            return router.push(item.path!);
          }}
        >
          {item.label}
        </Menu.Item>
      );
    });
  };

  return (
    <Sider
      // collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        overflow: "auto",
        height: "90vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: "thin",
        scrollbarGutter: "stable",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <Menu mode="inline">
        <div
          className="logo"
          style={{
            height: "32px",
            margin: "16px",
            borderRadius: "4px",
            textAlign: "center",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            lineHeight: "32px",
            background: "rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            router.push("/admin");
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              router.push("/admin");
            }
          }}
        >
          ARICA-HR
        </div>
        <Menu.Divider />
        {renderMenuItems(ADMIN_MENU_CONFIG)}
        <Menu.Divider />
        <Menu.Item
          key="exitAdmin"
          icon={<LogoutOutlined />}
          onClick={() => {
            disableAdminMode();
          }}
        >
          Exit Admin Mode
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminLeftSidebar;
