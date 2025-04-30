/* eslint-disable */
// @ts-nocheck

import "reflect-metadata";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { ConfigProvider, theme, type ThemeConfig } from 'antd';

import { Providers } from "@/app/redux/providers";

const antdtheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    fontSize: 16,
    colorPrimary: '#52c41a',
  },
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loader = document.getElementById("globalLoader");
      if (loader) loader.remove();
    }
  }, []);

  return (
    <div>
      <Providers>
        <Head>
          <title>AricaHRIS</title>
        </Head>
        <ConfigProvider theme={antdtheme}>
          <Component {...pageProps} />
        </ConfigProvider>
      </Providers>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "custom-toast",
          duration: 2000,
        }}
      />
    </div>
  );
}
