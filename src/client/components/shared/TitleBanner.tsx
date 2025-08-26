import React, { ReactNode } from "react";
import { Typography } from "antd";

const { Title } = Typography;

interface TitleBannerProps {
  title: string;
  subTitle?: string;
  buttons?: ReactNode;
}

const TitleBanner: React.FC<TitleBannerProps> = ({
  title,
  subTitle,
  buttons,
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div>
        <Title level={2} style={{ margin: 0 }}>
          {title}
        </Title>
        {subTitle && (
          <Title level={5} style={{ margin: 0 }}>
            {subTitle}
          </Title>
        )}
      </div>
      {buttons && (
        <div style={{ display: "flex", gap: "0.5rem" }}>{buttons}</div>
      )}
    </div>
  );
};

export const AdminTitleBanner: React.FC<TitleBannerProps> = ({
  title,
  subTitle,
  buttons,
}) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div>
        <Title level={2} style={{ margin: 0 }}>
          {title}
        </Title>
        {subTitle && (
          <Title level={5} style={{ margin: 0 }}>
            {subTitle}
          </Title>
        )}
      </div>
      {buttons && (
        <div style={{ display: "flex", gap: "0.5rem" }}>{buttons}</div>
      )}
    </div>
  );
};

export default TitleBanner;
