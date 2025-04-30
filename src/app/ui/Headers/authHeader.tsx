/* eslint-disable */
// @ts-nocheck

import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import authHeaderClass from "./authHeader.module.css";

import { AfnuuIcon } from "@/app/assets/images";
import { WARNING_MESSAGE } from "@/app/constants/ui/app-config";

function AuthHeader() {
  const router = useRouter();

  return (
    <div className={authHeaderClass.authHeader}>
      <div className={authHeaderClass.authHeader_logo}>
        <Image
          className={authHeaderClass.authHeader_logo_only}
          src={AfnuuIcon}
          alt="Company logo"
          height={31}
          onClick={() => {
            if (
              router.pathname === "/flightPayment" ||
              router.pathname === "/flightTicket"
            ) {
              const okay = confirm(WARNING_MESSAGE);
              if (okay) {
                router.push("/");
              } else {
                return;
              }
            }
            router.push("/");
          }}
        />
      </div>
      <div className={authHeaderClass.authHeader_bottom_section}></div>
    </div>
  );
}

export default AuthHeader;
