import React from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  notification,
  Row,
  Spin,
  Typography,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
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
import { PicTypeThree } from "../assets/images";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  try {
    const { data } = await API.login(submitData);
    const decode = jwtDecode(data.access_token) as any;

    if (decode.id == 1) {
      localStorage.setItem("token", data.access_token);
      return redirect("/dashboard/analytics");
    } else {
      localStorage.setItem("token", data.access_token);
      return redirect("/home");
    }
  } catch (e: any) {
    return { error: e.response.data.message };
  }
}

export const SingIn = () => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const response = useActionData() as any;
  const navigation = useNavigation();

  const { setting } = React.useContext(AuthContext);

  const handleSubmitLogin = (values: any) => {
    submit({ ...values }, { method: "post" });
  };

  const onClickRegister = () => {
    navigate("/register");
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
      {/* <Image
        src={setting.sign_in_photo_url}
        preview={false}
        style={{
          position: "fixed",
          // width: "100vw",
          height: "100vh",
          opacity: 0.5,
          objectFit: "cover",
        }}
      /> */}
      <div
        className="signin-layout"
        style={{
          // backgroundImage: `url(${setting.sign_in_photo_url})`,
          backgroundSize: "contain",
        }}
      >
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
            <Form onFinish={handleSubmitLogin}>
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
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
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
              <Button block type="default" onClick={onClickRegister}>
                {t("REGISTER")}
              </Button>
            </Form>
          </Col>
        </Row>
      </div>

      {/* </Image> */}
    </Spin>
  );
};
