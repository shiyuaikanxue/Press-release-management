import React from "react";
import NewsPublished from "../../../components/publish-manage/NewsPublished";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button, notification } from "antd";
export default function Sunset() {
  const [api, contextHolder] = notification.useNotification();
  const notice = () => {
    api.info({
      message: "删除成功",
      description: "您可以前往新闻管理重撰写新闻",
      placement: "bottomRight",
    });
  };
  const { dataSource, handleDelete } = usePublish(3, notice);
  return (
    <div>
      {contextHolder}
      {
        <NewsPublished
          dataSource={dataSource}
          button={(id) => (
            <Button danger onClick={() => handleDelete(id)}>
              删除
            </Button>
          )}
        ></NewsPublished>
      }
    </div>
  );
}
