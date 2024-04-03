import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  notification,
  Row,
  Typography,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { PicTypeThree } from "../assets/images";
import {
  Navigate,
  redirect,
  useActionData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import * as API from "../api";
import { AuthContext } from "../components/contexts/AuthContext";
import Swal from "sweetalert2";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  try {
    const { data } = await API.register(submitData);
    return { success: data.status, message: data.message };
  } catch (e: any) {
    return { error: e.response.data.message };
  }
}

export const Register = () => {
  const { Title, Text } = Typography;
  const { t } = useTranslation();
  const submit = useSubmit();
  const response = useActionData() as any;
  const navigate = useNavigate();

  const { setting } = React.useContext(AuthContext);

  const handleSubmitLogin = (values: any) => {
    const data = Object.assign({}, values);

    data.role = "user";
    submit({ ...data }, { method: "post" });
  };

  const onClickSignin = () => {
    navigate("/signin");
  };

  React.useEffect(() => {
    if (response && response.success) {
      Swal.fire({
        title: "Register Success!",
        text: "Thank you for register. Please wait for approving.",
        icon: "success",
        willClose: () => {
          navigate("/signin");
        },
      });
    }
    if (response && response.error) {
      notification.success({
        message: response.error,
        placement: "bottomLeft",
        duration: 4.5,
      });
    }
  }, [response]);

  return (
    <>
      <Image
        // className="signin-layout"
        src={setting.register_photo_url}
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
        {" "}
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
                LMSTL
              </Title>
              <Text>registration to continue access</Text>
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
              <Title level={3}>REGISTRATION</Title>
              <Row gutter={10}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item
                    name="firstname"
                    rules={[
                      { required: true, message: "Please input your Name!" },
                    ]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item name="lastname">
                    <Input placeholder="Last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email Adress!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email Address"
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
              <Form.Item
                name="password_confirm"
                rules={[
                  {
                    required: true,
                    message: "Please input your Confirm Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Confirm Password"
                />
              </Form.Item>
              <Row gutter={10}>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item name="class">
                    <Input placeholder="Class" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form.Item name="class_number">
                    <Input placeholder="NO." />
                  </Form.Item>
                </Col>
              </Row>
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

              <Divider />
              <Button block type="default" onClick={onClickSignin}>
                {t("GO TO SIGN IN")}
              </Button>
            </Form>
          </Col>
        </Row>
      </div>

      {/* </Image> */}
    </>
  );
};
