import React, { useContext } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Space,
  Spin,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import {
  SaveOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as API from "../../../api";
import { LogoAdmin } from "../../../assets/images";
import { AuthContext } from "../../../components/contexts/AuthContext";
import { ResultLession } from "../../../components/dashboard";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function loader({ params }: any) {
  const user = await API.getStudent(params.id);

  return { user: user.data.data };
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  switch (submitData.key) {
    case "approve":
      try {
        const data = await API.verify(params.id);
        return { success: "success", message: data.data.message };
      } catch (e: any) {
        return { error: "error", message: e.message };
      }

    case "update":
      try {
        const dataFormat = JSON.parse(submitData.data);
        const data = await API.updateStudent(dataFormat, params.id);

        return { success: "success", message: "Update Successfully" };
      } catch (e: any) {
        return { error: "error", message: e.message };
      }

    case "delete":
      try {
        const data = await API.deleteStudent(params.id);
        return redirect("/dashboard/users");
      } catch (e: any) {
        return { error: "error", message: e.message };
      }
    case "upload":
      try {
        const res = await API.upload(formData);
        return { imagePath: res.data.url };
      } catch (e: any) {
        return { error: "error", message: e.message };
      }
  }
}

export const UserAdminSingle = () => {
  const { t } = useTranslation();
  const { user } = useLoaderData() as any;
  const { setting } = useContext(AuthContext);
  const navigation = useNavigation();
  const submit = useSubmit();
  const response = useActionData() as any;

  const [form] = Form.useForm();

  const [password, setPassword] = React.useState(false);
  const [titleImage, setTitleImage] = React.useState<UploadFile[]>([
    {
      uid: "-1",
      name: user.users.photo_url,
      status: "done",
      url: user.users.photo_url
        ? // ? `${baseURL}/upload/${user.users.photo_url}`
          user.user.photo_url
        : setting.place_holder_url
        ? // ? `${baseURL}/upload/${setting.place_holder_url}`
          setting.place_holder_url
        : LogoAdmin,
    },
  ]);

  const handleOnFinish = (values: any) => {
    const data = Object.assign({}, values);

    if (response?.imagePath) {
      data.photo_url = response.imagePath;
    }
    delete data.confirmPassword;

    form.setFieldValue("password", "");
    setPassword(false);
    submit({ key: "update", data: JSON.stringify(data) }, { method: "put" });
  };

  const onApprove = () => {
    submit({ key: "approve" }, { method: "put" });
  };

  const onDelete = () => {
    submit({ key: "delete" }, { method: "delete" });
  };

  const onChangeTitleImage = async (photos: any) => {
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, key: "upload" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };
  React.useEffect(() => {
    if (response && response.success) {
      notification.success({
        message: response.message,
        placement: "bottomLeft",
      });
    }
    if (response && response.error) {
      notification.error({
        message: response.message,
        placement: "bottomLeft",
      });
    }
    if (response && response.imagePath) {
      setTitleImage([
        {
          uid: "-1",
          name: response.imagePath,
          status: "done",
          url: response.imagePath,
          // url: `${baseURL}/upload/${response.imagePath}`,
        },
      ]);
    }
  }, [response]);

  return (
    <Spin
      spinning={
        navigation.state === "loading" || navigation.state === "submitting"
      }
    >
      <Col style={{ padding: "24px" }}>
        <Row justify="end">
          {user.users && (
            <Space size="middle" direction="horizontal">
              {user.users?.id != 1 && (
                <Button
                  type="default"
                  onClick={onDelete}
                  icon={<DeleteOutlined />}
                >
                  {t("Delete")}
                </Button>
              )}
              {user.users && !user.users?.verified && user.users?.id != 1 ? (
                <Button
                  type="primary"
                  onClick={onApprove}
                  icon={<CheckCircleOutlined />}
                >
                  {t("APPROVE")}
                </Button>
              ) : (
                <Button
                  type="primary"
                  form="user-form"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  {t("save")}
                </Button>
              )}
            </Space>
          )}
        </Row>
        <Row>
          <Col xs={24} sm={24} md={24} lg={10}>
            <Form
              id="user-form"
              disabled={user.users && !user.users?.verified}
              onFinish={handleOnFinish}
              labelCol={{ xs: 6, sm: 8, md: 6, lg: 6 }}
              wrapperCol={{ xs: 24, sm: 24, md: 14, lg: 12 }}
              labelAlign="left"
              initialValues={user.users}
            >
              <div style={{ padding: "20px" }}>
                <Upload
                  listType="picture-card"
                  name="file"
                  fileList={titleImage}
                  beforeUpload={(file) => {
                    return false;
                  }}
                  onRemove={() => setTitleImage([])}
                  onChange={onChangeTitleImage}
                  maxCount={1}
                >
                  {titleImage.length ? null : "Upload"}
                </Upload>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Email Adress!",
                    },
                  ]}
                >
                  <Input placeholder="Email Address" />
                </Form.Item>
                <Form.Item
                  name="firstname"
                  label="First Name"
                  rules={[
                    { required: true, message: "Please input your Name!" },
                  ]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item label="Last Name" name="lastname">
                  <Input placeholder="Last name" />
                </Form.Item>

                <Form.Item label="Class" name="class">
                  <Input placeholder="Class" />
                </Form.Item>
                <Form.Item label="Group" name="group">
                  <Input placeholder="Group" />
                </Form.Item>
                <Form.Item label="No." name="class_number">
                  <Input placeholder="NO." />
                </Form.Item>
                {user.users?.verified && (
                  <>
                    <Row justify="start">
                      <Button
                        type="link"
                        icon={password ? <UpOutlined /> : <DownOutlined />}
                        onClick={() => setPassword(!password)}
                      >
                        Change Password
                      </Button>
                    </Row>
                    {password && (
                      <>
                        <Form.Item
                          label="Password"
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: "Please Input Password.",
                            },
                          ]}
                        >
                          <Input placeholder="password." type="password" />
                        </Form.Item>
                        <Form.Item
                          label="Confirm"
                          name="confirmPassword"
                          rules={[
                            {
                              required: true,
                              message: "Please Input Confirm Password.",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Password does not match!")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input placeholder="password." type="password" />
                        </Form.Item>
                      </>
                    )}
                  </>
                )}
              </div>
            </Form>
          </Col>
          {user.users.role !== "admin" && (
            <Col xs={24} sm={24} md={24} lg={14}>
              <ResultLession
                data={
                  user.users && user.users.lessions?.length
                    ? user.users.lessions
                    : []
                }
              />
            </Col>
          )}
        </Row>
      </Col>
    </Spin>
  );
};
