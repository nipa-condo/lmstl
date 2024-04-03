import {
  Button,
  Col,
  Divider,
  Form,
  Radio,
  Row,
  Space,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Link, useLoaderData } from "react-router-dom";

import { ResultPieChart } from "../../../components/common";
import { AppLayout } from "../../../components/layout";
import * as API from "../../../api";

export async function loader({ params }: any) {
  const pretest = await API.getPretest(params.id);
  const posttest = await API.getPosttest(params.id);

  return { pretest: pretest.data.data, posttest: posttest.data.data };
}

export const Result = () => {
  const { t } = useTranslation();
  const { pretest, posttest } = useLoaderData() as any;

  const { Title, Text } = Typography;
  const pretestResult = [
    {
      type: "Wrong",
      value: pretest.summary?.total_incorrect,
    },
    {
      type: "Correct",
      value: pretest.summary?.total_correct,
    },
  ];

  const postestResult = [
    {
      type: "Wrong",
      value: posttest.summary?.total_incorrect,
    },
    {
      type: "Correct",
      value: posttest.summary?.total_correct,
    },
  ];

  const pretests =
    pretest &&
    pretest.pretestResults.map((data: any) => {
      return { [data.pretest.id]: data.pretest.correct_answer };
    });

  const newPretests = Object.assign({}, ...pretests);

  const posttests =
    posttest &&
    posttest.posttestResults.map((data: any) => {
      return { [data.posttest.id]: data.posttest.correct_answer };
    });

  const newPosttests = Object.assign({}, ...posttests);

  return (
    <AppLayout>
      <div className="app-container">
        <div
          className="content-container"
          style={{
            background: "#f3f4f6",
          }}
        >
          <div className="content-inner" style={{ flexDirection: "column" }}>
            <Col>
              <Title className="title-margin" level={2}>
                {t("your_result")}
              </Title>
            </Col>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Row>
                <Col span={12}>
                  <ResultPieChart data={pretestResult} />
                </Col>
                <Col span={12} style={{ textAlign: "center" }}>
                  <Title level={2}>{t("Pretest")}</Title>
                  <Title level={3}>
                    {pretest.summary.total_correct} /{" "}
                    {pretest.pretestResults && pretest.pretestResults.length}
                  </Title>
                </Col>
                <Col span={24}>
                  <Form
                    name="pretest"
                    layout="vertical"
                    style={{ marginTop: "3rem" }}
                    initialValues={newPretests}
                  >
                    {pretest &&
                      pretest.pretestResults.map((data: any, index: any) => (
                        <Form.Item
                          name={data.pretest.id}
                          key={data.pretest.id}
                          label={
                            <Space direction="vertical" size="small">
                              <Title level={3}>
                                {index + 1}. {data.pretest.question}
                              </Title>

                              <Space>
                                <Text>
                                  {`You choose choice number ${
                                    data.answer_choosed
                                  } , ${
                                    data.is_answer_correct
                                      ? "It`s the Correct Answer"
                                      : "It`s Not the Correct Answer"
                                  } `}
                                </Text>

                                {data.is_answer_correct ? (
                                  <CheckCircleTwoTone
                                    style={{ fontSize: "24px" }}
                                  />
                                ) : (
                                  <CloseCircleTwoTone
                                    twoToneColor="#fe6c4e"
                                    style={{ fontSize: "24px" }}
                                  />
                                )}
                              </Space>
                            </Space>
                          }
                        >
                          <Radio.Group>
                            <Radio
                              value="1"
                              disabled={data.pretest.correct_answer !== "1"}
                            >
                              {data.pretest.answer_1}
                            </Radio>
                            <Radio
                              value="2"
                              disabled={data.pretest.correct_answer !== "2"}
                            >
                              {data.pretest.answer_2}
                            </Radio>
                            <Radio
                              value="3"
                              disabled={data.pretest.correct_answer !== "3"}
                            >
                              {data.pretest.answer_3}
                            </Radio>
                            <Radio
                              value="4"
                              disabled={data.pretest.correct_answer !== "4"}
                            >
                              {data.pretest.answer_4}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      ))}
                  </Form>
                </Col>
              </Row>

              <Divider />

              <Row>
                <Col span={12}>
                  <ResultPieChart data={postestResult} />
                </Col>
                <Col span={12} style={{ textAlign: "center" }}>
                  <Title level={2}>{t("Posttest")}</Title>
                  <Title level={3}>
                    {posttest.summary.total_correct} /{" "}
                    {posttest.posttestResults &&
                      posttest.posttestResults.length}
                  </Title>
                </Col>
                <Col span={24}>
                  <Form
                    name="pretest"
                    layout="vertical"
                    style={{ marginTop: "3rem" }}
                    initialValues={newPosttests}
                  >
                    {posttest &&
                      posttest.posttestResults.map((data: any, index: any) => (
                        <Form.Item
                          name={data.posttest.id}
                          key={data.posttest.id}
                          label={
                            <Space direction="vertical" size="small">
                              <Title level={3}>
                                {index + 1}. {data.posttest.question}
                              </Title>
                              <Space>
                                <Text>
                                  {`You choose choice number ${
                                    data.answer_choosed
                                  } , ${
                                    data.is_answer_correct
                                      ? "It`s the Correct Answer"
                                      : "It`s Not the Correct Answer"
                                  } `}
                                </Text>
                                {data.is_answer_correct ? (
                                  <CheckCircleTwoTone
                                    style={{ fontSize: "24px" }}
                                  />
                                ) : (
                                  <CloseCircleTwoTone
                                    twoToneColor="#fe6c4e"
                                    style={{
                                      fontSize: "24px",
                                    }}
                                  />
                                )}
                              </Space>
                            </Space>
                          }
                        >
                          <Radio.Group>
                            <Radio
                              value="1"
                              disabled={data.posttest.correct_answer !== "1"}
                            >
                              {data.posttest.answer_1}
                            </Radio>
                            <Radio
                              value="2"
                              disabled={data.posttest.correct_answer !== "2"}
                            >
                              {data.posttest.answer_2}
                            </Radio>
                            <Radio
                              value="3"
                              disabled={data.posttest.correct_answer !== "3"}
                            >
                              {data.posttest.answer_3}
                            </Radio>
                            <Radio
                              value="4"
                              disabled={data.posttest.correct_answer !== "4"}
                            >
                              {data.posttest.answer_4}
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                      ))}
                  </Form>
                </Col>
              </Row>
            </div>
            <Row justify="center" style={{ marginBottom: "3rem" }}>
              <Link to="/lessions">
                <Button type="primary">{t("back_to_home_page")}</Button>
              </Link>
            </Row>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
