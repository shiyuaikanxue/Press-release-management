import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { confirm } = Modal;
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
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <div>{id}</div>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
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
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalOpen(true);
                setCurrentRights(item.rights);
                setCurrentId(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      setDataSource(res.data);
    });
    axios.get(`/rights?_embed=children`).then((res) => {
      //由于数据返回的是label字段，需要自行添加title字段，返回数据只存在两层结构，如果存在更深层次的结构，就需要深度遍历可以用递归的形式
      const list = res.data;
      list.map((item) => {
        item["title"] = item.label;
        if (item.children?.length > 0) {
          item.children.map((sub) => {
            sub["title"] = sub.label;
          });
        }
      });
      setRightList([...list]);
    });
  }, []);
  const handleOk = () => {
    setIsModalOpen(false);
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          };
        }
        return item;
      })
    );
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = (checked) => {
    setCurrentRights(checked.checked);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
