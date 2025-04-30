/* eslint-disable */
// @ts-nocheck

import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import globalHeaderClass from "./globalHeader.module.css";

import { AfnuuIcon } from "@/app/assets/images";
import AuthorizedHeader from "./authorizedHeader";
import { isUserAuthenticated } from "@/app/utils/ui/commonUtils";
import { getLocalStorage } from "@/app/utils/ui";
import { appConfig } from "@/app/constants/ui/app-config";
import AuthorizedHeaderForMobileView from "./authorizedHeaderForMobile";

function GlobalHeader() {
  const router = useRouter();
  const [viewLogo, setViewLogo] = useState(false);

  useEffect(() => {
    if (router.query.from || router.query.to || router.query.traveller) {
      setViewLogo(true);
    } else {
      setViewLogo(false);
    }
  }, [router.query]);

  return (
    <div className={globalHeaderClass.global_header}>
      {isUserAuthenticated() ? (
        <div style={{ background: "white" }}>
          <AuthorizedHeader />
          <AuthorizedHeaderForMobileView />
        </div>
      ) : (
        <div className={globalHeaderClass.btn_section}>
          <div className={globalHeaderClass.logo_show}>
            <Image
              className={globalHeaderClass.logo_only}
              src={AfnuuIcon}
              alt="Company logo"
              height={31}
              onClick={() => {
                router.push("/");
              }}
            />
          </div>
          <Button
            className="btn-borderless btn-custom"
            onClick={() => router.push("/auth/login")}
          >
            Register
          </Button>
          <Button
            className="btn-borderless btn-custom"
            onClick={() => router.push("/auth/login")}
          >
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
}

export default GlobalHeader;
