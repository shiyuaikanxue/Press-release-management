import React from "react";
import style from "./login.module.scss";
import { Form, Input, Checkbox, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const navigate = useNavigate();
  const onFinish = async (value) => {
    const userResponse = await axios.get(
      `/users?username=${value.username}&password=${value.password}`
    );  
    if (userResponse.data && userResponse.data[0]?.roleState) {
      const userRight = await axios.get(
        `/roles?roleType=${userResponse.data[0].roleId}`
      );
      localStorage.setItem(
        "token",
        JSON.stringify({
          ...userResponse.data[0],
          role: {
            ...userRight.data[0],
          },
        })
      );
      navigate("/home");
    } else {
      message.error("不存在该账户，请联系管理员注册");
    }
  };
  return (
    <div className={style.login}>
      <div className={style.formContainer}>
        <div className={style.title}>新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
