import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Tag, notification } from "antd";
import { useNavigate } from "react-router-dom";
export default function AuditList() {
  const [api, contextHolder] = notification.useNotification();
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [spinning, setSpinning] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const Navigate = useNavigate();
  const colorList = ["", "orange", "green", "red"];
  const auditList = ["", "审核中", "已通过", "未通过"];
  useEffect(() => {
    axios
      .all([axios.get(`/news?author=${username}`), axios.get(`/categories`)])
      .then(([res1, res2]) => {
        let list = res1.data;
        list = list.filter(
          (item) => (item.auditState !== 0) & (item.publishState <= 1)
        );
        list.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub._id === item.categoryId
          )[0];
        });
        setDataSource(list);
      });
  }, [username]);
  const handleRevert = (item) => {
    setDataSource(dataSource.filter((data) => item._id !== data._id));
    axios
      .patch(`/news?_id=${item._id}`, {
        auditState: 0,
      })
      .then((res) => {
        api.info({
          message: "撤销成功",
          description: "您可以前往草稿箱查看",
          placement: "bottomRight",
        });
      });
  };
  const handleUpdate = (item) => {
    Navigate(`/news-manage/update/${item._id}`);
  };
  const handlePublish = (item) => {
    axios
      .patch(`/news?_id=${item._id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        setSpinning(true);
        api.info({
          message: "发布成功",
          description: "正在前往发布管理/已发布查看您的新闻",
          placement: "bottomRight",
        });
        setTimeout(() => {
          setSpinning(false);
          Navigate("/publish-manage/published");
        }, 2000);
      });
  };
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item._id}`}>{title}</a>;
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
        return <div>{category?.title}</div>;
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            {item.auditState === 1 && (
              <Button
                danger
                onClick={() => {
                  handleRevert(item);
                }}
              >
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button
                type="primary"
                onClick={() => {
                  handlePublish(item);
                }}
              >
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button
                danger
                type="dashed"
                onClick={() => {
                  handleUpdate(item);
                }}
              >
                修改
              </Button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Spin spinning={spinning} fullscreen />
      {contextHolder}
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item._id}
      />
    </div>
  );
}
