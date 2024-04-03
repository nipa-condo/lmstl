import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Image,
  Typography,
  Upload,
  UploadFile,
  Space,
  notification,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  SaveOutlined,
  PhoneOutlined,
  PushpinOutlined,
  MailOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import {
  useSubmit,
  useLoaderData,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { HomePhoto, Line, LogoAdmin, PicTypeThree } from "../../assets/images";

import * as API from "../../api";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function loader({ params }: any) {
  const setting = await API.getSetting();

  return { setting: setting.data.data };
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  if (submitData.data) {
    const dataFormat = JSON.parse(submitData.data);

    try {
      const { data } = await API.updateSetting(dataFormat);
      return { success: "update success" };
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  } else {
    try {
      const res = await API.upload(formData);
      return {
        imagePath: res.data.url,
        type: submitData.type,
        name: res.data.label,
      };
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  }
}

export const Setting = () => {
  const { setting } = useLoaderData() as any;
  const response = useActionData() as any;

  const { t } = useTranslation();
  const { Title, Text } = Typography;
  const submit = useSubmit();
  const navigation = useNavigation();

  const [themeColor, setThemeColor] = React.useState(
    setting.setting.background_color
  );

  const [logoImage, setLogoImage] = React.useState<UploadFile[]>([
    {
      uid: "-1",
      name: setting.setting.place_holder_url,
      status: "done",
      url: setting.setting.place_holder_url
        ? // ? `${baseURL}/upload/${setting.setting.place_holder_url}`
          setting.setting.place_holder_url
        : LogoAdmin,
    },
  ]);

  const [homeImage, setHomeImage] = React.useState<UploadFile[]>([
    {
      uid: "-1",
      name: setting.setting.home_photo_url,
      status: "done",
      url: setting.setting.home_photo_url
        ? // ? `${baseURL}/upload/${setting.setting.home_photo_url}`
          setting.setting.home_photo_url
        : HomePhoto,
    },
  ]);

  const [signinImage, setSigninImage] = React.useState<UploadFile[]>([
    {
      uid: "-1",
      name: setting.setting.sign_in_photo_url,
      status: "done",
      url: setting.setting.sign_in_photo_url
        ? // ? `${baseURL}/upload/${setting.setting.sign_in_photo_url}`
          setting.setting.sign_in_photo_url
        : PicTypeThree,
    },
  ]);

  const [regisImage, setRegisImage] = React.useState<UploadFile[]>([
    {
      uid: "-1",
      name: setting.setting.register_photo_url,
      status: "done",
      url: setting.setting.register_photo_url
        ? // ? `${baseURL}/upload/${setting.setting.register_photo_url}`
          setting.setting.register_photo_url
        : PicTypeThree,
    },
  ]);

  const handleOnFinish = (values: any) => {
    const data = Object.assign({}, values);
    data.home_photo_url = homeImage[0].name;
    data.sign_in_photo_url = signinImage[0].name;
    data.register_photo_url = regisImage[0].name;
    data.place_holder_url = logoImage[0].name;
    data.background_color = themeColor;

    submit({ data: JSON.stringify(data) }, { method: "post" });
  };

  const onChangeHomePhoto = async (photos: any) => {
    setHomeImage(photos.fileList);
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, type: "1" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  const onChangeSigninPhoto = async (photos: any) => {
    setSigninImage(photos.fileList);
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, type: "2" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  const onChangeRegisPhoto = async (photos: any) => {
    setRegisImage(photos.fileList);
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, type: "3" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  const onChangeLogoPhoto = async (photos: any) => {
    setLogoImage(photos.fileList);
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, type: "4" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  React.useEffect(() => {
    if (response && response.imagePath && response.type == "1") {
      setHomeImage([
        {
          uid: "-1",
          name: response.imagePath,
          status: "done",
          url: response.imagePath,
          // url: `${baseURL}/upload/${response.imagePath}`,
        },
      ]);
    }
    if (response && response.imagePath && response.type == "2") {
      setSigninImage([
        {
          uid: "-1",
          name: response.imagePath,
          status: "done",
          url: response.imagePath,
          // url: `${baseURL}/upload/${response.imagePath}`,
        },
      ]);
    }
    if (response && response.imagePath && response.type == "3") {
      setRegisImage([
        {
          uid: "-1",
          name: response.imagePath,
          status: "done",
          url: response.imagePath,
          // url: `${baseURL}/upload/${response.imagePath}`,
        },
      ]);
    }
    if (response && response.imagePath && response.type == "4") {
      setLogoImage([
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

  React.useEffect(() => {
    if (response && response.success) {
      notification.success({
        message: response.success,
        placement: "bottomLeft",
        duration: 4.5,
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
    <Spin
      spinning={
        navigation.state === "loading" || navigation.state === "submitting"
      }
    >
      <Col style={{ paddingTop: "30px" }}>
        <Form
          onFinish={handleOnFinish}
          labelCol={{ xs: 6, sm: 8, md: 6, lg: 5 }}
          wrapperCol={{ xs: 24, sm: 24, md: 14, lg: 14 }}
          labelAlign="left"
          initialValues={setting.setting}
        >
          <Row justify="space-between">
            <Title>{t("component_setting")}</Title>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={
                navigation.state === "loading" ||
                navigation.state === "submitting"
              }
            >
              {t("save")}
            </Button>
          </Row>
          <Space size="middle" direction="vertical">
            <Space size="middle" direction="vertical">
              <Text>
                {t("This image is displayed on the header bar. (500 x 500 px)")}
              </Text>

              <Upload
                listType="picture-card"
                name="file"
                fileList={logoImage}
                beforeUpload={(file) => {
                  return false;
                }}
                onRemove={() => setLogoImage([])}
                onChange={onChangeLogoPhoto}
                maxCount={1}
              >
                {logoImage.length ? null : "Upload"}
              </Upload>
            </Space>

            <Space size="middle" direction="vertical">
              <Text>
                {t(
                  "This image is displayed on the homepage and resultpage banner. (1920 x 1080 px)"
                )}
              </Text>

              {homeImage.length ? (
                <Image
                  src={`${homeImage[0].url}`}
                  style={{ maxHeight: "400px" }}
                />
              ) : (
                <></>
              )}
              <Upload
                listType="picture-card"
                name="file"
                fileList={homeImage}
                beforeUpload={(file) => {
                  return false;
                }}
                onRemove={() => setHomeImage([])}
                onChange={onChangeHomePhoto}
                maxCount={1}
              >
                {homeImage.length ? null : "Upload"}
              </Upload>
            </Space>
          </Space>
          <Divider />
          <Form.Item name="home_title" label={t("title")}>
            <Input />
          </Form.Item>
          <Form.Item name="home_subtitle" label={t("sub_title")}>
            <Input />
          </Form.Item>

          <Space size="middle" direction="vertical">
            <Text>
              {t(
                "This image is displayed on background of the signin page. (1920 x 1080 px)"
              )}
            </Text>

            {signinImage.length ? (
              <Image
                src={`${signinImage[0].url}`}
                style={{ maxHeight: "400px" }}
              />
            ) : (
              <></>
            )}
            <Upload
              listType="picture-card"
              name="file"
              fileList={signinImage}
              beforeUpload={(file) => {
                return false;
              }}
              onRemove={() => setSigninImage([])}
              onChange={onChangeSigninPhoto}
              maxCount={1}
            >
              {signinImage.length ? null : "Upload"}
            </Upload>
          </Space>

          <Divider />
          <Form.Item name="sign_in_title" label={t("title_login")}>
            <Input />
          </Form.Item>
          <Form.Item name="sign_in_subtitle" label={t("sub_title_login")}>
            <Input />
          </Form.Item>

          <Space size="middle" direction="vertical">
            <Text>
              {t("This image is displayed on background of the register page.")}
            </Text>

            {regisImage.length ? (
              <Image
                src={`${regisImage[0].url}`}
                style={{ maxHeight: "400px" }}
              />
            ) : (
              <></>
            )}
            <Upload
              listType="picture-card"
              name="file"
              fileList={regisImage}
              beforeUpload={(file) => {
                return false;
              }}
              onRemove={() => setRegisImage([])}
              onChange={onChangeRegisPhoto}
              maxCount={1}
            >
              {regisImage.length ? null : "Upload"}
            </Upload>
          </Space>
          <Divider />
          <Form.Item name="register_title" label={t("title_register")}>
            <Input />
          </Form.Item>
          <Form.Item name="register_subtitle" label={t("subtitle_register")}>
            <Input />
          </Form.Item>

          <Title level={3}>{t("get_in_touch")}</Title>
          <Col xs={16} sm={16} md={8} lg={10}>
            <Form.Item label={<PhoneOutlined />} name="phone">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={16} sm={16} md={8} lg={10}>
            <Form.Item label={<PushpinOutlined />} name="location">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={16} sm={16} md={8} lg={10}>
            <Form.Item label={<MailOutlined />} name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={16} sm={16} md={8} lg={10}>
            <Form.Item
              label={<FacebookFilled style={{ fontSize: "18px" }} />}
              name="facebook"
            >
              <Input placeholder="Facebook URL" />
            </Form.Item>
          </Col>
          <Col xs={16} sm={16} md={8} lg={10}>
            <Form.Item label={<Image src={Line} width="20px" />} name="line">
              <Input placeholder="Line URL" />
            </Form.Item>
          </Col>

          <Col xs={16} sm={16} md={8} lg={10}>
            <Form.Item label={"Copy Right"} name="copyright">
              <Input />
            </Form.Item>
          </Col>
          <Title level={3}>{t("chat-bot_setting")}</Title>
          <Text>
            {t(
              "You can update Chatbot Auo-Response Message by the link here :"
            )}
          </Text>
          {/* google sheet link */}
          <Button
            type="link"
            href="https://dialogflow.cloud.google.com/#/agent/cloud-computing-app-ucgf/intents"
            target="_blank"
          >
            https://dialogflow.cloud.google.com/#/agent/cloud-computing-app-ucgf/intents
          </Button>
        </Form>
      </Col>
    </Spin>
  );
};
