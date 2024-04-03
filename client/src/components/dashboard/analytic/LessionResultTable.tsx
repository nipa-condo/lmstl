import {
  Table,
  Image,
  Space,
  Typography,
  Progress,
  Checkbox,
  Row,
  Col,
} from "antd";
import { User } from "react-feather";
import { Link } from "react-router-dom";
import * as Icon from "@ant-design/icons";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

interface LessionResultTableProps {
  data: any;
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

export const LessionResultTable: React.FC<LessionResultTableProps> = (
  props: LessionResultTableProps
) => {
  const { data, onChange } = props;

  const { Text } = Typography;
  return (
    <Table
      rowKey="id"
      style={{ width: "100%", paddingTop: "30px" }}
      dataSource={data}
      onChange={onChange}
      pagination={{
        defaultPageSize: 10,
        showTotal: (total: any, range: any) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: "max-content" }}
      columns={[
        {
          width: "240px",
          title: "Lession Title",
          align: "center",
          render: (value: any, record: any, index) => (
            <Link to={`/dashboard/analytics/${record.lession.id}`}>
              <Space size="middle" direction="vertical">
                <Image
                  src={record.lession.thumbnail_url}
                  // src={`${baseURL}/upload/${record.lession.thumbnail_url}`}
                  height="200px"
                  width="200px"
                  preview={false}
                  style={{
                    backgroundSize: "cover",
                  }}
                />
                <Text strong>{record.lession.title}</Text>
              </Space>
            </Link>
          ),
          dataIndex: "title",
        },
        {
          title: "Details",
          width: "200px",
          render: (value: any, record: any, index) => (
            <Space size="large" direction="vertical">
              <Row gutter={20}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Space direction="vertical">
                    <Checkbox
                      className="custom-checkbox-disabled"
                      checked={record.lession.have_content}
                      disabled
                    >
                      <span className="custom-checkbox-label">Content</span>
                    </Checkbox>
                    <Checkbox
                      className="custom-checkbox-disabled"
                      checked={record.lession.have_result}
                      disabled
                    >
                      <span className="custom-checkbox-label">Result</span>
                    </Checkbox>
                  </Space>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Space direction="vertical">
                    <Checkbox
                      className="custom-checkbox-disabled"
                      checked={record.lession.have_pretest}
                      disabled
                    >
                      <span className="custom-checkbox-label">Pretest</span>
                    </Checkbox>
                    <Checkbox
                      className="custom-checkbox-disabled"
                      checked={record.lession.have_posttest}
                      disabled
                    >
                      <span className="custom-checkbox-label">Posttest</span>
                    </Checkbox>
                  </Space>
                </Col>
              </Row>
            </Space>
          ),
        },

        {
          width: "200px",
          title: "Percent Correct / Average Score.",
          align: "center",
          dataIndex: "total_user",
          render: (value: any, record: any, index) => (
            <Row gutter={[12, 12]} justify="center">
              <Col>
                <Progress
                  strokeColor="#53a653"
                  type="circle"
                  percent={
                    record.total_correct.average_percent
                      ? record.total_correct.average_percent
                      : 0
                  }
                />
              </Col>
              <Col>
                <Icon.CheckOutlined
                  style={{ fontSize: "26px", marginRight: "10px" }}
                />
                <Space>
                  <Text
                    style={{
                      fontSize: "21px",
                      color: "#53a653",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.total_correct.average_user}
                    <Text style={{ fontSize: "21px" }}>
                      {" / "}
                      {record.count_score}
                    </Text>
                  </Text>
                </Space>
              </Col>
            </Row>
          ),
        },

        {
          width: "200px",
          title: "Percent Incorrect / Average Score.",
          dataIndex: "total_user",
          align: "center",
          render: (value: any, record: any, index) => (
            <Row gutter={[12, 12]} justify="center">
              <Col>
                <Progress
                  strokeColor="red"
                  type="circle"
                  percent={
                    record.total_incorrect.average_percent
                      ? record.total_incorrect.average_percent
                      : 0
                  }
                />
              </Col>
              <Col>
                <Icon.CloseOutlined
                  style={{ fontSize: "26px", marginRight: "10px" }}
                />
                <Space>
                  <Text
                    style={{
                      fontSize: "21px",
                      color: "red",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.total_incorrect.average_user}
                    <Text style={{ fontSize: "21px" }}>
                      {" / "}
                      {record.count_score}
                    </Text>
                  </Text>
                </Space>
              </Col>
            </Row>
          ),
        },

        {
          width: "200px",
          title: "Percent Complete / Average Users.",
          dataIndex: "total_user",
          align: "center",
          render: (value: any, record: any, index) => (
            <Row gutter={[12, 12]} justify="center">
              <Col>
                <Progress
                  type="circle"
                  percent={
                    record.total_test_user.percent
                      ? record.total_test_user.percent
                      : 0
                  }
                />
              </Col>
              <Col>
                <Icon.UserOutlined
                  style={{ fontSize: "26px", marginRight: "10px" }}
                />
                <Space>
                  <Text
                    style={{
                      fontSize: "21px",
                      color: "#1677ff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.total_test_user.value}
                    <Text style={{ fontSize: "21px" }}>
                      {" / "}
                      {record.count_user}
                    </Text>
                  </Text>
                </Space>
              </Col>
            </Row>
          ),
        },
      ]}
    />
  );
};
