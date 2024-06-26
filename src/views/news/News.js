import axios from "axios";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@ant-design/pro-components";
import { Row, Col, Card, List } from "antd";
import _ from "lodash";
export default function News() {
  const [allList, setAllList] = useState([]);
  useEffect(() => {
    axios
      .all([axios.get("/news?publishState=2"), axios.get("categories")])
      .then(([res1, res2]) => {
        const newsList = res1.data;
        newsList.map((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub._id === item.categoryId
          )[0];
        });
        setAllList(
          Object.entries(_.groupBy(newsList, (item) => item.category.title))
        );
      });
  }, []);
  return (
    <div
      style={{
        width: "95%",
        margin: "0 auto",
      }}
    >
      <PageHeader title="全球大新闻" subTitle="查看新闻"></PageHeader>
      <Row gutter={[16, 16]}>
        {allList.map((item, index) => {
          return (
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered={true} hoverable>
                <List
                  size="small"
                  dataSource={item[1].sort((a, b) => b.star - a.star)}
                  pagination={{ pageSize: 3 }}
                  renderItem={(data) => (
                    <List.Item>
                      <a href={`#/detail/${data._id}`} style={{ width: "90%" }}>
                        {data.title}
                      </a>
                      <span style={{ color: data.star > 1000 ? "red" : "" }}>
                        {data.star}
                      </span>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
