import axiosConfig from "@/client/config/axiosConfig";
import { User } from "@prisma/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("fetch/user", async () => {
  const resp = await axiosConfig.get<User[]>("/user");
  return resp.data;
});

export const storeUser = createAsyncThunk("store/user", async (data: User) => {
  try {
    const resp = await axiosConfig.post<User>("/user", data);
    return resp.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
});

export const updateUser = createAsyncThunk(
  "update/user",
  async (data: User) => {
    try {
      const resp = await axiosConfig.put<User>(`/user/${data.id}`, data);
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);
