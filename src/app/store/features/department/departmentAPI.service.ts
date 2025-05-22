import axiosConfig from "@/app/config/axiosConfig";
import { DepartmentProps } from "@/types/department";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDepartment = createAsyncThunk(
  "fetch/department",
  async () => {
    const resp = await axiosConfig.get<DepartmentProps[]>("/department");
    return resp.data;
  },
);

export const storeDepartment = createAsyncThunk(
  "store/department",
  async (data: DepartmentProps, { rejectWithValue }) => {
    try {
      const resp = await axiosConfig.post<DepartmentProps>("/department", data);
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create department",
      );
    }
  },
);

export const updateDepartment = createAsyncThunk(
  "update/department",
  async (data: DepartmentProps, { rejectWithValue }) => {
    try {
      const resp = await axiosConfig.put<DepartmentProps>(
        `/department/${data.id}`,
        data,
      );
      return resp.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update department",
      );
    }
  },
);

export const deleteDepartment = createAsyncThunk(
  "delete/department",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosConfig.delete(`/department/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete department",
      );
    }
  },
);
