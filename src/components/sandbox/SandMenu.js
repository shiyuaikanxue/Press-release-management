/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import "./SandMenu.scss";
import { Layout, Menu } from "antd";
import {
  WeiboCircleOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  BookOutlined,
  BorderOutlined,
  BranchesOutlined,
  SlackOutlined,
  DribbbleSquareOutlined,
  CodepenOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const { Sider } = Layout;
export default function SandMenu() {
  const collapsed = useSelector((state) => state.collap.Value);
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const iconList = {
    "/home": <WeiboCircleOutlined />,
    "/user-manage": <AppstoreAddOutlined />,
    "/user-manage/list": <AppstoreOutlined />,
    "/right-manage": <BookOutlined />,
    "/right-manage/role/list": <BorderOutlined />,
    "/right-manage/right/list": <BranchesOutlined />,
    "/news-manage": <CodepenOutlined />,
    "/audit-manage": <DribbbleSquareOutlined />,
    "/publish-manage": <SlackOutlined />,
  };
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  //清洗数据
  const clearData = (menu) => {
    let data = menu
      .filter((item) => {
        if (item.children?.length !== 0) {
          item.children = item.children?.filter((sub) => {
            if (iconList[sub.key]) {
              sub["icon"] = iconList[sub.key];
            }
            return sub.pagepermisson === 1 && rights?.includes(sub.key);
          });
        }
        if (iconList[item.key]) {
          item["icon"] = iconList[item.key];
        }
        return item.pagepermisson === 1 && rights?.includes(item.key);
      })
      .map((item) => {
        // 如果清理后没有children，则删除children属性
        if (item.children && item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
    return data;
  };
  //得到权限数据
  useEffect(() => {
    axios
      .all([axios.get("/rights"), axios.get("/children")])
      .then(([res1, res2]) => {
        const rights = res1.data;
        const child = res2.data;
        rights.map((item) => {
          item.children = child.filter((sub) => sub.rightId == item._id);
          return null;
        });
        setMenu(rights);
      });
  }, []);
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {!collapsed && <div className="demo-logo-vertical">知七新闻</div>}
        <Menu
          style={{ flex: 1, overflow: "auto" }}
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={clearData(menu)}
          defaultOpenKeys={["/" + location.pathname.split("/")[1]]}
          onClick={({ key }) => {
            navigate(key);
          }}
        />
      </div>
    </Sider>
  );
}
