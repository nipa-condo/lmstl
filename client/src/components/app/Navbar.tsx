import {
  Layout,
  Row,
  Typography,
  Image,
  Button,
  Space,
  MenuProps,
  Dropdown,
  Col,
} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LogoAdmin } from "../../assets/images";
import { AuthContext } from "../contexts/AuthContext";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export const Navbar: React.FC<{}> = () => {
  const { t, i18n } = useTranslation();
  const { Header } = Layout;
  const { Text, Title } = Typography;
  const { setting, user } = React.useContext(AuthContext);

  const test = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  const items =
    user.id === 1
      ? [
          {
            label: <Link to="/dashboard/analytics">Go To Dashboard</Link>,
            key: "0",
          },
          {
            label: (
              <Link
                to="/signin"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
              >
                Log out
              </Link>
            ),
            key: "1",
          },
        ]
      : [
          {
            label: <Link to="/profile">My Profile</Link>,
            key: "0",
          },
        ];

  return (
    <Header
      className="app-header"
      style={{
        background: "#fff",
        boxShadow: "0px 5px 15px -6px rgba(0,0,0,0.1)",
      }}
    >
      <Row justify="space-between" align="middle" className="app-header-inner">
        <Link to="/home">
          <Row gutter={8}>
            <Col>
              <Title
                className="title-margin"
                level={3}
                style={{ color: "#efac02" }}
              >
                {t("Cloud")}
              </Title>
            </Col>
            <Col>
              <Title
                className="title-margin"
                level={3}
                style={{ color: "#24292F" }}
              >
                {t("Computing")}
              </Title>
            </Col>
          </Row>
        </Link>
        <Space size="middle">
          <Dropdown
            menu={{ items }}
            trigger={["hover"]}
            placement="bottomRight"
          >
            <Image
              preview={false}
              src={
                user?.photo_url
                  ? user.photo_url
                  : // ? `${baseURL}/upload/${user.photo_url}`
                  setting?.place_holder_url
                  ? setting?.place_holder_url
                  : // ? `${baseURL}/upload/${setting?.place_holder_url}`
                    LogoAdmin
              }
              style={{
                height: "40px",
                width: "40px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          </Dropdown>
        </Space>
      </Row>
    </Header>
  );
};
