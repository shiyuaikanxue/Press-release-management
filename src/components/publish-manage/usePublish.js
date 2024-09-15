/* eslint-disable eqeqeq */
import axios from "axios";
import { useEffect, useState } from "react";
function usePublish(type, notice) {
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
            (sub) => sub._id == item.categoryId
          )[0];
        });
        setDataSource(list);
      });
  }, [username, type]);
  const handlePublish = (id) => {
    setDataSource(dataSource.filter((item) => item._id !== id));
    axios
      .patch(`/news?_id=${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notice();
      });
  };
  const handleSunset = (id) => {
    setDataSource(dataSource.filter((item) => item._id !== id));
    axios
      .patch(`/news?_id=${id}`, {
        publishState: 3,
        publishTime: Date.now(),
      })
      .then((res) => {
        notice();
      });
  };
  const handleDelete = (id) => {
    setDataSource(dataSource.filter((item) => item._id !== id));
    axios.delete(`/news?_id=${id}`).then((res) => {
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
