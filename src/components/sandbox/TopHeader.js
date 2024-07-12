import React, { useRef, useState } from "react";
import {
  Button,
  Layout,
  theme,
  Dropdown,
  Modal,
  Form,
  Upload,
  Input,
  message,
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
import axios from "axios";
import Password from "antd/es/input/Password";
const { Header } = Layout;
export default function TopHeader() {
  const [messageApi, contextHolder] = message.useMessage();
  const collapsed = useSelector((state) => state.collap.Value);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const form = useRef();
  const [image, setImage] = useState(JSON.parse(localStorage.getItem("token")).image);
  let {
    _id,
    role: { roleName },
    username,
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
  const onUpload = async (value) => {
    setConfirmLoading(true);
    console.log(value.cover[0]);
    const formData = new FormData();
    formData.append("cover", value.cover[0].originFileObj);
    await axios.post(`/users/updateInfo?_id=${_id}`, {
      username: value.username,
      password: value.password,
    });
    axios
      .post(`/users/updateCover?_id=${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (res) => {
        setIsEdit(false);
        setConfirmLoading(false);
        messageApi.info("修改成功");
        setImage(res.data[0].image);
        const token = res.data[0];
        let roles = await axios.get("/roles");
        token.role = roles.data.filter(
          (sub) => sub.roleType === token.roleId
        )[0];
        localStorage.setItem("token", JSON.stringify(token));
      });
  };
  /**
   * 点击取消，取消修改，关闭对话框
   */
  const handleCancel = () => {
    setIsEdit(false);
  };
  /**
   * 上传文件检验
   * @param {上文的文件} file
   * @returns
   */
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("你只能上传 JPG/PNG 格式文件!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小必须小于2MB!");
    }
    return false;
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
      {contextHolder}
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
            <img
              src={baseUrl + image}
              style={{ width: "100%", borderRadius: "50%" }}
            ></img>
          </div>
        </Dropdown>
      </div>
      <Modal
        title="修改账号信息"
        open={isEdit}
        onText="确定"
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        destroyOnClose={true}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
        }}
        modalRender={(dom) => (
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
            clearOnDestroy
            ref={form}
            onFinish={(value) => onUpload(value)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          label="账号："
          name="username"
          rules={[
            {
              required: true,
              message: "请输入您要修改的账号：",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码："
          name="password"
          hasFeedback
          rules={[
            {
              required: true,
              message: "请输入您要修改的密码：",
              whitespace: true,
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label="确认密码："
          name="confirmPassword"
          hasFeedback
          rules={[
            {
              required: true,
              message: "请输入再次输入密码：",
              whitespace: true,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("请与第一次输入密码相同"));
              },
            }),
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label="头像："
          name="cover"
          valuePropName="image"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={beforeUpload}
          >
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
                选择图片
              </div>
            </button>
          </Upload>
        </Form.Item>
      </Modal>
    </Header>
  );
}
