import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@prisma/client";
import { fetchUser, storeUser, updateUser } from "./userDataAPI.service";

interface UserState {
  data: User[];
  loading: boolean;
  error: string | undefined;
  actionData: User | null;
  actionLoading: boolean;
  actionError: string | undefined;
}

const initialState: UserState = {
  data: [],
  loading: false,
  error: undefined,
  actionData: null,
  actionLoading: false,
  actionError: undefined,
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<User[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(storeUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(storeUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.data.push(action.payload);
      })
      .addCase(storeUser.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || undefined;
      })
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionData = action.payload;
        const updatedData = {
          ...action.payload,
        };
        const newData = [
          ...state.data.filter((data) => {
            return data.id !== updatedData.id;
          }),
          updatedData,
        ];
        state.data = newData;
      })
      .addCase(updateUser.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || undefined;
      });
  },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
