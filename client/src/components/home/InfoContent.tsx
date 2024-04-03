import React from "react";
import { Col, Row, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";

import {
  PhoneOutlined,
  PushpinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { ChatBot } from "../common/ChatBot";

interface InfoContentProps {
  data: any;
}

export const InfoContent: React.FC<InfoContentProps> = (
  props: InfoContentProps
) => {
  const { t } = useTranslation();
  const { data } = props;
  const { Title, Text } = Typography;
  const [openMessage, setOpenMessage] = React.useState<boolean>(false);

  return (
    <Row>
      <Col xs={24} sm={24} md={10} lg={6}>
        <Row justify="space-between">
          <Title level={4} style={{ color: "#f3f4f6" }}>
            {t("get_in_touch")}{" "}
          </Title>
        </Row>
        <div>
          <Space>
            <PhoneOutlined style={{ color: "#f3f4f6", fontSize: "18px" }} />
            <Text style={{ color: "#f3f4f6", fontWeight: 700 }}>
              {data?.phone}
            </Text>
          </Space>
        </div>
        <div>
          <Space>
            <PushpinOutlined style={{ color: "#f3f4f6", fontSize: "18px" }} />
            <Text style={{ color: "#f3f4f6", fontWeight: 700 }}>
              {data?.location}
            </Text>
          </Space>
        </div>
        <div>
          <Space>
            <MailOutlined style={{ color: "#f3f4f6", fontSize: "18px" }} />

            <Text style={{ color: "#f3f4f6", fontWeight: 700 }}>
              {data?.email}
            </Text>
          </Space>
        </div>
      </Col>
      <Col xs={24} sm={24} md={14} lg={18} style={{ textAlign: "end" }}>
        {openMessage ? (
          <ChatBot onClose={() => setOpenMessage(false)} />
        ) : (
          <div
            style={{
              padding: "10px",
              background: "#fff",
              borderColor: "#000",
              borderStyle: "solid",
              borderWidth: "1px",
              borderRadius: "50px",
              position: "fixed",
              zIndex: 2,
              bottom: "2%",
              right: "2%",
              cursor: "pointer",
            }}
            onClick={() => setOpenMessage(true)}
          >
            <MessageOutlined style={{ fontSize: "30px" }} />
          </div>
        )}
      </Col>
    </Row>
  );
};
