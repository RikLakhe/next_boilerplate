/* eslint-disable */
// @ts-nocheck

import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectOnUnwantedQueryParams = () => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    // List of unwanted query parameters
    // fbclid: Facebook Click Identifier, added when users click on links from Facebook.
    // gclid: Google Click Identifier, added when users click on ads in Google Ads.
    // igshid: Instagram share identifier, often added when links are shared via Instagram.
    const unwantedParams = ["fbclid", "gclid", "igshid"];

    const hasUnwantedParams = Object.keys(query).some((param) =>
      unwantedParams.includes(param),
    );

    if (hasUnwantedParams) {
      router.push("/");
    }
  }, [query, router]);

  return null;
};

export default RedirectOnUnwantedQueryParams;
