/* eslint-disable */
// @ts-nocheck

import Router from "next/router";
import { useEffect } from "react";

import { clearLocalStorage } from "@/app/utils/ui";
import { appConfig, PNR_SESSION_TIME } from "@/app/constants/ui/app-config";

export const useSaveChanges = (
  unsavedChanges: boolean,
  callback: () => boolean,
) => {
  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = (url: string) => {
        const ok = callback();
        if (!ok) {
          Router.events.emit("routeChangeError");
          throw "Abort route change.";
        }
      };

      Router.events.on("routeChangeStart", routeChangeStart);

      return () => {
        clearLocalStorage(PNR_SESSION_TIME);
        clearLocalStorage(appConfig?.FLIGHT_DETAILS_FROM_DASHBOARD);
        Router.events.off("routeChangeStart", routeChangeStart);
      };
    }
  }, [unsavedChanges]);
};
