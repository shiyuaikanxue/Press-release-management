import { PageHeader } from "@ant-design/pro-components";
import { Descriptions } from "antd";
import axios from "axios";
import moment, { format } from "moment";
import { HeartTwoTone } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function Detail() {
  const Params = useParams();
  const [newsInfo, setNewsInfo] = useState({});
  useEffect(() => {
    axios
      .all([
        axios.get(`/news?_id=${Params.id}`),
        axios.get("/categories"),
        axios.get("/roles"),
      ])
      .then(([res1, res2, res3]) => {
        const list = res1.data[0];
        list["category"] = res2.data.filter(
          (sub) => list.categoryId == sub._id
        )[0];
        list["role"] = res3.data.filter((sub) => list.roleId == sub._id)[0];
        setNewsInfo({ ...list, view: list.view + 1 });
        return list;
      })
      .then((res) => {
        axios.patch(`/news?_id=${Params.id}`, {
          view: res.view + 1,
        });
      });
  }, [Params.id]);
  const items = [
    {
      key: "1",
      label: "创建者",
      children: newsInfo.author,
    },
    {
      key: "3",
      label: "发布时间",
      children: newsInfo?.publishTime
        ? moment(newsInfo.publishTime).format("YYYY-MM-DD HH:mm:ss")
        : "-",
    },
    {
      key: "4",
      label: "区域",
      children: newsInfo.region,
    },
    {
      key: "7",
      label: "访问数量",
      contentStyle: { color: "green" },
      children: newsInfo.view,
    },
    {
      key: "8",
      label: "点赞数量",
      contentStyle: { color: "green" },
      children: newsInfo.star,
    },
    {
      key: "9",
      label: "评论数量",
      contentStyle: { color: "green" },
      children: 0,
    },
  ];
  const handleStar = () => {
    setNewsInfo({ ...newsInfo, star: newsInfo.star + 1 });
    axios.patch(`/news?_id=${Params.id}`, {
      star: newsInfo.star + 1,
    });
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(240,240,240)",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        padding: "0 16px 20px",
        boxSizing: "border-box",
        flexDirection: "column",
      }}
    >
      {newsInfo && (
        <PageHeader
          onBack={() => {
            window.history.back();
          }}
          title={newsInfo?.title}
          subTitle={
            <div>
              {newsInfo?.category?.title}{" "}
              <HeartTwoTone
                twoToneColor="#eb2f96"
                onClick={() => handleStar()}
              />
            </div>
          }
        >
          <Descriptions items={items}></Descriptions>
        </PageHeader>
      )}
      <div
        style={{
          width: "100%",
          flexGrow: 1,
          overflow: "auto",
          borderRadius: "10px",
          padding: "0 16px",
          backgroundColor: "white",
          boxSizing: "border-box",
        }}
        dangerouslySetInnerHTML={{ __html: newsInfo.content }}
      ></div>
    </div>
  );
}
