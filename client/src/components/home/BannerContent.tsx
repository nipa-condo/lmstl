import React from "react";
import { Image, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { HomePhoto } from "../../assets/images";

interface BannerContentProps {
  data: any;
}
const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export const BannerContent: React.FC<BannerContentProps> = (
  props: BannerContentProps
) => {
  const { t } = useTranslation();
  const { data } = props;

  return (
    <div
      className="content-container"
      style={{
        background: "#f3f4f6",
      }}
    >
      <div className="content-inner" style={{ flexDirection: "column" }}>
        <Image
          src={data.home_photo_url}
          preview={false}
          style={{
            backgroundSize: "cover",
          }}
        />
      </div>
    </div>
  );
};
