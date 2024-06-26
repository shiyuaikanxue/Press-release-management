import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../views/sandbox/home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import Nopermission from "../../views/sandbox/nopermission/Nopermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import axios from "axios";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import { Spin } from "antd";
import { useSelector } from "react-redux";
export default function NewsRouter() {
  const showLoading = useSelector((state) => state.loading.Value);
  const LocalRouterMap = {
    "/home": Home,
    "/user-manage/list": UserList,
    "/right-manage/role/list": RoleList,
    "/right-manage/right/list": RightList,
    "/news-manage/add": NewsAdd,
    "/news-manage/draft": NewsDraft,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    "/news-manage/category": NewsCategory,
    "/audit-manage/audit": Audit,
    "/audit-manage/list": AuditList,
    "/publish-manage/unpublished": Unpublished,
    "/publish-manage/published": Published,
    "/publish-manage/sunset": Sunset,
  };
  const [backRouterList, setBackRouterList] = useState([]);
  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      setBackRouterList([...res[0].data, ...res[1].data]);
    });
  }, []);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const checkRoute = (item) => {
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };
  const checkUserPermission = (item) => {
    return rights?.includes(item.key);
  };
  return (
    <Spin size="large" spinning={showLoading}>
      <Routes>
        {backRouterList.map((item) => {
          const Component = LocalRouterMap[item.key] || Nopermission;
          if (checkRoute(item) && checkUserPermission(item)) {
            return (
              <Route
                path={item.key}
                key={item.key}
                element={<Component></Component>}
              ></Route>
            );
          } else {
            return null;
          }
        })}
        <Route
          path="/"
          element={<Navigate to="/home" replace></Navigate>}
        ></Route>
        {backRouterList.length > 0 && (
          <Route path="*" element={<Nopermission></Nopermission>}></Route>
        )}
      </Routes>
    </Spin>
  );
}
