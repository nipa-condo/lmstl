import React from "react";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { ButtonSelected } from "../common";

interface HeaderContentProps {
  data: any;
  showSeeMore?: boolean;
}

export const HeaderContent: React.FC<HeaderContentProps> = (
  props: HeaderContentProps
) => {
  const { t } = useTranslation();
  const { data } = props;
  const { Title, Text } = Typography;
  return (
    <Row justify="space-between" style={{ marginTop: "3rem" }}>
      <Col xs={24} sm={24} md={10} lg={10}>
        <Title className="title-margin" level={2}>
          {data.home_title}
        </Title>
        <Text>{data.home_subtitle}</Text>
      </Col>
      {props?.showSeeMore && (
        <Col style={{ alignSelf: "end", marginTop: "1rem" }}>
          <ButtonSelected label={t("see_more")} path={`/lessions`} />
        </Col>
      )}
    </Row>
  );
};
