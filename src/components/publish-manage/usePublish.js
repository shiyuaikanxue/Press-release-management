import axios from "axios";
import { useEffect, useState } from "react";
import { notification } from "antd";
function usePublish(type, notice) {
  const [api, contextHolder] = notification.useNotification();
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .all([axios.get(`/news?author=${username}`), axios.get(`/categories`)])
      .then(([res1, res2]) => {
        let list = res1.data;
        list = list.filter((item) => item.publishState == type);
        list.forEach((item) => {
          item["category"] = res2.data.filter(
            (sub) => sub.id == item.categoryId
          )[0];
        });
        setDataSource(list);
      });
  }, [username, type]);
  const handlePublish = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notice();
      });
  };
  const handleSunset = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
        publishTime: Date.now(),
      })
      .then((res) => {
        notice();
      });
  };
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((item) => item.id !== id));
    axios.delete(`/news/${id}`).then((res) => {
      notice();
    });
  };
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}
export default usePublish;
