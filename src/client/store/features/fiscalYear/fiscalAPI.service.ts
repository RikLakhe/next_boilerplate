import axiosConfig from "@/client/config/axiosConfig";
import { FiscalYear } from "@prisma/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFiscalYear = createAsyncThunk(
  "fetch/fiscalYear",
  async () => {
    const resp = await axiosConfig.get<FiscalYear[]>("/fiscal");
    return resp.data;
  },
);

export const storeFiscalYear = createAsyncThunk(
  "store/fiscal",
  async (data: FiscalYear) => {
    try {
      const resp = await axiosConfig.post<FiscalYear>("/fiscal", data);
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);

export const updateFiscalYear = createAsyncThunk(
  "update/fiscal",
  async (data: FiscalYear) => {
    try {
      const resp = await axiosConfig.put<FiscalYear>(
        `/fiscal/${data.id}`,
        data,
      );
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);
