import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FiscalYear } from "@prisma/client";
import {
  fetchFiscalYear,
  storeFiscalYear,
  updateFiscalYear,
} from "./fiscalAPI.service";

interface FiscalYearState {
  data: FiscalYear[];
  loading: boolean;
  error: string | undefined;
  actionData: FiscalYear | null;
  actionLoading: boolean;
  actionError: string | undefined;
}

const initialState: FiscalYearState = {
  data: [],
  loading: false,
  error: undefined,
  actionData: null,
  actionLoading: false,
  actionError: undefined,
};

const fiscalYearSlice = createSlice({
  name: "fiscal",
  initialState,
  reducers: {
    setFiscalYear(state, action: PayloadAction<FiscalYear[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiscalYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiscalYear.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchFiscalYear.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(storeFiscalYear.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(storeFiscalYear.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionData = action.payload;
        state.data.push(action.payload);
      })
      .addCase(storeFiscalYear.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || undefined;
      })
      .addCase(updateFiscalYear.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateFiscalYear.fulfilled, (state, action) => {
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
      .addCase(updateFiscalYear.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || undefined;
      });
  },
});

export const { setFiscalYear } = fiscalYearSlice.actions;

export default fiscalYearSlice.reducer;
