import MainBody from "@/components/Layout/main-body";
import MainFooter from "@/components/Layout/main-footer";
import MainHeader from "@/components/Layout/main-header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainHeader />
      <MainBody>
        <Component {...pageProps} />
      </MainBody>
      <MainFooter />
    </>
  );
}
