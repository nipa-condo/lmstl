import React from "react";
import {
  Spin,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Typography,
  notification,
  Image,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import jwtDecode from "jwt-decode";

import { AuthContext } from "../components/contexts/AuthContext";
import * as API from "../api";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  try {
    const { data } = await API.login(submitData);
    const decode = jwtDecode(data.access_token) as any;

    if (decode.id == 1) {
      localStorage.setItem("token", data.access_token);
      return redirect("/dashboard/lessions");
    } else {
      return { error: "You're not allow to see these pages" };
    }
  } catch (e: any) {
    return { error: e.response.data.message };
  }
}

export const SingInDashboard = () => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const { setting } = React.useContext(AuthContext);
  const submit = useSubmit();
  const response = useActionData() as any;
  const navigation = useNavigation();

  const handleSubmitLogin = (values: any) => {
    submit({ ...values }, { method: "post" });
  };

  React.useEffect(() => {
    if (response && response.error) {
      notification.error({
        message: response.error,
        placement: "bottomLeft",
      });
    }
  }, [response]);

  return (
    <Spin
      spinning={
        navigation.state === "loading" || navigation.state === "submitting"
      }
    >
      <Image
        src={setting.sign_in_photo_url}
        preview={false}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          opacity: 0.5,
          backgroundSize: "cover",
        }}
      />
      <div className="signin-layout">
        <Row className="signin-inner" style={{ alignSelf: "center" }}>
          <Col
            xs={0}
            sm={24}
            md={12}
            lg={12}
            className="container-signin-left"
            style={{
              background: "#FFD152",
            }}
          >
            <div className="container-content-signin">
              <Title level={2} className="title-margin">
                {setting.sign_in_title}
              </Title>
              <Text> {setting.sign_in_subtitle}</Text>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            className="container-signin-right"
            style={{
              background: "#FFFFFF",
            }}
          >
            <Form
              onFinish={handleSubmitLogin}
              disabled={
                navigation.state === "loading" ||
                navigation.state === "submitting"
              }
            >
              <Title level={3}> SIGN IN </Title>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input
                  type="email"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  {t("CONTINUE")}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>

      {/* </Image> */}
    </Spin>
  );
};
