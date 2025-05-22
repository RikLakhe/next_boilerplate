import axiosConfig from "@/app/config/axiosConfig";
import { UserProps } from "@/types/user";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("fetch/user", async () => {
  const resp = await axiosConfig.get<UserProps[]>("/user");
  return resp.data;
});

export const storeUser = createAsyncThunk(
  "store/user",
  async (data: UserProps) => {
    try {
      const resp = await axiosConfig.post<UserProps>("/user", data);
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "update/user",
  async (data: UserProps) => {
    try {
      const resp = await axiosConfig.put<UserProps>(`/user/${data.id}`, data);
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);
