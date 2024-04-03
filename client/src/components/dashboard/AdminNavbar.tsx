import React from "react";
import {
  Layout,
  Row,
  Typography,
  Image,
  Space,
  Dropdown,
  MenuProps,
} from "antd";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";

import { LogoAdmin, LogoHeader } from "../../assets/images";
import { AuthContext } from "../contexts/AuthContext";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

export const AdminNavbar: React.FC<{}> = () => {
  const { t, i18n } = useTranslation();
  const { Header } = Layout;
  const { Text, Title } = Typography;
  const navigate = useNavigate();
  const { setting } = React.useContext(AuthContext);
  const test = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  const items: MenuProps["items"] = [
    {
      label: <Link to="/home">Go To User View</Link>,
      key: "0",
    },
    {
      label: <Link to="/dashboard/users/1">My Profile</Link>,
      key: "1",
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
      key: "2",
    },
  ];

  return (
    <Header className="app-header" style={{ background: "#fff" }}>
      <Row
        justify="space-between"
        align="middle"
        className="admin-header-inner"
      >
        <Title className="title-margin" level={3}>
          {t("cloud_computing")}
        </Title>
        <Space size="middle">
          <Dropdown menu={{ items }} trigger={["hover"]}>
            <Image
              preview={false}
              src={
                setting.place_holder_url
                  ? // ? `${baseURL}/upload/${setting.place_holder_url}`
                    setting.place_holder_url
                  : LogoAdmin
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
