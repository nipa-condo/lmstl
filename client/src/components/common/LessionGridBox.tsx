import React from "react";
import { Col, Row, Typography, Tag, Empty, Button, Image } from "antd";
import { useTranslation } from "react-i18next";

import { ButtonSelected } from "./ButtonSelected";
import { Link } from "react-router-dom";

interface LessionGridBoxProps {
  data: any;
  isAdmin?: boolean;
}
//fix me
const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export const LessionGridBox: React.FC<LessionGridBoxProps> = (
  props: LessionGridBoxProps
) => {
  const { t } = useTranslation();
  const { data, isAdmin } = props;
  const { Title, Text } = Typography;

  return (
    <Row
      gutter={[
        { xs: 8, sm: 16, md: 24, lg: 32 },
        { xs: 8, sm: 16, md: 24, lg: 32 },
      ]}
      style={{ marginTop: "20px" }}
    >
      {data?.length ? (
        data.map((data: any) => (
          <Col key={data.id} xs={24} sm={24} md={12} lg={8}>
            <div className="lession-container">
              <div className="lession-image-container">
                <Image
                  src={data.thumbnail_url}
                  preview={false}
                  style={{
                    backgroundSize: "cover",
                  }}
                ></Image>
              </div>
              <div style={{ padding: "12px" }}>
                <Title level={5}>{data.title}</Title>
                <div style={{ maxHeight: "100px", overflow: "hidden" }}>
                  <Text style={{ color: "#737373" }}>{data.subTitle}</Text>
                </div>
                <Row style={{ marginTop: "12px" }}>
                  <ButtonSelected
                    label={isAdmin ? t("edit") : t("learn_more")}
                    path={
                      isAdmin
                        ? `/dashboard/lessions/${data.id}/edit`
                        : `/lessions/${data.id}`
                    }
                  />
                </Row>
              </div>
            </div>
          </Col>
        ))
      ) : (
        <>
          {isAdmin ? (
            <Empty
              imageStyle={{ height: 60 }}
              description={<span>No lession to show</span>}
            >
              <Link to="/dashboard/lessions/new">
                <Button type="primary">Create Lession</Button>
              </Link>
            </Empty>
          ) : (
            <Empty />
          )}
        </>
      )}
    </Row>
  );
};
