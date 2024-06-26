import React, { useState } from "react";
import {
  Button,
  Layout,
  theme,
  Dropdown,
  Modal,
  Form,
  Upload,
  Input,
  Radio,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  SmileOutlined,
  UserSwitchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/loginedSlice";
import baseUrl from "../../utils/http";
import { handleCollap } from "../../redux/slice/collapSlice";
const { Header } = Layout;
export default function TopHeader() {
  const collapsed = useSelector((state) => state.collap.Value);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const {
    role: { roleName },
    username,
    image,
  } = JSON.parse(localStorage.getItem("token"));
  const items = [
    {
      key: "1",
      label: roleName,
      icon: <UserSwitchOutlined />,
    },
    {
      key: "2",
      label: "编辑信息",
      icon: <FormOutlined />,
      /**
       * 点击修改信息，唤醒对话框
       */
      onClick: () => {
        setIsEdit(true);
      },
    },
    {
      key: "3",
      label: "退出",
      icon: <SmileOutlined />,
      onClick: () => {
        localStorage.removeItem("token");
        dispatch(logout());
        Navigate("/login");
      },
      danger: true,
    },
  ];
  /**
   * 点击确定，关闭对话框，提交表单
   */
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setIsEdit(false);
      setConfirmLoading(false);
    }, 2000);
  };
  /**
   * 点击取消，取消修改，关闭对话框
   */
  const handleCancel = () => {
    setIsEdit(false);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => dispatch(handleCollap())}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div
        style={{
          float: "right",
          marginRight: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ margin: "0 10px" }}>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>
        <Dropdown
          menu={{
            items,
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={baseUrl + image} style={{ width: "100%" }}></img>
          </div>
        </Dropdown>
      </div>
      <Modal
        title="修改账号信息"
        open={isEdit}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="Input">
            <Input />
          </Form.Item>
          <Form.Item label="Radio">
            <Radio.Group>
              <Radio value="apple"> Apple </Radio>
              <Radio value="pear"> Pear </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button
                style={{
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
}
