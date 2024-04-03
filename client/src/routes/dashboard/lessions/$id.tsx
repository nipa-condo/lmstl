import React from "react";
import {
  redirect,
  useSubmit,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Spin,
  Select,
  Divider,
  InputNumber,
  Image,
} from "antd";
import { useTranslation } from "react-i18next";
import {
  SaveOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import modal from "antd/es/modal";
import { isArray } from "lodash";

import * as API from "../../../api";
import { UploadFiles } from "../../../components/common";
import { FormList } from "../../../components/dashboard/lession";

export async function loader({ params }: any) {
  const lession = await API.getLession(params.id);

  return { data: lession.data.data };
}

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  const dataFormat = JSON.parse(submitData.data);

  switch (request.method) {
    case "PUT":
      try {
        const { action, ...values } = dataFormat;
        const { data } = await API.updateLession(dataFormat, params.id);

        return { success: "update success" };
      } catch (e: any) {
        return { error: e.response.data.message };
      }
    case "DELETE":
      try {
        await API.deleteLession(params.id);

        console.log("delete success");

        return redirect("/dashboard/lessions");
      } catch (e: any) {
        return { error: e.response.data.message };
      }
    default:
      return { error: "action not found" };
  }
}

const transformUrlToArrays = (url: string) => {
  if (url) {
    const name = url.split("-").pop();
    const fileType = url.split(".").pop();

    return [
      {
        uid: url,
        name: `${name}.${fileType}`,
        status: "done",
        url: url,
      },
    ];
  }
  return [];
};

