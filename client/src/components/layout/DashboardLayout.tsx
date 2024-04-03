import React from "react";
import { Layout, Menu, Image, Avatar } from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminFooter, AdminNavbar } from "../dashboard";
import { LogoAdmin } from "../../assets/images";

interface DashboardLayoutProps {
  children?: any;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = (
  props: DashboardLayoutProps
) => {
  const { children } = props;
  const { t } = useTranslation();
  const { Content, Sider } = Layout;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState("");
  const location = useLocation();

  const MenuItems = [
    {
      key: "analytics",
      label: <Link to="analytics">{t("Analytics")}</Link>,
      icon: <BarChartOutlined />,
    },
    {
      key: "lessions",
      label: <Link to="lessions">{t("Lessions")}</Link>,
      icon: <BookOutlined />,
    },
    {
      key: "users",
      label: <Link to="users">{t("Students")}</Link>,
      icon: <UsergroupAddOutlined />,
    },
    {
      key: "setting",
      label: <Link to="setting">{t("Setting")}</Link>,
      icon: <SettingOutlined />,
    },
  ];

  React.useEffect(() => {
    const key = location.pathname.split("/") as any[];
    if (key.length) {
      setActiveKey(key[2]);
    }
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="md"
        collapsedWidth="80"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          <Avatar size={collapsed ? 60 : 80} src={LogoAdmin} />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={MenuItems}
        />
      </Sider>
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AdminNavbar />
        <Content
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "1200px",
            }}
          >
            {children}
          </div>
        </Content>
        <AdminFooter />
      </Layout>
    </Layout>
  );
};
