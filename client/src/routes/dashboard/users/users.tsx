import { Button, Col, Row, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { SaveOutlined, UserOutlined } from "@ant-design/icons";
import { UserTable } from "../../../components/dashboard/users/UserTable";
import { Link, useLoaderData } from "react-router-dom";

import * as API from "../../../api";

export async function loader() {
  const lessions = await API.getStudents();

  return { users: lessions.data.data };
}

export const UsersAdminIndex = () => {
  const { t } = useTranslation();
  const { users } = useLoaderData() as any;

  const { Title } = Typography;

  const onChange = ({ pagination, filters, sorter, extra }: any) => {};

  const dataFormat = users.filter((data: any) => data.id != 1);

  return (
    <div
      style={{
        paddingTop: "30px",
      }}
    >
      <Row justify="space-between" style={{ width: "100%" }}>
        <Col>
          <Title level={2}>{t("Students")}</Title>
        </Col>
        <Col>
          <Link to="new">
            <Button type="primary" icon={<UserOutlined />}>
              {t("Add student")}
            </Button>
          </Link>
        </Col>
      </Row>

      <UserTable data={dataFormat} onChange={onChange} />
    </div>
  );
};
