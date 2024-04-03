import { Button, Table, Typography } from "antd";
import { Link } from "react-router-dom";
import { EditFilled } from "@ant-design/icons";

interface UserTableProps {
  data: any;
  onChange: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

export const UserTable: React.FC<UserTableProps> = (props: UserTableProps) => {
  const { data, onChange } = props;
  let names: any;

  return (
    <Table
      className="custom-bordered-table"
      rowKey="id"
      style={{ width: "100%" }}
      pagination={{
        defaultPageSize: 10,
      }}
      dataSource={data}
      scroll={{ x: "max-content" }}
      onChange={onChange}
      columns={[
        {
          title: "Name",
          render: (value: any, record: any, index) => (
            <Typography>{record.firstname + " " + record.lastname}</Typography>
          ),
          dataIndex: "firstname",
        },
        {
          title: "Group",
          dataIndex: "group",
          align: "center",
          render: (text: any, record: any, index) => {
            const displayText = text || "-";

            if (!record.group) {
              return {
                children: <Typography>{displayText}</Typography>,
                props: {
                  rowSpan: 1,
                },
              };
            }

            const firstIndex = data.findIndex(
              (item: any) => item.group === record.group
            );

            if (index === firstIndex) {
              const count = data.filter(
                (item: any) => item.group === record.group
              ).length;
              return {
                children: <Typography>{displayText}</Typography>,
                props: {
                  rowSpan: count,
                },
              };
            }

            return {
              children: <Typography>{displayText}</Typography>,
              props: {
                rowSpan: 0,
              },
            };
          },
        },
        {
          title: "Email",
          dataIndex: "email",
        },
        {
          title: "Class",
          dataIndex: "class",
          align: "center",
        },
        {
          title: "Class No.",
          dataIndex: "class_number",
          align: "center",
        },
        {
          title: "Counting asks",
          dataIndex: "chatbot_asked_total",
          align: "center",
          render: (value) => {
            return value ? value : 0;
          },
        },
        {
          align: "right",
          render: (value: any, record: any, index) => (
            <Link to={`${record.id}`}>
              <Button icon={<EditFilled />} />
            </Link>
          ),
        },
      ]}
    />
  );
};
