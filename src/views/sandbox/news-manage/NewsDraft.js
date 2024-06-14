import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, Spin, notification, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function NewsDraft() {
  const [api, contextHolder] = notification.useNotification();
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .all([
        axios.get(`/news?author=${username}&auditState=0`),
        axios.get("/categories"),
      ])
      .then(([res1, res2]) => {
        const list = res1.data;
        list.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub.id === item.categoryId
          )[0];
        });
        setDataSource(list);
      });
  }, [username]);
  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        setSpinning(true);
        api.info({
          message: "上传成功",
          description: "正在前往审核列表查看...",
          placement: "bottomRight",
        });
        setTimeout(() => {
          setSpinning(false);
          navigate("/audit-manage/list");
        }, 2000);
      });
  };
  const handleConfirm = (item) => {
    confirm({
      title: "确定您需要删除该数据吗?",
      icon: <ExclamationCircleFilled />,
      content: "删除该草稿之后则无法找回",
      onOk() {
        handleDelete(item);
      },
      onCancel() {},
    });
  };
  const handleDelete = (item) => {
    //删除本地
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
  };
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "分类",
      dataIndex: "category",
      render: (category) => {
        return category?.title;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Tooltip title="删除" color="purple" mouseEnterDelay="0.3">
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  handleConfirm(item);
                }}
              />
            </Tooltip>
            <Tooltip title="编辑" color={"purple"} mouseEnterDelay="0.3">
              <Button
                style={{ margin: " 0 20px" }}
                shape="circle"
                onClick={() => {
                  navigate(`/news-manage/update/${item.id}`);
                }}
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="上传" color={"purple"} mouseEnterDelay="0.3">
              <Button
                type="primary"
                shape="circle"
                onClick={() => {
                  handleCheck(item.id);
                }}
                icon={<UploadOutlined />}
              />
            </Tooltip>
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
        rowKey={(item) => item.id}
      />
    </div>
  );
}
