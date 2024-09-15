import React from "react";
import SideMenu from "../../components/sandbox/SandMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import "./NewSandBox.scss";
import { Layout, theme } from "antd";
import NewsRouter from "../../components/sandbox/NewsRouter";
const { Content } = Layout;
export default function NewsSandBox() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout>
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
