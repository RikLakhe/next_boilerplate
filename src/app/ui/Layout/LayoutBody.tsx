/* eslint-disable */
// @ts-nocheck

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import React, { createContext, useContext, useRef, useEffect } from "react";

import { extraConfig } from "@/app/constants/ui/app-config";
import { getScrollPosition, ReduxState } from "@/app/redux";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

const ScrollRefContext = createContext<React.RefObject<HTMLDivElement> | null>(
  null,
);

export const useScrollRef = () => useContext(ScrollRefContext);

const LayoutBody: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const isProfileSectionPath =
    router.pathname.split("/")[1] === extraConfig.ACCOUNT;

  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch: ThunkDispatch<ReduxState, null, Action> = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        dispatch(getScrollPosition(ref.current.scrollTop));
      }
    };

    if (ref.current) {
      ref.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <ScrollRefContext.Provider value={ref?.current}>
      <div
        className="site-layout"
        ref={ref}
        style={{
          zIndex: "1",
          overflowX: "hidden",
          height: isProfileSectionPath ? "" : "100dvh",
        }}
      >
        <div>{children}</div>
      </div>
    </ScrollRefContext.Provider>
  );
};

export default LayoutBody;
