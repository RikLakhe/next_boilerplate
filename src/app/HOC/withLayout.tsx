/* eslint-disable */
// @ts-nocheck

import React from "react";
import { ConfigProvider } from "antd";

interface withLayoutOptions {
  Layout: React.ComponentType<{ children: React.ReactNode }>;
}

const withLayout = (
  WrappedComponent: React.FC<{}> | any,
  options?: withLayoutOptions,
) => {
  const { Layout } = options ?? {};

  return function WrappedComponentFunction(props: object) {
    if (Layout) {
      return (
        <ConfigProvider
          theme={{
            token: {
              fontFamily: `-apple-system, 'Quicksand', BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
            },
          }}
        >
          <Layout>
            <WrappedComponent {...props} />
          </Layout>
        </ConfigProvider>
      );
    }
    return <WrappedComponent {...props} />;
  };
};

export default withLayout;
