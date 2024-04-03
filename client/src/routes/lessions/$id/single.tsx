import { Button, Col, Row, Space, Typography, Upload, UploadFile } from "antd";
import { useTranslation } from "react-i18next";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";
import React from "react";
import * as API from "../../../api";
import YouTube from "@u-wave/react-youtube";
import queryString from "query-string";
import Swal from "sweetalert2";
import ReactPlayer from "react-player";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export const LessionsSingle = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const nevigate = useNavigate();
  const { Title, Text } = Typography;
  const { lession } = useRouteLoaderData("lession-single-root") as any;
  const [youtubeLink, setYoutubeLink] = React.useState<string>("");
  const [videoLink, setVidioLink] = React.useState<string>("");
  const [fileList1, setFileList1] = React.useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = React.useState<UploadFile[]>([]);
  const [fileList3, setFileList3] = React.useState<UploadFile[]>([]);

  console.log("this lession", lession);

  const onFinish = () => {
    if (lession.lession && lession.lession.have_posttest) {
      nevigate(`/lessions/${id}/posttest`);
    } else {
      Swal.fire({
        title: "Congraturation!",
        text: "Thank you for learning This lession",
        icon: "success",
        willClose: () => {
          lession.lession.have_result
            ? nevigate(`/lessions/${id}/result`)
            : nevigate("/lessions");
        },
      });
    }
  };

  React.useEffect(() => {
    if (lession.lession && lession.lession.is_video_from) {
      setYoutubeLink(lession.lession.video_url);
    } else {
      setVidioLink(lession.lession.video_url);
      // setVidioLink(`${baseURL}/upload/${lession.lession.video_url}`);
    }
    setFileList1(
      lession.lession && lession.lession.files_url_1
        ? [
            {
              name: lession.lession.files_url_1.label,
              uid: lession.lession.files_url_1.uid,
              url: lession.lession.files_url_1,
              // url: `${baseURL}/upload/${lession.lession.files_url_1.url}`,
            },
          ]
        : []
    );
    setFileList2(
      lession.lession && lession.lession.files_url_2
        ? [
            {
              name: lession.lession.files_url_2.label,
              uid: lession.lession.files_url_2.uid,
              url: lession.lession.files_url_2,
              // url: `${baseURL}/upload/${lession.lession.files_url_2.url}`,
            },
          ]
        : []
    );

    setFileList3(
      lession.lession && lession.lession.files_url_3
        ? [
            {
              name: lession.lession.files_url_3.label,
              uid: lession.lession.files_url_3.uid,
              url: lession.lession.files_url_3,
              // url: `${baseURL}/upload/${lession.lession.files_url_3.url}`,
            },
          ]
        : []
    );
  }, []);

  console.log("file 1", fileList1);

  console.log("file 2", fileList2);

  console.log("file 3", fileList3);

  return (
    <Col>
      <Col style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <Text style={{ color: "#96BB7C", fontWeight: 700 }}>
          {t("overview")}
        </Text>
        <Title className="title-margin" level={2}>
          {t("lession")} {lession.lession.title}
        </Title>
        <Text>{lession.lession.subtitle}</Text>
      </Col>
      <Row gutter={20} style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <Col
          xs={24}
          sm={24}
          md={youtubeLink ? 16 : 24}
          lg={youtubeLink ? 16 : 24}
        >
          <Title className="title-margin" level={2}>
            {t("content")}
          </Title>
          {youtubeLink && (
            <ReactPlayer url={youtubeLink} width="100%" height="400px" />
          )}
          {videoLink && (
            <video width="100%" height="400px" controls src={videoLink}></video>
          )}

          {!youtubeLink && !videoLink && (
            <Text style={{ fontSize: "16px" }}> {lession.lession.content}</Text>
          )}
          <Col span={6} style={{ marginTop: "60px" }}>
            <Space>
              <Upload
                listType="picture-card"
                name="file1"
                fileList={fileList1}
                maxCount={1}
                disabled
              ></Upload>
              <Upload
                listType="picture-card"
                name="file2"
                fileList={fileList2}
                maxCount={1}
                disabled
              ></Upload>
              <Upload
                listType="picture-card"
                name="file3"
                fileList={fileList3}
                maxCount={1}
                disabled
              ></Upload>
            </Space>
          </Col>

          <Col
            xs={0}
            sm={0}
            md={24}
            lg={24}
            style={{
              textAlign: "end",
              marginTop: "20px",
              padding: 0,
            }}
          >
            {lession.result_test.is_test_posttest ? (
              <Button
                type="primary"
                onClick={() => nevigate(`/lessions/${id}/result`)}
              >
                {t("See Result")}
              </Button>
            ) : (
              <Button type="primary" onClick={onFinish}>
                {t("finish lession")}
              </Button>
            )}
          </Col>
        </Col>
        {(youtubeLink || videoLink) && (
          <Col xs={24} sm={24} md={8} lg={8} style={{ marginTop: "24px" }}>
            {lession.lession.content}
          </Col>
        )}

        <Col
          xs={24}
          sm={24}
          md={0}
          lg={0}
          style={{
            textAlign: "end",
            marginTop: "20px",
            padding: 0,
          }}
        >
          {lession.result_test.is_test_posttest ? (
            <Button
              type="primary"
              onClick={() => nevigate(`/lessions/${id}/result`)}
            >
              {t("See Result")}
            </Button>
          ) : (
            <Button type="primary" onClick={onFinish}>
              {t("finish lession")}
            </Button>
          )}
        </Col>
      </Row>
    </Col>
  );
};
