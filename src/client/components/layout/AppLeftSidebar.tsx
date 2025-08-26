import React from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { MENU_CONFIG } from "@/client/config/menu";
import { AppMenuInterface } from "@/types/menu";

const { Sider } = Layout;

const AppLeftSidebar: React.FC<{
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}> = ({ collapsed, onCollapse }) => {
  const router = useRouter();

  const renderMenuItems = (items: AppMenuInterface[]) => {
    return items.map((item) => {
      if (item.key.includes("divider")) {
        return <Menu.Divider key={item.key} />;
      }

      if (item.subMenu) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.subMenu)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.key}
          icon={item.icon}
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
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
        scrollbarWidth: "thin",
        scrollbarGutter: "stable",
      }}
    >
      <Menu theme="dark" mode="inline">
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
            cursor: "pointer",
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            router.push("/");
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              router.push("/");
            }
          }}
        >
          ARICA-HR
        </div>
        <Menu.Divider />
        {renderMenuItems(MENU_CONFIG)}
      </Menu>
    </Sider>
  );
};

export default AppLeftSidebar;
