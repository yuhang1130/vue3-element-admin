import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { getAccessToken } from "@/utils/auth";
import router from "@/router";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    // 如果 Authorization 设置为 no-auth，则不携带 Token，用于登录、刷新 Token 等接口
    if (config.headers.Authorization !== "no-auth" && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
    if (response.config.responseType === "blob") {
      return response;
    }

    const { code, data, message } = response.data;
    if (code === ResultEnum.Success) {
      return data;
    } else if (code === ResultEnum.NoLogin) {
      ElNotification({
        title: "提示",
        message: "您的会话已过期，请重新登录",
        type: "info",
      });
      useUserStoreHook()
        .clearUserData()
        .then(() => {
          router.push("/login");
        });
    } else {
      ElMessage.error(message || "系统出错");
      return Promise.reject(new Error(message || "Error"));
    }
  },
  async (error) => {
    console.error("request error", error); // for debug
    // 非 2xx 状态码处理 401、403、500 等
    const { response } = error;
    if (response) {
      const { code, message } = response.data;
      ElMessage.error(message || "系统出错");
    }
    return Promise.reject(error.message);
  }
);

export default service;
