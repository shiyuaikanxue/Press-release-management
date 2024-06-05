import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Spin, notification } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
export default function Audit() {
  const [api, contextHolder] = notification.useNotification();
  const [spinning, setSpinning] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  const handleAudit = (item, auditState, publishState) => {
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        setSpinning(true);
        setTimeout(() => {
          setSpinning(false);
          setDataSource(dataSource.filter((data) => item.id !== data.id));
          api.info({
            message: publishState === 0 ? "驳回成功" : "审核通过",
            description: "该作者可在审核列表查看状态",
            placement: "bottomRight",
          });
        }, 1000);
      });
  };
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render(title, item) {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <div>{category.title}</div>;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Button
              icon={<CheckOutlined />}
              onClick={() => {
                handleAudit(item, 2, 1);
              }}
              type="primary"
              style={{ backgroundColor: "#87D068", color: "white" }}
              shape="circle"
            ></Button>
            <Button
              danger
              onClick={() => {
                handleAudit(item, 3, 0);
              }}
              style={{ margin: "0 10px" }}
              icon={<CloseOutlined />}
              shape="circle"
            ></Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios
      .all([axios.get(`/news?auditState=1`), axios.get(`/categories`)])
      .then(([res1, res2]) => {
        const list = res1.data;
        list.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub.id === item.categoryId
          )[0];
          setDataSource(
            roleObj[roleId] === "superAdmin"
              ? list
              : [
                  ...list.filter((item) => item.author === username),
                  ...list.filter(
                    (item) =>
                      item.region === region &&
                      roleObj[item.roleId] === "editor"
                  ),
                ]
          );
        });
      });
  }, []);
  return (
    <div>
      <Spin spinning={spinning} fullscreen />
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}
