import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import { useTranslation } from "react-i18next";
import { SaveOutlined } from "@ant-design/icons";
import { redirect, useActionData, useSubmit } from "react-router-dom";
import * as API from "../../../api";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  if (submitData.data) {
    const dataFormat = JSON.parse(submitData.data);
    try {
      const { data } = await API.register(dataFormat);
      return redirect(`/dashboard/users/${data.id}`);
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  } else {
    try {
      const res = await API.upload(formData);
      return { imagePath: res.data.url };
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  }
}

export const UserAdminNew = () => {
  const { t } = useTranslation();
  const { Title, Text } = Typography;
  const response = useActionData() as any;

  const submit = useSubmit();
  const [titleImage, setTitleImage] = React.useState<any>("");

  const initialValues = { color: { r: 26, g: 14, b: 85, a: 1 } };
  const handleOnFinish = (values: any) => {
    const data = Object.assign({}, values);

    if (response?.imagePath) {
      data.photo_url = response.imagePath;
    }

    data.role = "user";

    submit({ data: JSON.stringify(data) }, { method: "post" });
  };

  const onChangeTitleImage = async (photos: any) => {
    setTitleImage(photos.fileList?.length);

    if (photos.fileList?.length) {
      submit(
        { file: photos.file },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  return (
    <Col style={{ padding: "24px" }}>
      <Form
        scrollToFirstError={true}
        onFinish={handleOnFinish}
        labelCol={{ xs: 6, sm: 8, md: 6, lg: 12 }}
        wrapperCol={{ xs: 24, sm: 24, md: 14, lg: 12 }}
        labelAlign="left"
        initialValues={initialValues}
      >
        <Row justify="space-between">
          <Title level={2}>{t("Add Student")}</Title>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {t("save")}
          </Button>
        </Row>
        <div style={{ padding: "20px" }}>
          <Upload
            listType="picture-card"
            name="file"
            beforeUpload={(file) => {
              return false;
            }}
            onRemove={() => setTitleImage("")}
            onChange={onChangeTitleImage}
            maxCount={1}
          >
            {titleImage ? null : "Upload"}
          </Upload>
          {/* <Row gutter={20}> */}
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please input your Email Adress!" },
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>
          </Col>

          {/* </Row> */}

          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              label="Confirm Password"
              name="password_confirm"
              rules={[
                {
                  required: true,
                  message: "Please input your Confirm Password!",
                },
              ]}
            >
              <Input type="password" placeholder="Confirm Password" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item
              name="firstname"
              label="First Name"
              rules={[{ required: true, message: "Please input your Name!" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="Last name" name="lastname">
              <Input placeholder="Last name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="Class" name="class">
              <Input placeholder="Class" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="Group." name="group">
              <Input placeholder="Group." />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12}>
            <Form.Item label="No." name="class_number">
              <Input placeholder="NO." />
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Col>
  );
};
