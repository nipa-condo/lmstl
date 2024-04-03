import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Layout, Space, Typography, Image } from "antd";
import { FacebookFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { LineColor } from "../../assets/images";
import { AuthContext } from "../contexts/AuthContext";

export const AdminFooter: React.FC<{}> = () => {
  const { Footer } = Layout;
  const { Text } = Typography;
  const { t } = useTranslation();
  const { setting } = useContext(AuthContext);

  return (
    <Footer className="app-footer">
      <div
        className="app-footer-inner"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Text style={{ color: "#737373", fontWeight: 700 }}>
          {setting.copyright}
        </Text>
        <Space size="middle">
          <a href={setting.facebook} target="_blank">
            <FacebookFilled style={{ fontSize: "24px" }} />
          </a>
          <a href={setting.line} target="_blank">
            <Image
              preview={false}
              src={LineColor}
              width="24px"
              style={{ paddingBottom: "4px" }}
            />
          </a>
        </Space>
      </div>
    </Footer>
  );
};
