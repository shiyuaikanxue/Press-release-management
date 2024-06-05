import React from "react";
import { Button, Layout, theme, Dropdown, Avatar } from "antd";
import { useState } from "react";
import { UserOutlined, SmileOutlined } from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  handleCollapShow,
  handleCollapColse,
  handleCollap,
} from "../../redux/slice/collapSlice";
const { Header } = Layout;
export default function TopHeader() {
  const collapsed = useSelector((state) => state.collap.Value);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const items = [
    {
      key: "1",
      label: roleName,
    },
    {
      key: "2",
      label: "退出",
      icon: <SmileOutlined />,
      onClick: () => {
        localStorage.removeItem("token");
        Navigate("/login");
      },
      danger: true,
    },
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(handleCollap())}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right", marginRight: "20px" }}>
        <span style={{ margin: "0 10px" }}>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>
        <Dropdown
          menu={{
            items,
          }}
        >
          <Avatar
            style={{ backgroundColor: "#87d068" }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </Header>
  );
}
