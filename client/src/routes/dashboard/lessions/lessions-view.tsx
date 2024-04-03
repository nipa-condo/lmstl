import { useLoaderData } from "react-router-dom";

import {
  Space,
  Table,
  Tooltip,
  Tag,
  Divider,
  Typography,
  Empty,
  Button,
  Image,
} from "antd";
import * as Icon from "@ant-design/icons";

import * as API from "../../../api";
import { HandleGroup } from "../../../components/dashboard/analytic/HandleGroup";
import { ReactElement } from "react";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;
interface RecordType {
  group: string;
  answers: any;
  user?: { id?: number; firstname?: string; lastname?: string };
  // other properties if any
}

export async function loaderSingle({ params }: any) {
  const lession = await API.getLession(params.id);

  const { data: pretest } = await API.getPretestUser(
    lession.data.data.lession.id
  );
  const { data: posttest } = await API.getPosttestUser(
    lession.data.data.lession.id
  );

  return { lession: lession.data.data, pretest, posttest };
}

export const LessionAdminSingleView = () => {
  const { lession, pretest, posttest } = useLoaderData() as any;

  const summarizeData = (data: any, type: string) => {
    let summary = {} as any;

    // Loop through each user's data
    data.forEach((user: any) => {
      user.answers.forEach((answer: any) => {
        // If the posttestId doesn't exist in the summary object, add it

        // summary[answer[type]].question =
        type === "posttestId"
          ? answer.posttestQuestion
          : answer.pretestQuestion;

        if (!summary[answer[type]]) {
          summary[answer[type]] = {
            totalUsers: 0,
            totalCorrect: 0,
            question:
              type === "posttestId"
                ? answer.posttestQuestion
                : answer.pretestQuestion,
          };
        }

        // Increment the total users who answered this posttestId
        summary[answer[type]].totalUsers++;

        // If the answer is correct, increment the total correct for this posttestId
        if (answer.isAnswerCorrect) {
          summary[answer[type]].totalCorrect++;
        }
      });
    });

    // Transform the summary object into an array and calculate the percentage correct for each posttestId
    return Object.keys(summary)
      .map((id) => ({
        [type]: parseInt(id, 10),
        question: summary[id].question,
        totalCorrect:
          ((summary[id].totalCorrect / summary[id].totalUsers) * 100).toFixed(
            2
          ) + "%",
      }))
      .sort((a: any, b: any) => a[type] - b[type]);
  };

  const exportQuestionColumn = (question: any, type: string) => {
    if (question.length) {
      const render = question.map((q: any, count: any) => {
        const summarize = summarizeData(
          type === "posttestId" ? posttest.data : pretest.data,
          type
        );

        const sum = summarize.filter((sum: any) => sum[type] == q[type])[0];

        return {
          title: (
            <Tooltip title={sum.question}>
              <Space direction="vertical">
                {`Q${count + 1}`}
                <Tag color="blue"> {sum.totalCorrect}</Tag>
              </Space>
            </Tooltip>
          ),
          align: "center",
          render: (value: any, record: any, index: any) => {
            return <> {record.answers[count].isAnswerCorrect ? "✅" : "❌"} </>;
          },
        };
      });

      return render;
    }
  };

  return (
    <div
      className="content-container"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="content-inner" style={{ flexDirection: "column" }}>
        {lession.lession?.photo_url && (
          <Image
            src={lession.lession?.photo_url}
            preview={false}
            style={{
              backgroundSize: "cover",
              marginBottom: "24px",
              marginTop: "24px",
            }}
          ></Image>
        )}
      </div>
      <Typography.Title level={2}>Pretest</Typography.Title>
      {pretest.data && pretest.data?.length ? (
        <Table
          className="custom-bordered-table"
          rowKey="id"
          style={{ width: "100%" }}
          pagination={{
            defaultPageSize: 20,
          }}
          scroll={{ x: "max-content" }}
          dataSource={pretest.data.map((d: any, index: any) => {
            return {
              ...d,
              id: index + 1,
            };
          })}
          columns={[
            {
              title: "Name",
              dataIndex: "firstname",
              render: (value, record: RecordType, index) => {
                return (
                  <Space size="middle">
                    <Typography>
                      {record?.user?.firstname + " "} {record?.user?.lastname}
                    </Typography>
                  </Space>
                );
              },
            },
            {
              render: (value, record) => {
                const groupData = pretest.data
                  .map((items: any) => items.user.group)
                  .reduce((accumulator: any, item: any) => {
                    if (!accumulator.includes(item) && item !== null) {
                      accumulator.push(item);
                    }
                    return accumulator;
                  }, []);

                return (
                  <HandleGroup
                    userId={record?.user?.id ?? 0}
                    lessionsId={lession.lession.id}
                    groupName={record.group}
                    groupData={groupData}
                  />
                );
              },
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

                const firstIndex = pretest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = pretest.data.filter(
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
              title: "Average Score",
              dataIndex: "average_score",
              align: "center",
              render: (text: any, record: any, index) => {
                if (text === undefined || text === null || isNaN(text)) {
                  return {
                    children: <Typography>-</Typography>,
                    props: {
                      rowSpan: 1,
                    },
                  };
                }

                const firstIndex = pretest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = pretest.data.filter(
                    (item: any) => item.group === record.group
                  ).length;
                  return {
                    children: (
                      <Typography>
                        {text} / {record.answers.length}
                      </Typography>
                    ),
                    props: {
                      rowSpan: count,
                    },
                  };
                }

                return {
                  children: (
                    <Typography>
                      {text} / {record.answers.length}
                    </Typography>
                  ),
                  props: {
                    rowSpan: 0,
                  },
                };
              },
            },

            {
              title: "Group Accuracy",
              dataIndex: "average_accuracy",
              align: "center",
              render: (text: any, record: any, index) => {
                // Check if the value is not a number or is missing
                if (text === undefined || text === null || isNaN(text)) {
                  return {
                    children: <Typography>-</Typography>,
                    props: {
                      rowSpan: 1,
                    },
                  };
                }

                // Ensure text is treated as a number and format it
                const formattedText = parseFloat(text).toFixed(2);

                const firstIndex = pretest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = pretest.data.filter(
                    (item: any) => item.group === record.group
                  ).length;
                  return {
                    children: <Typography>{formattedText}</Typography>,
                    props: {
                      rowSpan: count,
                    },
                  };
                }

                return {
                  children: <Typography>{formattedText}</Typography>,
                  props: {
                    rowSpan: 0,
                  },
                };
              },
            },

            {
              title: "Completed Test",
              dataIndex: "group_tested",
              align: "center",
              render: (text: any, record: any, index) => {
                if (text === undefined || text === null || isNaN(text)) {
                  return {
                    children: <Typography>-</Typography>,
                    props: {
                      rowSpan: 1,
                    },
                  };
                }

                const firstIndex = pretest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = pretest.data.filter(
                    (item: any) => item.group === record.group
                  ).length;
                  return {
                    children: (
                      <Typography>
                        {text} / {record.group_count}
                      </Typography>
                    ),
                    props: {
                      rowSpan: count,
                    },
                  };
                }

                return {
                  children: (
                    <Typography>
                      {text} / {record.group_count}
                    </Typography>
                  ),
                  props: {
                    rowSpan: 0,
                  },
                };
              },
            },
            {
              title: "Score",
              dataIndex: "score",
              align: "center",
              render: (value, record) => {
                return (
                  <Typography>
                    {value} / {record.answers.length}
                  </Typography>
                );
              },
            },
            {
              title: "Accuracy",
              dataIndex: "accuracy",
              align: "center",
              render: (text: any, record: any, index) => {
                const formattedText = parseFloat(text).toFixed(2);

                return <Typography>{formattedText}</Typography>;
              },
            },
            {
              title: "Counting asks",
              dataIndex: "chatbot_asked",
              align: "center",
              render: (value: any) => {
                return value && value.chatbot_asked ? value.chatbot_asked : 0;
              },
            },

            ...exportQuestionColumn(
              pretest.data && pretest.data?.length
                ? pretest.data[0].answers
                : [],
              "pretestId"
            ),
          ]}
        />
      ) : (
        <Empty />
      )}

      <Divider />
      <Typography.Title level={2}>Postest</Typography.Title>

      {posttest.data && posttest.data?.length ? (
        <Table
          className="custom-bordered-table"
          rowKey="id"
          style={{ width: "100%" }}
          pagination={{
            defaultPageSize: 20,
          }}
          scroll={{ x: "max-content" }}
          dataSource={posttest.data.map((d: any, index: any) => {
            return {
              ...d,
              id: index + 1,
            };
          })}
          columns={[
            {
              title: "Name",
              dataIndex: "firstname",
              render: (value, record: RecordType, index) => {
                return (
                  <Space size="middle">
                    <Typography>
                      {record?.user?.firstname + " "} {record?.user?.lastname}
                    </Typography>
                  </Space>
                );
              },
            },
            {
              render: (value, record) => {
                const groupData = posttest.data
                  .map((items: any) => items.user.group)
                  .reduce((accumulator: any, item: any) => {
                    if (!accumulator.includes(item) && item !== null) {
                      accumulator.push(item);
                    }
                    return accumulator;
                  }, []);

                return (
                  <HandleGroup
                    userId={record?.user?.id ?? 0}
                    lessionsId={lession.lession.id}
                    groupName={record.group}
                    groupData={groupData}
                  />
                );
              },
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

                const firstIndex = posttest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = posttest.data.filter(
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
              title: "Average Score",
              dataIndex: "average_score",
              align: "center",
              render: (text: any, record: any, index) => {
                if (text === undefined || text === null || isNaN(text)) {
                  return {
                    children: <Typography>-</Typography>,
                    props: {
                      rowSpan: 1,
                    },
                  };
                }

                const firstIndex = posttest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = posttest.data.filter(
                    (item: any) => item.group === record.group
                  ).length;
                  return {
                    children: (
                      <Typography>
                        {text} / {record.answers.length}
                      </Typography>
                    ),
                    props: {
                      rowSpan: count,
                    },
                  };
                }

                return {
                  children: (
                    <Typography>
                      {text} / {record.answers.length}
                    </Typography>
                  ),
                  props: {
                    rowSpan: 0,
                  },
                };
              },
            },

            {
              title: "Group Accuracy",
              dataIndex: "average_accuracy",
              align: "center",
              render: (text: any, record: any, index) => {
                // Check if the value is not a number or is missing
                if (text === undefined || text === null || isNaN(text)) {
                  return {
                    children: <Typography>-</Typography>,
                    props: {
                      rowSpan: 1,
                    },
                  };
                }

                // Ensure text is treated as a number and format it
                const formattedText = parseFloat(text).toFixed(2);

                const firstIndex = posttest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = posttest.data.filter(
                    (item: any) => item.group === record.group
                  ).length;
                  return {
                    children: <Typography>{formattedText}</Typography>,
                    props: {
                      rowSpan: count,
                    },
                  };
                }

                return {
                  children: <Typography>{formattedText}</Typography>,
                  props: {
                    rowSpan: 0,
                  },
                };
              },
            },

            {
              title: "Completed Test",
              dataIndex: "group_tested",
              align: "center",
              render: (text: any, record: any, index) => {
                if (text === undefined || text === null || isNaN(text)) {
                  return {
                    children: <Typography>-</Typography>,
                    props: {
                      rowSpan: 1,
                    },
                  };
                }

                const firstIndex = posttest.data.findIndex(
                  (item: any) => item.group === record.group
                );

                if (index === firstIndex) {
                  const count = posttest.data.filter(
                    (item: any) => item.group === record.group
                  ).length;
                  return {
                    children: (
                      <Typography>
                        {text} / {record.group_count}
                      </Typography>
                    ),
                    props: {
                      rowSpan: count,
                    },
                  };
                }

                return {
                  children: (
                    <Typography>
                      {text} / {record.group_count}
                    </Typography>
                  ),
                  props: {
                    rowSpan: 0,
                  },
                };
              },
            },
            {
              title: "Score",
              dataIndex: "score",
              align: "center",
              render: (value, record) => {
                return (
                  <Typography>
                    {value} / {record.answers.length}
                  </Typography>
                );
              },
            },
            {
              title: "Accuracy",
              dataIndex: "accuracy",
              align: "center",
              render: (text: any, record: any, index) => {
                const formattedText = parseFloat(text).toFixed(2);

                return <Typography>{formattedText}</Typography>;
              },
            },
            {
              title: "Counting asks",
              dataIndex: "chatbot_asked",
              align: "center",
              render: (value: any) => {
                return value && value.chatbot_asked ? value.chatbot_asked : 0;
              },
            },

            ...exportQuestionColumn(
              posttest.data && posttest.data?.length
                ? posttest.data[0].answers
                : [],
              "posttestId"
            ),
          ]}
        />
      ) : (
        <Empty />
      )}
    </div>
  );
};
