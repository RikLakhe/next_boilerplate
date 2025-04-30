/* eslint-disable */
// @ts-nocheck

import axios, { AxiosRequestConfig } from "axios";

import { getLocalStorage } from "./storageUtils";
import { appConfig } from "@/app/constants/ui/app-config";
import { clearUserLoggedStorage } from "./commonUtils";

interface Params {
  [key: string]: string | number | boolean | object;
}

// content type
axios.interceptors.response.use(
  (response) => {
    if (response.headers && response.headers["x-xsrf-token"]) {
      localStorage.setItem(
        appConfig?.CLIENT_JWT_TOKEN,
        response.headers["x-xsrf-token"],
      );
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      clearUserLoggedStorage();
    }
    return Promise.reject(error);
  },
);

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = appConfig.API_URL;
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  /*
    Check if token available in session
  */
  const token = getLocalStorage(appConfig?.CLIENT_JWT_TOKEN);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

class APICore {
  defaultErrorObject: { message: string };

  constructor() {
    this.defaultErrorObject = { message: "Something went wrong" };
  }

  /**
   * Fetches data from given url
   */
  fetchAPI = (url: string, params?: Params) => {
    let response;
    if (params) {
      const queryString = params
        ? Object.keys(params)
          .map((key) => {
            return `${key}=${params[key]}`;
          })
          .join("&")
        : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }
    return response;
  };

  fetchAPIWithURL = (url: string, params?: Params) => {
    return axios.get(`${url}`, params);
  };

  /**
   * post given data to url
   */
  storeAPI = (url: string, data: object) => {
    return axios.post(url, data);
  };

  /**
   * Updates data
   */
  updateAPI = (url: string, data: object) => {
    return axios.put(url, data);
  };

  /**
   * Updates data
   */
  uploadAPI = (url: string, data: object, options?: any) => {
    return axios.post(url, data, options);
  };

  /**
   * Deletes data
   */
  deleteAPI = (url: string) => {
    return axios.delete(url);
  };
}

export { APICore };
