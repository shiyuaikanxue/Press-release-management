import React, { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import News from "../views/news/News";
import Detail from "../views/news/Detail";
import { useSelector } from "react-redux";
export default function IndexRouter() {
  const isLogin = useSelector((state) => state.login.Value);
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/news" element={<News></News>}></Route>
        <Route path="/detail/:id" element={<Detail></Detail>}></Route>
        {/* <Route path="/" element={<NewsSandBox></NewsSandBox>}></Route> */}
        <Route
          path="/*"
          element={
            isLogin ? (
              <NewsSandBox></NewsSandBox>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        ></Route>
      </Routes>
    </HashRouter>
  );
}
