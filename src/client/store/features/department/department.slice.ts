import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DepartmentDetail } from "@/types/department";
import {
  fetchDepartment,
  storeDepartment,
  updateDepartment,
} from "./departmentAPI.service";

interface DepartmentState {
  data: DepartmentDetail[];
  loading: boolean;
  error: string | null;
  actionData: DepartmentDetail | null;
  actionLoading: boolean;
  actionError: string | null;
}

const initialState: DepartmentState = {
  data: [],
  loading: false,
  error: null,
  actionData: null,
  actionLoading: false,
  actionError: null,
};

const departmentSlice = createSlice({
  name: "departmentData",
  initialState,
  reducers: {
    setDepartment(state, action: PayloadAction<DepartmentDetail[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartment.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchDepartment.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || null;
      })
      .addCase(storeDepartment.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(storeDepartment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionData = action.payload;
        state.data.push(action.payload);
      })
      .addCase(storeDepartment.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || null;
      })
      .addCase(updateDepartment.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionData = action.payload;
        const newData = [
          ...state.data.filter((data) => {
            return data.id !== action.payload.id;
          }),
          action.payload,
        ];
        state.data = newData;
      })
      .addCase(updateDepartment.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || null;
      });
  },
});

export const { setDepartment } = departmentSlice.actions;

export default departmentSlice.reducer;