export const LessionAdminSingle = () => {
  const { t } = useTranslation();
  const { data } = useLoaderData() as any;

  const lession = data?.lession;
  const resultTest = data?.result_test;

  const navigation = useNavigation();
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const { useForm } = Form;
  const submit = useSubmit();
  const [form] = useForm();

  const CheckboxGroup = Checkbox.Group;

  const plainOptions = [
    { label: "pretest", value: "have_pretest" },
    { label: "posttest", value: "have_posttest" },
    { label: "result", value: "have_result" },
    { label: "random", value: "is_random" },
  ];

  const anyChecked = Object.keys(lession).filter((key: any) => {
    if (lession[key] == true) {
      return key;
    }
  });

  const defaultCheckedList = anyChecked;

  const [checkedList, setCheckedList] = React.useState<any>(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const [haveVideo, setHaveVideo] = React.useState<boolean>(
    lession && lession.video_url ? true : false
  );

  const [isFormYoutube, setIsFromYoutube] = React.useState(
    lession.is_video_from
  );

  const [videoLink, setVideoLink] = React.useState<string>(lession.video_url);

  const [haveContent, setHaveContent] = React.useState<boolean>(
    lession.have_content
  );

  const [thumbnailUrl, setThumbnailUrl] = React.useState<string>(
    lession.thumbnail_url
  );
  const [photoUrl, setPhotoUrl] = React.useState<string>(lession.photo_url);

  const [showQ, setShowQ] = React.useState<boolean>(true);

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
    if (
      list.indexOf("have_pretest") > -1 ||
      list.indexOf("have_posttest") > -1
    ) {
      setShowQ(true);
    } else {
      setShowQ(false);
    }
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(
      e.target.checked ? plainOptions.map((data: any) => data.value) : []
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    setShowQ(e.target.checked);
  };

  const onSubmit = async (values: any) => {
    const payload = Object.assign({}, values);

    const urlKeys = [
      "thumbnail_url",
      "photo_url",
      "video_url",
      "files_url_1",
      "files_url_2",
      "files_url_3",
    ];

    urlKeys.forEach((key) => {
      if (isArray(payload[key]) && payload[key].length > 0) {
        const keyValue = payload[key][0];

        payload[key] = keyValue.url ? keyValue.url : keyValue.response?.url;
      } else {
        const keyValue =
          payload[key] && payload[key].length ? payload[key][0] : null;

        payload[key] = keyValue ? keyValue.url : null;
      }
    });

    submit(
      { action: "edit", data: JSON.stringify(payload) },
      { method: "put" }
    );
  };

  const handleChangeForm = (changedValues: any, allValues: any) => {
    setHaveContent(allValues.have_content);
    setHaveVideo(allValues.have_video);

    if (isArray(allValues.video_url) && allValues.video_url.length) {
      const keyValue = allValues.video_url[0];

      setVideoLink(keyValue.url ? keyValue.url : keyValue.response?.url);
    } else {
      setVideoLink(allValues.video_url);
    }

    if (isArray(allValues.thumbnail_url) && allValues.thumbnail_url.length) {
      const keyValue = allValues.thumbnail_url[0];

      setThumbnailUrl(keyValue.url ? keyValue.url : keyValue.response?.url);
    } else {
      setThumbnailUrl(allValues.thumbnail_url);
    }

    if (isArray(allValues.photo_url) && allValues.photo_url.length) {
      const keyValue = allValues.photo_url[0];

      setPhotoUrl(keyValue.url ? keyValue.url : keyValue.response?.url);
    } else {
      setPhotoUrl(allValues.photo_url);
    }
  };

  const handleDelete = () => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to delete this lession?",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        submit(
          { data: JSON.stringify({ action: "delete" }) },
          { method: "delete" }
        );
      },
    });
  };

  React.useEffect(() => {
    form.setFieldsValue({
      ...lession,
      options:
        lession && lession.pretests.length
          ? lession.pretests
          : lession.posttests,
      have_video: lession && lession.video_url ? true : false,
      video_url: isFormYoutube
        ? lession.video_url
        : transformUrlToArrays(lession.video_url),
      thumbnail_url: transformUrlToArrays(lession.thumbnail_url),
      photo_url: transformUrlToArrays(lession.photo_url),
      files_url_1: transformUrlToArrays(lession.files_url_1),
      files_url_2: transformUrlToArrays(lession.files_url_2),
      files_url_3: transformUrlToArrays(lession.files_url_3),
    });
  }, [form]);

  return (
    <Spin
      spinning={
        navigation.state === "loading" || navigation.state === "submitting"
      }
    >
      <Form
        scrollToFirstError={true}
        form={form}
        onFinish={onSubmit}
        onValuesChange={handleChangeForm}
        layout="vertical"
        style={{ padding: "24px" }}
      >
        <Row
          justify="end"
          style={{ padding: "12px 0px 12px 0px", marginBottom: "24px" }}
        >
          <Space size="middle">
            <Button
              onClick={handleDelete}
              icon={<DeleteOutlined />}
              style={{ cursor: "pointer" }}
              loading={
                navigation.state === "loading" ||
                navigation.state === "submitting"
              }
            >
              {t("Delete")}
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              icon={<SaveOutlined />}
              loading={
                navigation.state === "loading" ||
                navigation.state === "submitting"
              }
            >
              {t("save")}
            </Button>
          </Space>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography style={{ marginBottom: "20px" }}>
              Thumbnail Image (500 x 500 px)
            </Typography>
            <UploadFiles
              form={form}
              multiple={false}
              name="thumbnail_url"
              maxCount={1}
              type="image"
            />
          </Col>
          <Col span={24}>
            <Typography style={{ marginBottom: "20px" }}>
              Thumbnail Image preview (500 x 500 px)
            </Typography>
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                width={500}
                preview
                style={{ objectFit: "cover" }}
              />
            )}
          </Col>
        </Row>

        <Divider style={{ margin: "40px 0px 40px 0px" }} />

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography style={{ marginBottom: "20px" }}>
              Single Page Image (1920 x 1080 px)
            </Typography>
            <UploadFiles
              form={form}
              multiple={false}
              name="photo_url"
              maxCount={1}
              type="image"
            />
          </Col>
          <Col span={24}>
            <Typography style={{ marginBottom: "20px" }}>
              Single Page Image Preview (1920 x 1080 px)
            </Typography>
            {photoUrl && (
              <Image
                src={photoUrl}
                width={800}
                preview
                style={{ objectFit: "cover" }}
              />
            )}
          </Col>
        </Row>

        <Col style={{ padding: "24px 0px 12px 0px" }}>
          <Text>{t("overview")} </Text>
        </Col>
        <Col span={12}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please Input Title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="order" label="Order">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="subtitle" label="Subtitle">
            <TextArea
              showCount
              maxLength={100}
              autoSize={{ minRows: 3, maxRows: 3 }}
            />
          </Form.Item>
        </Col>
        <Space size="large" align="center">
          <Title level={2} className="title-no-margin">
            {t("content")}
          </Title>
          <Form.Item name="have_content" valuePropName="checked">
            <Checkbox checked style={{ marginTop: "20px" }}>
              content
            </Checkbox>
          </Form.Item>
        </Space>
        <Space size="large" align="center">
          <Form.Item name="have_video" valuePropName="checked">
            <Checkbox checked style={{ marginTop: "20px" }}>
              video
            </Checkbox>
          </Form.Item>
          {haveVideo && (
            <Form.Item name="is_video_from">
              <Select
                onChange={(value: any) => {
                  setIsFromYoutube(value);
                  form.setFieldValue("video_url", []);
                }}
                options={[
                  { value: true, label: "From Youtube" },
                  { value: false, label: "From Upload" },
                ]}
              />
            </Form.Item>
          )}
        </Space>
        <Row gutter={20}>
          <Col xs={24} sm={24} md={24} lg={14}>
            {haveVideo && (
              <>
                {isFormYoutube ? (
                  <Form.Item
                    name="video_url"
                    rules={[
                      {
                        required: true,
                        message: "Please Input Youtube Link",
                      },
                    ]}
                  >
                    <Input placeholder="Youtube Link ..." />
                  </Form.Item>
                ) : (
                  <UploadFiles
                    form={form}
                    multiple={false}
                    name="video_url"
                    maxCount={1}
                    type="video"
                  />
                )}
              </>
            )}

            {haveVideo ? (
              <>
                {isFormYoutube ? (
                  videoLink ? (
                    <ReactPlayer
                      key={videoLink}
                      url={videoLink}
                      width="100%"
                      height="300px"
                    />
                  ) : (
                    <></>
                  )
                ) : videoLink ? (
                  <video width="100%" height="300px" controls src={videoLink} />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </Col>
          {haveContent && (
            <Col xs={24} sm={24} md={24} lg={10}>
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Please Input Content",
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={10000}
                  autoSize={{ minRows: 20 }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Space style={{ marginTop: "30px" }}>
          <UploadFiles
            form={form}
            multiple={false}
            name="files_url_1"
            maxCount={1}
            type="file"
          />
          <UploadFiles
            form={form}
            multiple={false}
            name="files_url_2"
            maxCount={1}
            type="file"
          />
          <UploadFiles
            form={form}
            multiple={false}
            name="files_url_3"
            maxCount={1}
            type="file"
          />
        </Space>
        <Row style={{ paddingTop: "24px" }}>
          <Col span={3}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Check all
            </Checkbox>
          </Col>

          <CheckboxGroup
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
          />
        </Row>
        {showQ && <FormList lession={lession} resultTest={resultTest} />}
      </Form>
    </Spin>
  );
};
