/* eslint-disable */
// @ts-nocheck

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { WARNING_MESSAGE } from "@/app/constants/ui/app-config";

interface BackButtonRedirectProps {
  redirectPath: string;
}

const BackButtonRedirect: FC<BackButtonRedirectProps> = ({ redirectPath }) => {
  const router = useRouter();
  const [isBackNavigation, setIsBackNavigation] = useState(true);
  const handleBackButton = (event: Event) => {
    event.preventDefault();
    if (isBackNavigation) {
      const confirmLeave = window.confirm(WARNING_MESSAGE);
      if (confirmLeave) {
        router.push(redirectPath).then((res) => {
          setIsBackNavigation(!res);
        });
      } else {
        setIsBackNavigation(false);
      }
    }
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [router, redirectPath]);

  return null;
};

export default BackButtonRedirect;
