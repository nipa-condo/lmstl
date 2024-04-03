import { Col, Row, Button, Typography, Spin, Space, Image } from "antd";
import { useTranslation } from "react-i18next";
import {
  Link,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { LessionGridBox } from "../../../components/common";
import Sort from "../../../assets/images/sort.png";

import * as API from "../../../api";
import React from "react";

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const query = url.searchParams;
  const param = Object.fromEntries(query);

  try {
    const lessions = await API.getLessions(param);
    return { lessions: lessions.data.data };
  } catch (error) {
    return { lessions: { data: [] } };
  }
}

export const LessionsAdminIndex = () => {
  const { lessions } = useLoaderData() as any;
  const { t } = useTranslation();
  const { state } = useNavigation();
  const navigate = useNavigate();

  const [sorting, setSorting] = React.useState(true);

  const toggleSorting = () => {
    setSorting(!sorting);
    navigate(`?sort_by=created_at&sort=${!sorting ? "ASC" : "DESC"}`);
  };

  const { Title } = Typography;
  return (
    <Col>
      <Row justify="space-between">
        <Col>
          <Title level={3}> {t("all_lessions")}</Title>
        </Col>
        <Col style={{ display: "flex", alignSelf: "center" }}>
          <Space direction="horizontal">
            <Button
              type="default"
              onClick={toggleSorting}
              icon={<Image src={Sort} preview={false} width={20} />}
            />

            <Link to="new">
              <Button type="primary">{t("add_lession")}</Button>
            </Link>
          </Space>
        </Col>
      </Row>

      <Spin spinning={state === "loading"}>
        {state != "loading" && (
          <LessionGridBox data={lessions} isAdmin={true} />
        )}
      </Spin>
    </Col>
  );
};
