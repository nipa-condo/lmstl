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

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

interface ResultLessionProps {
  data: any;
}

export const ResultLession: React.FC<ResultLessionProps> = (
  props: ResultLessionProps
) => {
  const { data } = props;
  const { Text } = Typography;

  return (
    <Table
      rowKey="id"
      style={{ width: "100%", paddingTop: "30px" }}
      dataSource={data}
      pagination={{
        defaultPageSize: 10,
        showTotal: (total: any, range: any) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: "max-content" }}
      columns={[
        {
          title: "Lession Title",
          width: 200,
          sorter: (a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateA - dateB;
          },
          render: (value: any, record: any, index) => {
            return (
              <Link to={`/dashboard/lessions/${record.id}`}>
                <Space size="middle" direction="vertical">
                  <Image
                    src={record.thumbnail_url}
                    // src={`${baseURL}/upload/${record.thumbnail_url}`}
                    height="100px"
                    width="100px"
                    style={{
                      backgroundSize: "cover",
                    }}
                  />
                  <Text strong>{record.title}</Text>
                </Space>
              </Link>
            );
          },
          dataIndex: "title",
        },

        {
          title: "Pretest (Score)",
          dataIndex: "pretest_score",
          width: 150,
          align: "center",
          sorter: (a: any, b: any) => {
            const totalA = a.pretest.correct / a.pretest.total;
            const totalB = b.pretest.correct / b.pretest.total;
            if (Number.isNaN(totalA) && Number.isNaN(totalB)) {
              return 0;
            } else if (Number.isNaN(totalA)) {
              return 1;
            } else if (Number.isNaN(totalB)) {
              return -1;
            } else if (totalA === totalB) {
              return 0;
            }

            return totalA < totalB ? -1 : 1;
          },
          render: (value: any, record: any, index) =>
            record.pretest.total != 0 ? (
              <Space>
                <Typography.Title
                  level={3}
                  style={{
                    color:
                      record.pretest.correct > record.pretest.total / 2
                        ? "#53a653"
                        : "red",
                  }}
                >
                  {`${record.pretest.correct}`}
                </Typography.Title>
                <Typography.Title level={3}>
                  / {record.pretest.total}
                </Typography.Title>
              </Space>
            ) : (
              <Typography.Title level={3}>-</Typography.Title>
            ),
        },

        {
          title: "Posttest (Score)",
          dataIndex: "posttest_score",
          align: "center",
          width: 150,
          sorter: (a: any, b: any) => {
            const totalA = a.posttest.correct / a.posttest.total;
            const totalB = b.posttest.correct / b.posttest.total;
            if (Number.isNaN(totalA) && Number.isNaN(totalB)) {
              return 0;
            } else if (Number.isNaN(totalA)) {
              return 1;
            } else if (Number.isNaN(totalB)) {
              return -1;
            } else if (totalA === totalB) {
              return 0;
            }

            return totalA < totalB ? -1 : 1;
          },
          render: (value: any, record: any, index) =>
            record.posttest.total != 0 ? (
              <Space>
                <Typography.Title
                  level={3}
                  style={{
                    color:
                      record.posttest.correct > record.posttest.total / 2
                        ? "#53a653"
                        : "red",
                  }}
                >
                  {`${record.posttest.correct}`}
                </Typography.Title>
                <Typography.Title level={3}>
                  / {record.posttest.total}
                </Typography.Title>
              </Space>
            ) : (
              <Typography.Title level={3}>-</Typography.Title>
            ),
        },
        {
          title: "Total (Score)",
          dataIndex: "total",
          align: "center",
          width: 150,
          sorter: (a: any, b: any) => {
            const totalScoreA = a.pretest.correct + a.posttest.correct;
            const totalScoreB = b.pretest.correct + b.posttest.correct;
            return totalScoreA - totalScoreB;
          },
          render: (value: any, record: any, index) => (
            <Space>
              <Typography.Title
                level={3}
                style={{
                  color:
                    record.pretest.correct + record.posttest.correct >
                    record.pretest.total / 2 + record.posttest.total / 2
                      ? "#53a653"
                      : "red",
                }}
              >{`${
                record.pretest?.correct + record.posttest?.correct
              }`}</Typography.Title>
            </Space>
          ),
        },
      ]}
    />
  );
};
