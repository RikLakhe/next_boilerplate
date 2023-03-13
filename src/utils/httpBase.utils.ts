import { httpBase } from "./httpBase";

export function fetchAPI(endpoint: string, params?: string) {
    return httpBase().get(`/${endpoint}`, { params });
}

export function storeAPI(endpoint: string, data: object) {
    return httpBase().post(`/${endpoint}`, data);
}

export function updateAPI(endpoint: string, data: object) {
    return httpBase().put(`/${endpoint}`, data);
}

export function destroyAPI(endpoint: string, id: string) {
    return httpBase().delete(`/${endpoint}/${id}`);
}
