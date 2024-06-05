import React from "react";
import NewsPublished from "../../../components/publish-manage/NewsPublished";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button, notification } from "antd";
export default function Published() {
  const [api, contextHolder] = notification.useNotification();
  const notice = () => {
    api.info({
      message: "下线成功",
      description: "正在前往发布管理/已下线查看您的新闻",
      placement: "bottomRight",
    });
  };
  const { dataSource, handleSunset } = usePublish(2, notice);
  return (
    <div>
      {contextHolder}
      {
        <NewsPublished
          dataSource={dataSource}
          button={(id) => (
            <Button danger type="primary" onClick={() => handleSunset(id)}>
              下线
            </Button>
          )}
        ></NewsPublished>
      }
    </div>
  );
}
