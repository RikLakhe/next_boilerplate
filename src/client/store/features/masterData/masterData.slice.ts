import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MasterData } from "@prisma/client";

import {
  fetchMasterData,
  storeMasterData,
  updateMasterData,
} from "./masterDataAPI.service";

interface MasterDataState {
  data: MasterData[];
  loading: boolean;
  error: string | undefined;
  actionData: MasterData | null;
  actionLoading: boolean;
  actionError: string | undefined;
}

const initialState: MasterDataState = {
  data: [],
  loading: false,
  error: undefined,
  actionData: null,
  actionLoading: false,
  actionError: undefined,
};

const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    setMasterData(state, action: PayloadAction<MasterData[]>) {
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
        state.error = error.message;
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
        state.actionError = error.message || undefined;
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
        state.actionError = error.message || undefined;
      });
  },
});

export const { setMasterData } = masterDataSlice.actions;

export default masterDataSlice.reducer;
