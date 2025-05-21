import axiosConfig from "@/app/config/axiosConfig";
import { MasterData } from "@prisma/client";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMasterData = createAsyncThunk(
  "fetch/masterData",
  async (entity: string = "") => {
    const resp = await axiosConfig.get<MasterData[]>(`/master-data/${entity}`);
    return resp.data;
  },
);

export const storeMasterData = createAsyncThunk(
  "store/masterData",
  async (data: MasterData) => {
    try {
      const resp = await axiosConfig.post<MasterData>("/master-data", data);
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);

export const updateMasterData = createAsyncThunk(
  "update/masterData",
  async (data: MasterData) => {
    try {
      const resp = await axiosConfig.put<MasterData>(
        `/master-data/${data.id}`,
        data,
      );
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);
