import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
const UserForm = forwardRef((props, ref) => {
  const [isDisable, setIsDisable] = useState(false);
  useEffect(() => {
    setIsDisable(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);
  const regionList = props.regionList;
  const roleList = props.roleList;
  const { roleId, region } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor",
  };
  const clearRegionList = () => {
    if (props.isUpdate) {
      //更新
      if (roleObj[roleId] === "superAdmin") {
        return regionList;
      } else {
        const list = regionList;
        return list.map((item) => ({ ...item, disabled: true }));
      }
    } else {
      //新建
      if (roleObj[roleId] === "superAdmin") {
        return regionList;
      } else {
        const list = regionList;
        return list.map((item) => {
          if (item.value === region) {
            return { ...item, disabled: false };
          } else {
            return { ...item, disabled: true };
          }
        });
      }
    }
  };
  const clearRoleList = () => {
    if (props.isUpdate) {
      //更新
      if (roleObj[roleId] === "superAdmin") {
        return roleList;
      } else {
        const list = roleList;
        return list.map((item) => ({ ...item, disabled: true }));
      }
    } else {
      //新建
      if (roleObj[roleId] === "superAdmin") {
        return roleList;
      } else {
        const list = roleList;
        return list.map((item) => {
          if (roleObj[item.id] !== 'editor') {
            return { ...item, disabled: true };
          } else {
            return item;
          }
        });
      }
    }
  };
  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "请输入用户名!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "请输入密码!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisable
            ? []
            : [
                {
                  required: true,
                  message: "请选择区域!",
                },
              ]
        }
      >
        <Select options={clearRegionList()} disabled={isDisable}></Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "请选择角色!",
          },
        ]}
      >
        <Select
          options={clearRoleList()}
          onChange={(item) => {
            if (item === "1") {
              setIsDisable(true);
              ref.current.setFieldValue("region", "");
            } else {
              setIsDisable(false);
            }
          }}
        ></Select>
      </Form.Item>
    </Form>
  );
});
export default UserForm;
