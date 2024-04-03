import React, { useTransition } from "react";
import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Typography,
  Form,
  Input,
  Upload,
  UploadFile,
  notification,
} from "antd";
import {
  redirect,
  useNavigate,
  useLoaderData,
  useSubmit,
  useActionData,
  useNavigation,
  useParams,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../components/contexts/AuthContext";
import { InfoContent } from "../components/home";
import { AppLayout } from "../components/layout";
import { mustAuthenStudent } from "../config";
import * as API from "../api";
import { LogoAdmin } from "../assets/images";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function loader({ params }: any) {
  const userData = await mustAuthenStudent();
  return userData ? userData : redirect("/signin");
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  switch (submitData.key) {
    case "update":
      try {
        const dataFormat = JSON.parse(submitData.data);
        const { id, ...values } = dataFormat;
        const data = await API.updateStudent(values, id);

        return { success: "success", message: "Update Successfully" };
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

export const Profile = () => {
  const { userData } = useLoaderData() as any;
  const response = useActionData() as any;
  const { state } = useNavigation();
  const { setting, user } = React.useContext(AuthContext);

  const { Title, Text } = Typography;

  const navigate = useNavigate();
  const submit = useSubmit();

  const [open, setOpen] = React.useState(false);
  const [titleImage, setTitleImage] = React.useState<UploadFile[]>([
    {
      uid: "-1",
      name: userData?.photo_url,
      status: "done",
      url: userData?.photo_url
        ? `${baseURL}/upload/${userData.photo_url}`
        : setting?.place_holder_url
        ? `${baseURL}/upload/${setting?.place_holder_url}`
        : LogoAdmin,
    },
  ]);

  const handleOnFinish = (values: any) => {
    const data = Object.assign({}, values);

    if (response?.imagePath) {
      data.photo_url = response.imagePath;
    }
    data.id = userData.id;
    setOpen(false);
    submit({ key: "update", data: JSON.stringify(data) }, { method: "put" });
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
          url: `${baseURL}/upload/${response.imagePath}`,
        },
      ]);
    }
  }, [response]);

  return (
    <AppLayout>
      <Modal
        title="Edit Profile"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button
            key="submit"
            block
            form="user-edit"
            htmlType="submit"
            type="primary"
            loading={state === "loading" || state === "submitting"}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          id="user-edit"
          onFinish={handleOnFinish}
          labelCol={{ xs: 6, sm: 8, md: 6, lg: 8 }}
          wrapperCol={{ xs: 24, sm: 24, md: 14, lg: 16 }}
          labelAlign="left"
          initialValues={userData}
        >
          <div style={{ textAlign: "center" }}>
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
          </div>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email Adress!",
              },
            ]}
          >
            <Input disabled={true} placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item label="Last name" name="lastname">
            <Input placeholder="Last name" />
          </Form.Item>

          <Form.Item label="Class" name="class">
            <Input placeholder="Class" />
          </Form.Item>
          <Form.Item label="No." name="class_number">
            <Input placeholder="NO." />
          </Form.Item>
        </Form>
      </Modal>

      <div className="app-container">
        <div
          className="content-container"
          style={{
            background: "#f3f4f6",
          }}
        >
          <div className="content-inner" style={{ flexDirection: "column" }}>
            <div style={{ flexGrow: 1, display: "flex", padding: "3rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#FAFAFA",
                  width: "100%",
                  borderRadius: "30px",
                  padding: "20px",
                }}
              >
                <Row justify="end">
                  <Col
                    style={{
                      display: "flex",
                      alignSelf: "center",
                      flexDirection: "column",
                      paddingRight: "30px",
                    }}
                  >
                    <Row justify="end">
                      {userData?.firstname} {userData?.lastname}
                    </Row>
                    <Row justify="end">Email : {userData?.email}</Row>
                    <div>
                      <Space size="middle">
                        <Text>Class : {userData?.class}</Text>
                        <Text>No : {userData?.class_number} </Text>
                      </Space>
                    </div>
                  </Col>
                  <Col style={{ position: "relative" }}>
                    <div
                      style={{
                        height: "200px",
                        width: "200px",
                        borderRadius: "50%",

                        backgroundImage: userData?.photo_url
                          ? // ? `url(${baseURL}/upload/${userData.photo_url})`
                            userData.photo_url
                          : setting?.place_holder_url,
                        // ? `url(${baseURL}/upload/${setting?.place_holder_url})`
                        // : `url(${LogoAdmin})`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </Col>
                </Row>
                <Row>
                  <Button
                    disabled={user.id === 1}
                    block
                    type="primary"
                    onClick={() => setOpen(true)}
                  >
                    Edit Profile
                  </Button>
                </Row>
              </div>
            </div>
            <Space direction="vertical" size="middle" align="center">
              <Button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  navigate("/signin");
                }}
              >
                LOG OUT
              </Button>
            </Space>

            <InfoContent data={setting} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
