import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Card, List, Avatar, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
  RiseOutlined,
  StockOutlined,
  ZoomInOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as Echarts from "echarts";
import _ from "lodash";
const { Meta } = Card;
export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [open, setOpen] = useState(false);
  const mycharts = useRef(null);
  const piecharts = useRef(null);
  const myChart = useRef(null);
  const pieChart = useRef(null);
  useEffect(() => {
    axios
      .all([
        axios.get(`/news?publishState=2&_sort=view`),
        axios.get("/categories"),
      ])
      .then(([res1, res2]) => {
        const list = res1.data.slice(res1.data.length - 6, res1.data.length);
        list.sort((a, b) => b.view - a.view); //降序排序

        list.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub.id === item.categoryId
          )[0];
        });
        setViewList(list);
      });
  }, []);
  useEffect(() => {
    axios
      .all([
        axios.get(`/news?publishState=2&_sort=star`),
        axios.get("/categories"),
      ])
      .then(([res1, res2]) => {
        const list = res1.data.slice(res1.data.length - 6, res1.data.length);
        list.sort((a, b) => b.star - a.star); //降序排序
        list.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub.id === item.categoryId
          )[0];
        });
        setStarList(list);
      });
  }, []);
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .all([axios.get(`/news?publishState=2`), axios.get("/categories")])
      .then(([res1, res2]) => {
        const list = res1.data;
        list.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub.id === item.categoryId
          )[0];
        });
        setAllList(list);
      });
  }, []);
  useEffect(() => {
    initMycharts(_.groupBy(allList, (item) => item.category.title));
    return () => {
      window.onresize = null;
    };
  }, [allList]);
  useEffect(() => {
    if (open) {
      initPieChart();
    }
  }, [open]);
  const initPieChart = () => {
    const currentList = allList.filter((item) => item.author === username);
    const groupObj = _.groupBy(currentList, (item) => item.category.title);
    const list = [];
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      });
    }
    if (pieChart.current === null) {
      pieChart.current = Echarts.init(piecharts.current);
    }
    const option = {
      title: {
        text: username + "   发布的新闻分类图示",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "50%",
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0,0,0,0.5)",
            },
          },
        },
      ],
    };
    pieChart.current.setOption(option);
  };
  const initMycharts = (obj) => {
    if (myChart.current === null) {
      myChart.current = Echarts.init(mycharts.current);
    }
    const option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          // rotate: "45",
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };
    myChart.current?.setOption(option);
    window.onresize = () => {
      myChart.current?.resize();
    };
  };
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title={
              <div>
                <span style={{ paddingRight: "10px" }}>用户最常浏览</span>
                <RiseOutlined />
              </div>
            }
            bordered={true}
          >
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item, index) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>
                    <ZoomInOutlined style={{ paddingRight: "10px" }} />
                    {item.title}
                  </a>
                  <span
                    style={{
                      fontSize: "12px",
                      color: index <= 2 ? "red" : "gray",
                    }}
                  >
                    {item.view}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <div>
                <span style={{ paddingRight: "10px" }}>用户点赞最多</span>
                <StockOutlined />
              </div>
            }
            bordered={true}
          >
            <List
              size="small"
              dataSource={starList}
              renderItem={(item, index) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>
                    <FileSearchOutlined style={{ paddingRight: "10px" }} />
                    {item.title}
                  </a>
                  <span
                    style={{
                      fontSize: "12px",
                      color: index <= 2 ? "green" : "gray",
                    }}
                  >
                    {item.star}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined
                key="setting"
                onClick={() => {
                  setOpen(true);
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width={"600px"}
        title="个人新闻发布统计"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
      >
        <div
          ref={piecharts}
          style={{
            height: "300px",
            width: "100%",
            marginTop: "20px",
          }}
        ></div>
      </Drawer>
      <div
        ref={mycharts}
        style={{
          height: "300px",
          width: "50%",
          marginTop: "20px",
        }}
      ></div>
    </div>
  );
}
