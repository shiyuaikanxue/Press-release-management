import React from "react";
import NewsPublished from "../../../components/publish-manage/NewsPublished";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button, notification } from "antd";
export default function Unpublished() {
  const [api, contextHolder] = notification.useNotification();
  const notice = () => {
    api.info({
      message: "发布成功",
      description: "正在前往发布管理/已发布查看您的新闻",
      placement: "bottomRight",
    });
  };
  const { dataSource, handlePublish } = usePublish(1, notice);
  return (
    <div>
      {contextHolder}
      {
        <NewsPublished
          dataSource={dataSource}
          button={(id) => (
            <Button type="primary" onClick={() => handlePublish(id)}>
              发布
            </Button>
          )}
        ></NewsPublished>
      }
    </div>
  );
}
