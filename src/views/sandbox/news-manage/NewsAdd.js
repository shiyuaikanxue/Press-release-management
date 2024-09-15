import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@ant-design/pro-components";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import style from "./News.module.css";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Steps,
  Form,
  Input,
  Select,
  message,
  notification,
  Spin,
} from "antd";
import axios from "axios";
export default function NewsAdd() {
  const [api, contextHolder] = notification.useNotification();
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  const NewsForm = useRef(null);
  const User = JSON.parse(localStorage.getItem("token"));
  // const categoryIdList = {
  //   时事新闻: "1",
  //   环球经济: "2",
  //   科学技术: "3",
  //   军事世界: "4",
  //   世界体育: "5",
  //   生活理财: "6",
  // };
  const Navigate = useNavigate();
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((err) => {});
    } else {
      if (content === "" || content === "<p></p>\n") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };
  const handleSave = (auditState) => {
    axios.get(`/categories?value=${formInfo.categoryId}`).then((element) => {
      axios
        .post("/news", {
          ...formInfo,
          content,
          categoryId: element.data[0]._id,
          region: User.region ? User.region : "全球",
          author: User.username,
          roleId: User._id,
          auditState,
          publishState: 0,
          createTime: Date.now(),
          star: 0,
          view: 0,
        })
        .then((res) => {
          setSpinning(true);
          api.info({
            message: auditState === 0 ? `保存成功` : "上传成功",
            description:
              auditState === 0
                ? "正在前往草稿箱查看..."
                : "正在前往审核列表查看...",
            placement: "bottomRight",
          });
          setTimeout(() => {
            setSpinning(false);
            Navigate(
              auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
            );
          }, 2000);
        });
    });
  };
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategoryList(res.data);
    });
  }, []);
  return (
    <div>
      <Spin spinning={spinning} fullscreen />
      {contextHolder}
      <PageHeader title="撰写新闻" subTitle="" />
      <Steps
        current={current}
        items={[
          {
            title: "基本信息",
            description: "新闻标题，新闻分类",
          },
          {
            title: "新闻内容",
            description: "新闻主体内容",
          },
          {
            title: "新闻提交",
            description: "保存草稿或提交审核",
          },
        ]}
      />
      <div style={{ margin: "50px 0" }}>
        <div className={current === 0 ? "" : style.hidden}>
          <Form
            name="basic"
            ref={NewsForm}
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 22,
            }}
            initialValues={{
              remember: true,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "请输入新闻标题!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "请选择新闻分类!",
                },
              ]}
            >
              <Select
                // onChange={handleChange}
                options={categoryList}
              ></Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.hidden}>
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.hidden}></div>
      </div>
      <div>
        {current === 2 && (
          <div style={{ float: "right" }}>
            <Button
              style={{ margin: "0 10px" }}
              type="primary"
              onClick={() => {
                handleSave(0);
              }}
            >
              保存草稿箱
            </Button>
            <Button
              danger
              onClick={() => {
                handleSave(1);
              }}
            >
              提交审核
            </Button>
          </div>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
        {current < 2 && (
          <Button
            style={{ margin: "0 10px" }}
            type="primary"
            onClick={handleNext}
          >
            下一步
          </Button>
        )}
      </div>
    </div>
  );
}
