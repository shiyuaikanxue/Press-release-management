import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import axios from "axios";
export default function RightList() {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((element) => {
        if (element.children?.length === 0) {
          element.children = "";
        }
      });
      setDataSource(list);
    });
  }, []);
  const handleConfirm = (item) => {
    confirm({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        handleDelete(item);
      },
      onCancel() {},
    });
  };
  const handleDelete = (item) => {
    //删除本地
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id));
      axios.delete(`/rights/${item.id}`);
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId);
      list[0].children = list[0].children.filter((data) => data.id !== item.id);
      setDataSource([...dataSource]);
      axios.delete(`/children/${item.id}`);
    }
  };
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "label",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render(key) {
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                handleConfirm(item);
              }}
            />
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    onChange={() => {
                      switchMethod(item);
                    }}
                    checked={item.pagepermisson}
                  ></Switch>
                </div>
              }
              title="页面配置项"
              trigger="click"
            >
              <Button
                type="primary"
                shape="circle"
                disabled={item.pagepermisson === undefined}
                icon={<EditOutlined />}
              />
            </Popover>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}
