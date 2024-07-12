import React, { useEffect, useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, Switch } from "antd";
import axios from "axios";
import UserForm from "../../../components/user-manage/UserForm";
export default function UserList() {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const {
    role: { roleType },
    region,
    username,
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .all([
        axios.get("/users"),
        axios.get("/roles"), // 假设你知道如何根据 users 的数据获取对应的 roles
      ])
      .then(([users, roles]) => {
        const list = users?.data;
        const roleList = roles?.data;
        list?.map((item) => {
          item["role"] = roleList.filter(
            (sub) => sub.roleType === item.roleId
          )[0];
        });
        setDataSource(
          roleObj[roleType] === "superAdmin"
            ? list
            : [
                ...list.filter((item) => item.username === username),
                ...list.filter(
                  (item) =>
                    item.region === region && roleObj[item.roleId] === "editor"
                ),
              ]
        );
      });
  }, []);
  useEffect(() => {
    axios.get(`/roles`).then((res) => {
      const list = res?.data;
      list?.map((item) => {
        item["label"] = item?.roleName;
        item["value"] = item.roleType;
      });
      setRoleList(list);
    });
  }, []);
  useEffect(() => {
    axios.get(`/regions`).then((res) => {
      const list = res?.data;
      setRegionList(list);
    });
  }, []);
  //删除的提示
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
  //删除
  const handleDelete = (item) => {
    //删除本地
    setDataSource(dataSource.filter((data) => data._id !== item._id));
    axios.delete(`/users?_id=${item._id}`);
  };
  //处理改变账号状态
  const handleChange = (item) => {
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`/users?_id=${item._id}`, {
      roleState: item.roleState,
    });
  };
  //打开模态框，更新改变账户信息
  const handleUpdate = (item) => {
    setUpdateOpen(true);
    setCurrentItem(item);
    if (item.roleId === "1") {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
  };
  //依赖于改变用户信息的模态框是否打开和当前修改的用户是否存在然后执行初始化模态框用户信息操作
  useEffect(() => {
    if (updateOpen && currentItem && updateForm) {
      setTimeout(() => {
        updateForm.current?.setFieldsValue(currentItem);
      }, 100);
    }
  }, [updateOpen, updateForm, currentItem]);
  //添加用户，拿到添加用户表单的数据，提交后端并返回插入的数据，处理得到完备的数据字段插入table
  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setOpen(false);
        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((user) => {
            const newUser = user.data;
            newUser["role"] = roleList.filter(
              (sub) => sub.roleType === newUser.roleId
            )[0];
            setDataSource([...dataSource, newUser]);
          });
      })
      .catch((err) => {});
  };
  //关闭修改用户信息的模态框，赋当前修改用户为空
  const updateFormOk = (item) => {
    //拿到修改后的表单的数据
    updateForm.current.validateFields().then((value) => {
      //修改本地数据
      setDataSource(
        dataSource.map((item) => {
          //找到修改的账户
          if (currentItem._id === item._id) {
            return {
              ...item,
              ...value,
              role: roleList.filter(
                (data) => data.roleType === value.roleId
              )[0],
            };
          }
          return item;
        })
      );
      axios.patch(`/users?_id=${currentItem._id}`, {
        ...value,
      });
    });
    setUpdateOpen(false);
    setCurrentItem(null);
  };
  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regionList?.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
      render(region) {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render(role) {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render(roleState, item) {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          ></Switch>
        );
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
              disabled={item.default}
              onClick={() => {
                handleConfirm(item);
              }}
            />
            <Button
              type="primary"
              disabled={item.default}
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(item)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        <PlusOutlined />
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 9,
        }}
      />
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        okButtonProps={{
          autoFocus: true,
        }}
        onCancel={() => {
          setOpen(false);
        }}
        destroyOnClose
        onOk={async () => {
          addFormOk();
        }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={addForm}
        ></UserForm>
      </Modal>

      <Modal
        open={updateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        okButtonProps={{
          autoFocus: true,
        }}
        onCancel={() => {
          setUpdateOpen(false);
          setCurrentItem(null);
        }}
        destroyOnClose
        onOk={async () => {
          updateFormOk();
        }}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
        ></UserForm>
      </Modal>
    </div>
  );
}
