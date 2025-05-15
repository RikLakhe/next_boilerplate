import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MasterDataProps } from "@/types/masterData";
import {
  fetchMasterData,
  storeMasterData,
  updateMasterData,
} from "./masterDataAPI.service";

interface MasterDataState {
  data: MasterDataProps[];
  loading: boolean;
  error: string | null;
  actionData: MasterDataProps | null;
  actionLoading: boolean;
  actionError: string | null;
}

const initialState: MasterDataState = {
  data: [],
  loading: false,
  error: null,
  actionData: null,
  actionLoading: false,
  actionError: null,
};

const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    setMasterData(state, action: PayloadAction<MasterDataProps[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMasterData.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchMasterData.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || null;
      })
      .addCase(storeMasterData.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(storeMasterData.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionData = action.payload;
        state.data.push(action.payload);
      })
      .addCase(storeMasterData.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || null;
      })
      .addCase(updateMasterData.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateMasterData.fulfilled, (state, action) => {
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
      .addCase(updateMasterData.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || null;
      });
  },
});

export const { setMasterData } = masterDataSlice.actions;

export default masterDataSlice.reducer;
