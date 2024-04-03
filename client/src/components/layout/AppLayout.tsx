import React from "react";
import { Layout } from "antd";
import { Navbar, Footer } from "../app";

interface AppLayoutProps {
  children?: any;
}

export const AppLayout: React.FC<AppLayoutProps> = (props: AppLayoutProps) => {
  const { children } = props;
  const { Content } = Layout;
  return (
    <Layout className="site-layout">
      <Navbar />
      <Content
        style={{
          display: "flex",
          flexGrow: 1,
          marginBottom: "-3rem",
        }}
      >
        {children}
      </Content>
      <Footer />
    </Layout>
  );
};
