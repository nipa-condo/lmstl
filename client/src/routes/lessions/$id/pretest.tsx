import React from "react";
import { useTranslation } from "react-i18next";
import { Col, Radio, Typography, Form, Button, notification } from "antd";
import {
  useActionData,
  useNavigate,
  useParams,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import Swal from "sweetalert2";
import * as API from "../../../api";

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  try {
    const res = await API.sendPretest(params.id, JSON.parse(submitData.data));
    return { success: "Submit Successfully." };
  } catch (e: any) {
    return { error: "Please Submit Again." };
  }
}

export const LessionsSinglePretest = () => {
  const { t } = useTranslation();
  const { lession } = useRouteLoaderData("lession-single-root") as any;
  const submit = useSubmit();
  const navigate = useNavigate();
  const response = useActionData() as any;

  const { id } = useParams();
  const { Title, Text } = Typography;

  React.useEffect(() => {
    if (response && response.error) {
      notification.error({
        message: response.error,
        placement: "bottomLeft",
      });
    }
    if (response && response.success) {
      if (lession.lession && lession.lession.have_content) {
        navigate(`/lessions/${id}`);
      } else {
        if (lession.lession && lession.lession.have_posttest) {
          navigate(`/lessions/${id}/posttest`);
        } else {
          Swal.fire({
            title: "Congraturation!",
            text: "Thank you for learning This lession",
            icon: "success",
            willClose: () => {
              navigate("/lessions");
            },
          });
        }
      }
    }
  }, [response]);

  const onFinish = (values: any) => {
    const result = Object.keys(values).map((key: any) => {
      return {
        id: Number(key.split("question_")[1]),
        answer: values[key].split("answer_")[1],
      };
    });

    if (lession.lession && lession.lession.have_content) {
      navigate(`/lessions/${id}`);
    } else {
      if (lession.lession && lession.lession.have_posttest) {
        navigate(`/lessions/${id}/posttest`);
      } else {
        Swal.fire({
          title: "Congraturation!",
          text: "Thank you for learning This lession",
          icon: "success",
          willClose: () => {
            navigate("/lessions");
          },
        });
      }
    }
    submit({ data: JSON.stringify({ pretests: result }) }, { method: "post" });
  };

  return (
    <Col>
      <Col style={{ marginTop: "3rem" }}>
        <Title className="title-margin" level={2}>
          {lession.lession.id}{" "}
          <span style={{ fontWeight: "normal" }}>{t("lession")}</span>{" "}
          {t("pretest")}
        </Title>
        <Text>{lession.lession.subtitle}</Text>
      </Col>

      <Form
        name="pretest"
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: "3rem", marginBottom: "3rem" }}
      >
        {lession.lession &&
          lession.lession.pretests.map((data: any) => (
            <Form.Item
              key={data.id}
              name={`question_${data.id}`}
              label={data.question}
              rules={[
                { required: true, message: "Please Answer This Questiuon!" },
              ]}
            >
              <Radio.Group>
                <Radio value="answer_1">{data.answer_1}</Radio>
                <Radio value="answer_2">{data.answer_2}</Radio>
                <Radio value="answer_3">{data.answer_3}</Radio>
                <Radio value="answer_4">{data.answer_4}</Radio>
              </Radio.Group>
            </Form.Item>
          ))}
        <Form.Item style={{ textAlign: "end" }}>
          <Button type="primary" htmlType="submit">
            {t("submit")}
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
};
