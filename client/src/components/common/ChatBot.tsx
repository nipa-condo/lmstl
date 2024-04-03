import React from "react";
import { CloseOutlined, RobotFilled } from "@ant-design/icons";
import {
  Divider,
  Row,
  Space,
  Typography,
  Image,
  Input,
  Button,
  message,
  Form,
  Col,
} from "antd";
import { AuthContext } from "../contexts/AuthContext";
import * as API from "../../api";
import { useLocation, useParams } from "react-router-dom";
import { LogoAdmin } from "../../assets/images";
import { useForm } from "antd/es/form/Form";
import { userArrowStyle } from "chatbot-antd";
interface chatBotProps {
  onClose: () => void;
}

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

function useChatScroll<T>(dep: T): React.MutableRefObject<HTMLDivElement> {
  const ref = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref as any;
}

export const ChatBot: React.FC<chatBotProps> = (props: chatBotProps) => {
  const { onClose } = props;
  const { Title, Text } = Typography;
  const { setting, user, chatBot, onShowResChatbot } =
    React.useContext(AuthContext);
  const [text, setText] = React.useState("");
  const [loading, setloading] = React.useState<any>(false);
  const [form] = useForm();
  const ref = useChatScroll(text ? text : chatBot);
  const { id } = useParams();
  // const now = new Date();
  // let hours = now.getHours();
  // const minutes = now.getMinutes();
  // const ampm = hours >= 12 ? "PM" : "AM";

  // hours = hours % 12;
  // hours = hours ? hours : 12;
  // const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  const handleSendText = async (values: any) => {
    setloading(true);
    form.setFieldValue("text", "");
    onShowResChatbot({ text: values.text, isBot: false });

    await API.sendMessageChatBot({
      queryText: values.text,
      sessionId: id ? id : "home",
    })
      .then((res: any) => {
        onShowResChatbot({ text: res.data.text, isBot: true });
      })
      .catch(() => {
        message.error("send message failed.");
      })
      .finally(() => {
        setloading(false);
      });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0px",
        right: "2%",
        zIndex: 10,
        width: "350px",
        background: "#24292e",
        borderRadius: "12px 12px 0px 0px",
      }}
    >
      <Space
        style={{
          justifyContent: "space-between",
          width: "100%",
          padding: "0px 12px 0px 12px",
        }}
      >
        <Row align="middle">
          <RobotFilled
            style={{
              width: "41.6px",
              height: "41.6px",
              borderRadius: "50%",
              border: "solid 1px #000000",
              background: "#fff",
              fontSize: "20px",
              padding: "10px",
              marginRight: "10px",
            }}
          />
          <Title level={4} className="title-margin" style={{ color: "#fff" }}>
            CC Chatbot.
          </Title>
        </Row>

        <CloseOutlined
          onClick={onClose}
          style={{ marginRight: "12px", fontSize: "20px", color: "#fff" }}
        />
      </Space>
      <div
        style={{
          padding: "12px",
          background: "#fff",
          borderRadius: "12px 12px 0px 0px",
        }}
      >
        <div
          className="sidebar-message"
          style={{
            borderColor: "lightgray",
            borderStyle: "solid",
            borderWidth: "1px",
            padding: "8px",
            background: "#FFFFFF",
            boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
            height: "400px",
            borderRadius: "12px",
            overflow: "auto",
          }}
          ref={ref}
        >
          {/* <Row
            justify="center"
            style={{ marginTop: "12px", marginBottom: "12px" }}
          >
            <Typography>
              {hours} : {minutesStr} {ampm}
            </Typography>
          </Row> */}
          <Space
            key={"first-message"}
            style={{
              marginBottom: "8px",
              justifyContent: "start",
              width: "100%",
              marginTop: "24px",
            }}
          >
            <RobotFilled
              style={{
                borderRadius: "50%",
                border: "solid 1px #000000",
                boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                fontSize: "20px",
                padding: "10px",
              }}
            />
            <Space
              style={{
                background: "#f3f4f6",
                boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                padding: "16px",
                minWidth: "120px",
                borderRadius: "24px",
                justifyContent: "center",
                textAlign: "start",
                maxWidth: "200px",
              }}
            >
              <Text style={{ color: "#24292e" }}>
                สวัสดีครับ/ค่ะ! 🎓
                ยินดีต้อนรับสู่บริการช่วยเหลือด้านการศึกษาของเรา
              </Text>
            </Space>
          </Space>
          {chatBot.map((record: any, index: any) =>
            record.isBot ? (
              <Space
                key={index}
                style={{
                  marginBottom: "8px",
                  justifyContent: "start",
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                <RobotFilled
                  style={{
                    borderRadius: "50%",
                    border: "solid 1px #000000",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                    fontSize: "20px",
                    padding: "10px",
                  }}
                />
                <Space
                  style={{
                    background: "#f3f4f6",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                    padding: "16px",
                    minWidth: "120px",
                    borderRadius: "24px",
                    justifyContent: "center",
                    textAlign: "start",
                    maxWidth: "200px",
                  }}
                >
                  <Text style={{ color: "#24292e" }}>{record.text}</Text>
                </Space>
              </Space>
            ) : (
              <Space
                key={index}
                style={{
                  marginBottom: "8px",
                  justifyContent: "end",
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                <Space
                  className="test"
                  style={{
                    background: "#efac02",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                    padding: "12px",
                    minWidth: "120px",
                    borderRadius: "24px",
                    justifyContent: "center",
                    textAlign: "start",
                    maxWidth: "200px",
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}>{record.text}</Text>
                </Space>
                <Image
                  preview={false}
                  width="40px"
                  height="40px"
                  style={{
                    borderRadius: "50%",
                    border: "solid 1px #000000",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                  }}
                  src={
                    user?.photo_url
                      ? // ? `${baseURL}/upload/${user.photo_url}`
                        user.photo_url
                      : setting?.place_holder_url
                      ? // ? `${baseURL}/upload/${setting?.place_holder_url}`
                        setting?.place_holder_url
                      : LogoAdmin
                  }
                ></Image>
              </Space>
            )
          )}
        </div>
        <Form name="chatbot" onFinish={handleSendText} form={form}>
          <Row gutter={12} style={{ marginTop: "24px" }}>
            <Col span={18}>
              <Form.Item
                name="text"
                rules={[
                  { required: true, message: "Please input your message" },
                ]}
              >
                <Input dir="ltr" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button
                  block
                  style={{
                    background: "#24292e",
                    color: "#fff",
                    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)",
                  }}
                  htmlType="submit"
                >
                  Send
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* <Divider /> */}
    </div>
  );
};
