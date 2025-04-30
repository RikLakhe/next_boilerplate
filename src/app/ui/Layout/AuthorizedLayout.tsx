import React from "react";

import LayoutHeader from "./LayoutHeader";
import LayoutBody from "./LayoutBody";

type AuthorizedLayoutProps = {
  children?: React.ReactNode;
};

const AuthorizedLayout: React.FC<AuthorizedLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <LayoutBody>
        <LayoutHeader />
        {children}
      </LayoutBody>
    </div>
  );
};

export default AuthorizedLayout;
