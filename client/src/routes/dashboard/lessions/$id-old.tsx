import React from "react";
import {
  redirect,
  useActionData,
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
  Radio,
  Row,
  Space,
  Typography,
  Upload,
  UploadFile,
  Spin,
  notification,
  Select,
  UploadProps,
  message,
  Divider,
  InputNumber,
} from "antd";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import {
  SaveOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import modal from "antd/es/modal";
import { RcFile } from "antd/es/upload";

import * as API from "../../../api";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export async function loaderOld({ params }: any) {
  const lession = await API.getLession(params.id);

  return { lession: lession.data.data };
}

export async function actionOld({ request, params }: any) {
  const formData = await request.formData();
  const submitData = Object.fromEntries(formData);

  if (submitData.data) {
    const dataFormat = JSON.parse(submitData.data);
    switch (dataFormat.action) {
      case "edit":
        try {
          const { action, ...values } = dataFormat;
          const { data } = await API.updateLession(values, params.id);
          return { success: "update success" };
        } catch (e: any) {
          return { error: e.response.data.message };
        }
      case "delete":
        try {
          await API.deleteLession(params.id);
          return redirect("/dashboard/lessions");
        } catch (e: any) {
          return { error: e.response.data.message };
        }
    }
  } else {
    try {
      const res = await API.upload(formData);
      return {
        imagePath: res.data.url,
        name: res.data.label,
        type: submitData.type,
      };
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  }
}

export const LessionAdminSingle = () => {
  const { t } = useTranslation();
  const response = useActionData() as any;
  const { lession } = useLoaderData() as any;
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

  const anyChecked = Object.keys(lession.lession).filter((key: any) => {
    if (lession.lession[key] == true) {
      return key;
    }
  });

  const defaultCheckedList = anyChecked;

  const [checkedList, setCheckedList] = React.useState<any>(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const [haveVideo, setHaveVideo] = React.useState<boolean>(
    lession.lession && lession.lession.video_url ? true : false
  );
  const [videoLink, setVideoLink] = React.useState<string>(
    lession.lession.is_video_from ? lession.lession?.video_url : ""
  );
  const [isFormYoutube, setIsFromYoutube] = React.useState(
    lession.lession.is_video_from
  );

  const [haveContent, setHaveContent] = React.useState<boolean>(
    lession.lession.have_content
  );

  const [tempList, setTempList] = React.useState<UploadFile[]>([]);

  const [fileList1, setFileList1] = React.useState<UploadFile[]>(
    lession.lession && lession.lession.files_url_1
      ? [
          {
            name: lession.lession.files_url_1.label,
            uid: lession.lession.files_url_1,
            url: lession.lession.files_url_1,
          },
        ]
      : []
  );
  const [fileList2, setFileList2] = React.useState<UploadFile[]>(
    lession.lession && lession.lession.files_url_2
      ? [
          {
            name: lession.lession.files_url_2.label,
            uid: lession.lession.files_url_2,
            url: lession.lession.files_url_2,
          },
        ]
      : []
  );
  const [fileList3, setFileList3] = React.useState<UploadFile[]>(
    lession.lession && lession.lession.files_url_3
      ? [
          {
            name: lession.lession.files_url_3.label,
            uid: lession.lession.files_url_3,
            url: lession.lession.files_url_3,
          },
        ]
      : []
  );

  const [fileType, setFiletype] = React.useState<string>("");

  const [videoList, setVideoList] = React.useState<UploadFile[]>(
    lession.lession && lession.lession.video_url && !isFormYoutube
      ? [
          {
            name: lession.lession.video_url,
            uid: lession.lession.video_url,
            url: lession.lession.video_url,
          },
        ]
      : []
  );

  const [thumbnail, setThumbnail] = React.useState<UploadFile[]>(
    lession.lession.thumbnail_url
      ? [
          {
            uid: lession.lession.thumbnail_url,
            name: lession.lession.thumbnail_url,
            url: lession.lession.thumbnail_url,
          },
        ]
      : []
  );

  const [titleImage, setTitleImage] = React.useState<UploadFile[]>(
    lession.lession.photo_url
      ? [
          {
            uid: lession.lession.photo_url,
            name: lession.lession.photo_url,
            status: "done",
            url: lession.lession.photo_url,
          },
        ]
      : []
  );
  const [showQ, setShowQ] = React.useState<boolean>(true);

  const [uploading, setUploading] = React.useState(false);
  const [uploadingVid, setUploadingVid] = React.useState(false);

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList1.indexOf(file);
      const newFileList = fileList1.slice();
      newFileList.splice(index, 1);
      setFileList1(newFileList);
    },
    beforeUpload: (file) => {
      setTempList([...fileList1, file]);

      return false;
    },

    fileList: fileList1,
  };

  const props2: UploadProps = {
    onRemove: (file) => {
      const index = fileList2.indexOf(file);
      const newFileList = fileList2.slice();
      newFileList.splice(index, 1);
      setFileList2(newFileList);
    },
    beforeUpload: (file) => {
      setTempList([...fileList2, file]);

      return false;
    },

    fileList: fileList2,
  };

  const props3: UploadProps = {
    onRemove: (file) => {
      const index = fileList3.indexOf(file);
      const newFileList = fileList3.slice();
      newFileList.splice(index, 1);
      setFileList3(newFileList);
    },
    beforeUpload: (file) => {
      setTempList([...fileList3, file]);

      return false;
    },

    fileList: fileList3,
  };

  const propsVideo: UploadProps = {
    onRemove: (file) => {
      const index = videoList.indexOf(file);
      const newFileList = videoList.slice();
      newFileList.splice(index, 1);
      setVideoList(newFileList);
    },
    beforeUpload: (file) => {
      setTempList([...videoList, file]);

      return false;
    },
    fileList: videoList,
  };

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

  const onChangeThumbnail = async (photos: any) => {
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, type: "1" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  const onChangeTitleImage = async (photos: any) => {
    if (photos.fileList?.length) {
      submit(
        { file: photos.file, type: "2" },
        { method: "post", encType: "multipart/form-data" }
      );
    }
  };

  const handleChangeForm = (changedValues: any, allValues: any) => {
    setHaveContent(allValues.have_content);
    setHaveVideo(allValues.have_video);

    if (allValues.video_url) {
      setVideoLink(allValues.video_url);
    }
  };

  const handleSubmitCreateLession = (values: any) => {
    const data = Object.assign({}, values);

    data.files_url_1 = "";
    data.files_url_2 = "";
    data.files_url_3 = "";
    if (fileList1.length) {
      data.files_url_1 = fileList1[0].uid;
    }
    if (fileList2.length) {
      data.files_url_2 = fileList2[0].uid;
    }
    if (fileList3.length) {
      data.files_url_3 = fileList3[0].uid;
    }

    // data.files_url = [];

    data.video_url = isFormYoutube ? videoLink : videoList[0].uid;

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
    } else {
      data.posttests = [];
      data.pretests = [];
    }
    delete data.options;

    if (titleImage.length) {
      data.photo_url = titleImage[0].uid;
    }

    if (thumbnail.length) {
      data.thumbnail_url = thumbnail[0].uid;
    }
    if (!data.have_video) {
      data.video_url = "";
    }
    data.action = "edit";

    delete data.have_video;
    delete data.upload_url;
    delete data.th_url;

    submit({ data: JSON.stringify(data) }, { method: "post" });
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

  const handleUpload = async (type: any) => {
    if (tempList.length > 0) {
      const formData = new FormData();
      tempList.forEach((file) => {
        formData.append("file", file as RcFile);
        formData.append("type", type);
      });

      setFiletype(type);
      setUploading(true);
      // You can use any AJAX library you like
      await API.uploadFiles(formData)
        .then((res: any) => {
          setTempList([]);
          if (type === "1") {
            setFileList1((prev) => [
              ...prev,
              {
                name: res.data.label,
                uid: res.data.url,
                url: res.data.url,
              },
            ]);
          } else if (type === "2") {
            setFileList2((prev) => [
              ...prev,
              {
                name: res.data.label,
                uid: res.data.url,
                url: res.data.url,
              },
            ]);
          } else if (type === "3") {
            setFileList3((prev) => [
              ...prev,
              {
                name: res.data.label,
                uid: res.data.url,
                url: res.data.url,
              },
            ]);
          }

          message.success("upload successfully.");
        })
        .catch(() => {
          message.error("upload failed.");
        })
        .finally(() => {
          setUploading(false);
        });
    }
  };

  const handleUploadVideo = async () => {
    if (tempList.length > 0) {
      const formData = new FormData();
      tempList.forEach((file) => {
        formData.append("file", file as RcFile);
      });
      setUploadingVid(true);
      // You can use any AJAX library you like

      await API.uploadVideo(formData)
        .then((res: any) => {
          setTempList([]);
          setVideoList([
            {
              name: res.data.label,
              uid: res.data.url,
              url: res.data.url,
            },
          ]);
          message.success("upload successfully.");
        })
        .catch(() => {
          message.error("upload failed.");
        })
        .finally(() => {
          setUploadingVid(false);
        });
    }
  };

  React.useEffect(() => {
    if (response && response.type == "1") {
      setThumbnail([
        {
          uid: response.imagePath,
          name: response.name,
          status: "done",
          url: response.imagePath,
        },
      ]);
    }
    if (response && response.type == "2") {
      setTitleImage([
        {
          uid: response.imagePath,
          name: response.name,
          status: "done",
          url: response.imagePath,
        },
      ]);
    }
    if (response && response.success) {
      notification.success({
        message: response.success,
        placement: "bottomLeft",
        duration: 4.5,
      });
    }
    if (response && response.error) {
      notification.error({
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
      <Col style={{ padding: "24px" }}>
        <Form
          scrollToFirstError={true}
          form={form}
          initialValues={{
            ...lession.lession,
            options:
              lession.lession && lession.lession.pretests.length
                ? lession.lession.pretests
                : lession.lession.posttests,
            have_video:
              lession.lession && lession.lession.video_url ? true : false,
          }}
          onFinish={handleSubmitCreateLession}
          onValuesChange={handleChangeForm}
          layout="vertical"
        >
          <Row
            justify="end"
            style={{ padding: "12px 0px 12px 0px", marginBottom: "24px" }}
          >
            <Space size="middle">
              {/* <Button
                type="default"
                onClick={() => handleExportData(lession.lession)}
              >
                {t("Export")}
              </Button> */}

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
          Thumbnail Image (500 x 500 px)
          <Form.Item
            name="th_url"
            rules={[
              {
                required: thumbnail.length ? false : true,
                message: "Please Upload Thumbnail Image.",
              },
            ]}
          >
            <Upload
              fileList={thumbnail}
              className="upload-lession"
              listType="picture-card"
              name="file"
              beforeUpload={(file) => {
                return false;
              }}
              onRemove={() => setThumbnail([])}
              onChange={onChangeThumbnail}
              maxCount={1}
            >
              {thumbnail.length > 0 ? null : "Upload"}
            </Upload>
          </Form.Item>
          <Divider />
          {titleImage.length ? (
            <div
              style={{
                backgroundImage: `url(${titleImage[0].url})`,
                backgroundSize: "cover",
                paddingBottom: "53%",
                marginBottom: "24px",
                marginTop: "24px",
              }}
            ></div>
          ) : (
            <></>
          )}
          Single Page Image (1920 x 1080 px)
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
            {titleImage.length > 0 ? null : "Upload"}
          </Upload>
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
                    <Form.Item
                      name="upload_url"
                      rules={[
                        {
                          required: videoList.length ? false : true,
                          message: "Please Upload Video File",
                        },
                      ]}
                    >
                      <Upload
                        {...propsVideo}
                        name="file"
                        maxCount={1}
                        onChange={handleUploadVideo}
                      >
                        {!videoList.length && (
                          <Button loading={uploadingVid}>Select Video</Button>
                        )}
                      </Upload>
                    </Form.Item>
                  )}
                </>
              )}
              {haveVideo ? (
                <>
                  {isFormYoutube && (
                    <>
                      <ReactPlayer
                        url={videoLink}
                        // url={`${baseURL}/upload/${videoLink}`}
                        width="100%"
                        height="300px"
                      />
                    </>
                  )}
                  {!isFormYoutube && videoList.length ? (
                    <>
                      <video
                        width="100%"
                        height="300px"
                        controls
                        src={videoList[0].url}
                        // src={`${baseURL}/upload/${videoList[0].url}`}
                      ></video>
                    </>
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
            <Upload
              {...props}
              name="files1"
              maxCount={1}
              onChange={() => handleUpload("1")}
              listType="picture-card"
            >
              {fileList1.length < 1 && (
                <Button type="link" loading={fileType === "1" && uploading}>
                  Select File
                </Button>
              )}
            </Upload>
            <Upload
              {...props2}
              name="files2"
              maxCount={1}
              onChange={() => handleUpload("2")}
              listType="picture-card"
            >
              {fileList2.length < 1 && (
                <Button type="link" loading={fileType === "2" && uploading}>
                  Select File
                </Button>
              )}
            </Upload>
            <Upload
              {...props3}
              name="files3"
              maxCount={1}
              onChange={() => handleUpload("3")}
              listType="picture-card"
            >
              {fileList3.length < 1 && (
                <Button type="link" loading={fileType === "" && uploading}>
                  Select File
                </Button>
              )}
            </Upload>
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
                            {lession.result_test &&
                              !(
                                lession.result_test.is_test_pretest ||
                                lession.result_test.is_test_posttest
                              ) && (
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                />
                              )}
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
                              <TextArea
                                style={{ minWidth: "300px" }}
                                rows={5}
                              />
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
                              <TextArea
                                style={{ minWidth: "300px" }}
                                rows={5}
                              />
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
                              <TextArea
                                style={{ minWidth: "300px" }}
                                rows={5}
                              />
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
                              <TextArea
                                style={{ minWidth: "300px" }}
                                rows={5}
                              />
                            </Form.Item>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  ))}

                  {lession.result_test &&
                    !(
                      lession.result_test.is_test_pretest ||
                      lession.result_test.is_test_posttest
                    ) && (
                      <Form.Item>
                        <Row justify="center">
                          <Button onClick={() => add()} type="primary">
                            {t("add_more_question")}
                          </Button>
                        </Row>
                      </Form.Item>
                    )}
                </>
              )}
            </Form.List>
          )}
        </Form>
        {/* )} */}
      </Col>
    </Spin>
  );
};
