import React, { useState } from "react";
import { Layout, theme } from "antd";
import { motion } from "framer-motion";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import AppLeftSidebar from "./AppLeftSidebar";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <AppLeftSidebar
        collapsed={leftSidebarCollapsed}
        onCollapse={setLeftSidebarCollapsed}
      />
      <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />

        <Content
          style={{
            background: colorBgContainer,
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 0, y: -200 },
              enter: { opacity: 1, x: 0, y: 0 },
              exit: { opacity: 0, x: 0, y: +200 },
            }}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ type: "tween" }} // Set the transition to linear
            style={{
              padding: 10,
              minHeight: 380,
            }}
          >
            {children}
          </motion.div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
