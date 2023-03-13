import axios from "axios";
import Router from "next/router";

import { NEXT_APP_AUTH, API_URL } from "@/constants";
import { setLocalStorage, cleanLocalStorage } from "./localstorage.utils";

export const httpBase = () => {
    const configHTTPHeader = {
        Pragma: "no-cache",
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    const api = axios.create({
        baseURL: `${API_URL}`,
        headers: configHTTPHeader,
        responseType: "json",
    });

    api.interceptors.response.use(
        response => {
            if (response.headers && response.headers["x-xsrf-token"]) {
                setLocalStorage(
                    NEXT_APP_AUTH,
                    response.headers["x-xsrf-token"]
                );
            }
            return response;
        },
        error => {
            if (error?.response?.status === 401) {
                cleanLocalStorage();
                Router.push(`/auth/login`);
            }
            if (error?.response?.status === 404) {
                Router.push("/404");
            }
            if (error?.response?.status === 500) {
                Router.push("/500");
            }
            return Promise.reject(error);
        }
    );

    return api;
};
