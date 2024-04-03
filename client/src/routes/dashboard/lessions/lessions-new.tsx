import React from "react";
import { redirect, useNavigation, useSubmit } from "react-router-dom";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  Image,
  Select,
  Divider,
  InputNumber,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import { SaveOutlined, MinusCircleOutlined } from "@ant-design/icons";

import * as API from "../../../api";

import { UploadFiles } from "../../../components/common";
import { isArray } from "lodash";

export async function action({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  if (submitData.data) {
    const dataFormat = JSON.parse(submitData.data);
    try {
      const { data } = await API.createLession(dataFormat);
      return redirect(`/dashboard/lessions/${data.data.lession.id}/edit`);
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  } else {
    try {
      const res = await API.upload(formData);
      return { imagePath: res.data.url, type: submitData.type };
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  }
}

export const LessionAdminNew = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { Title, Text } = Typography;
  const { TextArea } = Input;

  const [form] = Form.useForm();

  const submit = useSubmit();
  const CheckboxGroup = Checkbox.Group;

  const [checkedList, setCheckedList] = React.useState<any>(["have_pretest"]);
  const plainOptions = [
    { label: "pretest", value: "have_pretest" },
    { label: "posttest", value: "have_posttest" },
    { label: "result", value: "have_result" },
    { label: "random", value: "is_random" },
  ];

  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const [haveVideo, setHaveVideo] = React.useState<boolean>(false);
  const [videoLink, setVideoLink] = React.useState<string>("");
  const [isFormYoutube, setIsFromYoutube] = React.useState(true);
  const [haveContent, setHaveContent] = React.useState<boolean>(true);
  const [showQ, setShowQ] = React.useState<boolean>(true);

  const [thumbnailUrl, setThumbnailUrl] = React.useState<string>("");
  const [photoUrl, setPhotoUrl] = React.useState<string>("");

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

  const handleSubmitCreateLession = (values: any) => {
    const data = Object.assign({}, values);

    const urlKeys = [
      "thumbnail_url",
      "photo_url",
      "video_url",
      "files_url_1",
      "files_url_2",
      "files_url_3",
    ];

    urlKeys.forEach((key) => {
      if (isArray(data[key]) && data[key].length > 0) {
        const keyValue = data[key][0];

        data[key] = keyValue.url ? keyValue.url : keyValue.response?.url;
      } else {
        data[key] = "";
      }
    });

    checkedList.indexOf("have_pretest") > -1
      ? (data.have_pretest = true)
      : (data.have_pretest = false);

    checkedList.indexOf("have_posttest") > -1
      ? (data.have_posttest = true)
      : (data.have_posttest = false);

    checkedList.indexOf("have_result") > -1
      ? (data.have_result = true)
      : (data.have_result = false);

    checkedList.indexOf("is_random") > -1
      ? (data.is_random = true)
      : (data.is_random = false);

    if (data.options && data.options?.length) {
      data.have_pretest ? (data.pretests = data.options) : (data.pretests = []);
      data.have_posttest
        ? (data.posttests = data.options)
        : (data.posttests = []);

      delete data.options;
    }
    if (!data.have_video) {
      data.video_url = "";
    }

    submit({ data: JSON.stringify(data) }, { method: "post" });
  };

  return (
    <Spin
      spinning={
        navigation.state === "loading" || navigation.state === "submitting"
      }
    >
      <Form
        scrollToFirstError={true}
        form={form}
        onFinish={handleSubmitCreateLession}
        onValuesChange={handleChangeForm}
        layout="vertical"
        initialValues={{
          have_content: true,
          options: [
            {
              answer_1: undefined,
              answer_2: undefined,
              answer_3: undefined,
              answer_4: undefined,
              correct_answer: undefined,
              question: undefined,
            },
          ],
        }}
      >
        <Row justify="end" style={{ padding: "12px 0px 12px 0px" }}>
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
        <Col span={8}>
          <Space size={[16, 16]} wrap>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please Input Title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="order" label="Order">
              <InputNumber defaultValue={0} />
            </Form.Item>
          </Space>
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
        <Space size="small" align="center">
          <Form.Item name="have_video" valuePropName="checked">
            <Checkbox checked style={{ marginTop: "20px" }}>
              Video
            </Checkbox>
          </Form.Item>
          {haveVideo && (
            <Form.Item name="is_video_from">
              <Select
                defaultValue={true}
                onChange={(value: any) => {
                  setIsFromYoutube(value);
                  form.setFieldValue("video_url", "");
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
        {showQ && (
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Col key={key}>
                    <Form.Item
                      label={
                        <Space size="large">
                          <Text>{`Question ${name + 1}`}</Text>
                          <MinusCircleOutlined onClick={() => remove(name)} />
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
                            <TextArea style={{ minWidth: "300px" }} />
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
                            <TextArea style={{ minWidth: "300px" }} />
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
                            <TextArea style={{ minWidth: "300px" }} />
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
                            <TextArea style={{ minWidth: "300px" }} />
                          </Form.Item>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                ))}

                <Form.Item>
                  <Row justify="center">
                    <Button onClick={() => add()} type="primary">
                      {t("add_more_question")}{" "}
                    </Button>
                  </Row>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
      </Form>
    </Spin>
  );
};
