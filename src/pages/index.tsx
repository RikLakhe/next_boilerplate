/* eslint-disable */
// @ts-nocheck

import React from "react";
import AuthorizedLayout from "@/app/ui/Layout/AuthorizedLayout";
import RedirectOnUnwantedQueryParams from "@/app/Hooks/useRedirectOnUnwantedQueryParams";
import { Button, Input, Space } from "antd";

function Home() {
  return (
    <div>
      <RedirectOnUnwantedQueryParams />
      <Space>
        <Input placeholder="Please Input" />
        <Button type="primary">Submit</Button>
      </Space>
    </div>
  );
}

export default Home
