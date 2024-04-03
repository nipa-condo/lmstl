import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Layout, Space, Typography, Image, Row, Col } from "antd";
import { FacebookFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { LineColor } from "../../assets/images";
import { AuthContext } from "../contexts/AuthContext";
import { InfoContent } from "../home";

export const Footer: React.FC<{}> = () => {
  const { Footer } = Layout;
  const { Text } = Typography;
  const { setting } = useContext(AuthContext);
  const { t } = useTranslation();
  return (
    <Footer
      className="app-footer"
      style={{ borderTop: "solid 5px #efac02", background: "#24292E" }}
    >
      <div className="app-footer-inner">
        <InfoContent data={setting} />
        <Row gutter={12} style={{ margin: "20px 0px 20px 0px" }}>
          <Col>
            <a href={setting.facebook} target="_blank">
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "#f3f4f6",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                }}
              >
                <FacebookFilled style={{ fontSize: "24px" }} />
              </div>
            </a>
          </Col>
          <Col>
            <a href={setting.line} target="_blank">
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "#f3f4f6",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                  paddingTop: "5px",
                }}
              >
                <Image
                  preview={false}
                  src={LineColor}
                  width="24px"
                  style={{ paddingBottom: "4px" }}
                />
              </div>
            </a>
          </Col>
        </Row>

        <Text style={{ color: "#efac02", fontWeight: 700 }}>
          {setting.copyright}
        </Text>
      </div>
    </Footer>
  );
};
