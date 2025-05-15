import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__container">
        <header className="auth-layout__header">
          <h1>Welcome</h1>
        </header>
        <main className="auth-layout__content">{children}</main>
      </div>
    </div>
  );
};

export default AuthLayout;
