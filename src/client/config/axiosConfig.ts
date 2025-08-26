import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Router from "next/router";

const axiosConfig: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: you can inject auth headers here if you have a token
axiosConfig.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // e.g. if you store a JWT in localStorage (optional)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: handle 401s and custom redirect flags
axiosConfig.interceptors.response.use(
  (response: AxiosResponse) => {
    // Some APIs return { redirect: '/login' } instead of 401
    if (
      response.data &&
      typeof response.data === "object" &&
      "redirect" in response.data
    ) {
      const redirectTo = (response.data as { redirect: string }).redirect;
      // only run on client
      if (typeof window !== "undefined") {
        Router.replace(redirectTo);
      }
      // prevent further then-chains from executing
      return Promise.reject(new Error(`Redirect to ${redirectTo}`));
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized: send user to login
      if (typeof window !== "undefined") {
        Router.replace("/auth");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosConfig;
