import { PageHeader } from "@ant-design/pro-components";
import { Descriptions } from "antd";
import axios from "axios";
import moment, { format } from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function NewsPreview() {
  const Params = useParams();
  const [newsInfo, setNewsInfo] = useState({});
  useEffect(() => {
    axios
      .all([
        axios.get(`/news/${Params.id}`),
        axios.get("/categories"),
        axios.get("/roles"),
      ])
      .then(([res1, res2, res3]) => {
        const list = res1.data;
        list["category"] = res2.data.filter(
          (sub) => list.categoryId == sub.id
        )[0];
        list["role"] = res3.data.filter((sub) => list.roleId == sub.id)[0];
        setNewsInfo(list);
      });
  }, [Params.id]);
  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["black", "orange", "green", "red"];
  const items = [
    {
      key: "1",
      label: "创建者",
      children: newsInfo.author,
    },
    {
      key: "2",
      label: "创建时间",
      children: moment(newsInfo.createTime).format("YYYY-MM-DD HH:mm:ss"),
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
      key: "5",
      label: "审核状态",
      contentStyle: { color: colorList[newsInfo.auditState] },
      children: auditList[newsInfo.auditState],
    },
    {
      key: "6",
      label: "发布状态",
      contentStyle: { color: "red" },
      children: publishList[newsInfo.publishState],
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
        flexDirection: "column",
      }}
    >
      {newsInfo && (
        <PageHeader
          onBack={() => {
            window.history.back();
          }}
          title={newsInfo?.title}
          subTitle={newsInfo?.category?.title}
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
        }}
        dangerouslySetInnerHTML={{ __html: newsInfo.content }}
      ></div>
    </div>
  );
}
