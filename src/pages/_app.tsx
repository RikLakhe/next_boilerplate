import "@/app/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ConfigProvider, Spin, theme } from "antd";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { AppStore } from "@/app/store";

const { darkAlgorithm } = theme;

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (router.asPath !== url) {
        setLoading(true);
      }
    };
    const handleComplete = () => {
      return setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const getLayout =
    Component.getLayout ??
    ((page) => {
      return page;
    });

  return (
    <SessionProvider session={session}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#7c3aed",
            wireframe: false,
          },
          algorithm: darkAlgorithm,
        }}
      >
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.2)",
              zIndex: 9999,
            }}
          >
            <Spin size="large" />
          </div>
        )}
        <Provider store={AppStore}>
          {getLayout(<Component {...pageProps} />)}
        </Provider>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default App;
