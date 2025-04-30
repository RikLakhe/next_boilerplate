/* eslint-disable */
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import GlobalHeader from "../Headers/globalHeader";

const LayoutHeader = () => {
  const { scrollY } = useSelector((state: any) => state.userAuth);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const router = useRouter();
  const scrollUpRef = useRef(false);

  useEffect(() => {
    if (scrollY < lastScrollPosition && scrollY > 0) {
      scrollUpRef.current = true;
    } else {
      scrollUpRef.current = false;
    }
    setLastScrollPosition(scrollY);
  }, [scrollY]);

  return (
    <div>
      {router.pathname === "/" ? (
        <>
          <div
            style={{
              position: "static",
              top: 0,
              zIndex: "9999",
              opacity: `${scrollY === 0 && "1"}`,
              width: "100% !important",
              transition: "opacity 1s ease-in-out",
              transitionDelay: "0.2s",
            }}
          >
            <GlobalHeader />
          </div>

          <div
            style={{
              position: `${scrollUpRef.current ? "absolute" : "absolute"}`,
              top: `${scrollUpRef.current ? "0px" : "-100px"}`,
              width: "100%",
              zIndex: "9999",
              transition: "top 0.5s",
            }}
          >
            <GlobalHeader />
          </div>
        </>
      ) : (
        <div
          style={{
            position: "sticky",
            left: 0,
            top: 0,
            zIndex: "9",
            width: "100% !important",
          }}
        >
          <GlobalHeader />
        </div>
      )}
    </div>
  );
};

export default LayoutHeader;
