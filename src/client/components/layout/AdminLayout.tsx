import React, { useState } from "react";
import { Layout, theme } from "antd";
import { motion } from "framer-motion";

import AdminLeftSidebar from "./AdminLeftSidebar";
import AdminFooter from "./AdminFooter";

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  const {
    token: { colorBgSpotlight },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <AdminLeftSidebar
          collapsed={leftSidebarCollapsed}
          onCollapse={setLeftSidebarCollapsed}
        />
        <Content
          style={{
            background: colorBgSpotlight,
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
              minHeight: "95vh",
            }}
          >
            {children}
          </motion.div>
          <AdminFooter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
