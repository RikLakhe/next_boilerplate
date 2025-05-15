import axiosConfig from "@/app/config/axiosConfig";
import { MasterDataProps } from "@/types/masterData";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMasterData = createAsyncThunk(
  "fetch/masterData",
  async () => {
    const resp = await axiosConfig.get<MasterDataProps[]>("/master-data");
    return resp.data;
  },
);

export const storeMasterData = createAsyncThunk(
  "store/masterData",
  async (data: MasterDataProps, { rejectWithValue }) => {
    try {
      const resp = await axiosConfig.post<MasterDataProps>(
        "/master-data",
        data,
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create master data",
      );
    }
  },
);

export const updateMasterData = createAsyncThunk(
  "update/masterData",
  async (data: MasterDataProps, { rejectWithValue }) => {
    try {
      const resp = await axiosConfig.put<MasterDataProps>(
        `/master-data/${data.id}`,
        data,
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update master data",
      );
    }
  },
);
