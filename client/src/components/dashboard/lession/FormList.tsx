import { Button, Col, Form, Input, Radio, Row, Space, Typography } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import React from "react";
interface FormListProps {
  lession: any;
  resultTest: any;
}

export const FormList: React.FC<FormListProps> = (props: FormListProps) => {
  const { t } = useTranslation();
  const { lession, resultTest } = props;
  const { Text } = Typography;
  return (
    <Form.List name="options">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Col key={key}>
              <Form.Item
                label={
                  <Space size="large">
                    <Text>{`Question ${name + 1}`}</Text>
                    {lession.result_test &&
                      !(
                        lession.result_test.is_test_pretest ||
                        lession.result_test.is_test_posttest
                      ) && <MinusCircleOutlined onClick={() => remove(name)} />}
                  </Space>
                }
                {...restField}
                name={[name, "question"]}
                rules={[
                  {
                    required: true,
                    message: "Please Input Question Details!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "correct_answer"]}
                rules={[
                  {
                    required: true,
                    message: "Please Give an answer for this question!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="1">
                    <Form.Item
                      {...restField}
                      name={[name, "answer_1"]}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: "Please Input Selection",
                        },
                      ]}
                    >
                      <Input.TextArea style={{ minWidth: "300px" }} rows={5} />
                    </Form.Item>
                  </Radio>
                  <Radio value="2">
                    <Form.Item
                      {...restField}
                      name={[name, "answer_2"]}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: "Please Input Selection",
                        },
                      ]}
                    >
                      <Input.TextArea style={{ minWidth: "300px" }} rows={5} />
                    </Form.Item>
                  </Radio>
                  <Radio value="3">
                    <Form.Item
                      {...restField}
                      name={[name, "answer_3"]}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: "Please Input Selection",
                        },
                      ]}
                    >
                      <Input.TextArea style={{ minWidth: "300px" }} rows={5} />
                    </Form.Item>
                  </Radio>
                  <Radio value="4">
                    <Form.Item
                      {...restField}
                      name={[name, "answer_4"]}
                      style={{ margin: 0 }}
                      rules={[
                        {
                          required: true,
                          message: "Please Input Selection",
                        },
                      ]}
                    >
                      <Input.TextArea style={{ minWidth: "300px" }} rows={5} />
                    </Form.Item>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          ))}

          {resultTest &&
            !(resultTest.is_test_pretest || resultTest.is_test_posttest) && (
              <Form.Item>
                <Row justify="center">
                  <Button onClick={() => add()} type="primary">
                    {t("add_more_question")}
                  </Button>
                </Row>
              </Form.Item>
            )}
        </>
      )}
    </Form.List>
  );
};
