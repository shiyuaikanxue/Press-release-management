import axios from "axios";
import { showLoading, closeLoading } from "../redux/slice/loadingSlice";
import store from "../redux/store";
// const baseURL = "http://localhost:8080";
const baseURL = "http://8.140.48.159:8080";
export default baseURL;
axios.defaults.baseURL = baseURL;
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    store.dispatch(showLoading());
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    store.dispatch(closeLoading());
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    store.dispatch(closeLoading());
    return Promise.reject(error);
  }
);
