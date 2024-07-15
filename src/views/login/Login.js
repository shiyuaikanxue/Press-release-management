import React, { useEffect, useRef } from "react";
import style from "./login.module.scss";
import { Form, Input, Checkbox, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../redux/slice/loginedSlice";
import { useDispatch } from "react-redux";
import { background } from "./canvas/Background_canvas";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canvas = useRef();
  useEffect(() => {
    background(canvas.current, 40, null, 'pink','rgb(200,0,200)');
  }, []);
  const onFinish = async (value) => {
    await axios
      .get(`/users?username=${value.username}&password=${value.password}`)
      .then((res) => {
        if (res.data.length === 0) {
          isLogin(false);
        } else {
          isLogin(true, res.data[0]);
        }
      });
  };
  async function isLogin(isEnter, account = null) {
    if (isEnter) {
      const userRight = await axios.get(`/roles?roleType=${account.roleId}`);
      localStorage.setItem(
        "token",
        JSON.stringify({
          ...account,
          role: {
            ...userRight.data[0],
          },
        })
      );
      dispatch(login());
      navigate("/home");
    } else {
      message.error("不存在该账户，请联系管理员注册");
    }
  }
  return (
    <div className={style.login}>
      <canvas className={style.background} ref={canvas}></canvas>
      <div className={style.formContainer}>
        <div className={style.title}>知七新闻平台</div>
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
