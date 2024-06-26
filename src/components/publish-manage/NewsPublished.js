import React from "react";
import { Table, Tag } from "antd";
export default function NewsPublished(props) {
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render(title, item) {
        return <a href={`#/news-manage/preview/${item._id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render(category) {
        return <Tag color="magenta">{category?.title}</Tag>;
      },
    },
    {
      title: "操作",
      render(item) {
        return <div>{props.button(item._id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={props.dataSource}
        columns={columns}
        rowKey={(item) => item._id}
      />
    </div>
  );
}
