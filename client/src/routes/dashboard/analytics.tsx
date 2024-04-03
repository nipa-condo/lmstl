import { Button, Col, Row, Space, Image, Spin } from "antd";
import { LessionResultTable } from "../../components/dashboard/analytic";
import * as API from "../../api";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import React from "react";
import Sort from "../../assets/images/sort.png";

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const query = url.searchParams;
  const param = Object.fromEntries(query);
  try {
    const analytics = await API.getAnalytics(param);

    return { analytics: analytics.data.data };
  } catch (error) {
    return { analytics: { data: [] } };
  }
}

export const Analytics = () => {
  const { analytics } = useLoaderData() as any;
  const navigate = useNavigate();
  const { state } = useNavigation();
  const [sorting, setSorting] = React.useState(true);

  const toggleSorting = () => {
    setSorting(!sorting);
    navigate(`?sort_by=created_at&sort=${!sorting ? "ASC" : "DESC"}`);
  };

  return (
    <Col>
      <Row justify="end">
        <Col
          style={{ display: "flex", alignSelf: "center", marginTop: "20px" }}
        >
          <Space direction="horizontal">
            <Button
              type="default"
              onClick={toggleSorting}
              icon={<Image src={Sort} preview={false} width={20} />}
            />
          </Space>
        </Col>
      </Row>

      <Spin spinning={state === "loading"}>
        {state != "loading" && <LessionResultTable data={analytics.result} />}
      </Spin>
    </Col>
  );
};
