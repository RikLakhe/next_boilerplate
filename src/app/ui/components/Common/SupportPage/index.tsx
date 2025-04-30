import { FC } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";
import { ExclamationCircleOutlined } from "@ant-design/icons";

type RenderButton = {
  shouldRenderButton: "required";
  buttonLabel: string;
  buttonUrl: string;
};
type RenderButtonFalse = {
  shouldRenderButton: "notRequired";
  buttonLabel?: string;
  buttonUrl?: string;
};

const SupportPage: FC<RenderButton | RenderButtonFalse> = ({
  shouldRenderButton,
  buttonLabel,
  buttonUrl,
}) => {
  const router = useRouter();
  return (
    <div className="support-page">
      <ExclamationCircleOutlined
        style={{ fontSize: "60px" }}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      <h1>Oops! Something went wrong.</h1>
      <p>Please contact customer support for help.</p>
      {shouldRenderButton === "required" && (
        <Button
          className="btn-primary"
          onClick={() => {
            router.push(`${buttonUrl}`);
          }}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default SupportPage;
