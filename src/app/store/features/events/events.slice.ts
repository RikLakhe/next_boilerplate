import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EventsAppProps } from "@/types/calendar";
import { fetchEvents, storeEvents, updateEvents } from "./eventsAPI.service";

interface EventsState {
  data: EventsAppProps[];
  loading: boolean;
  error: string | undefined;
  actionData: EventsAppProps | null;
  actionLoading: boolean;
  actionError: string | undefined;
}

const initialState: EventsState = {
  data: [],
  loading: false,
  error: undefined,
  actionData: null,
  actionLoading: false,
  actionError: undefined,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<EventsAppProps[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchEvents.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(storeEvents.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(storeEvents.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionData = action.payload;
        state.data.push(action.payload);
      })
      .addCase(storeEvents.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || undefined;
      })
      .addCase(updateEvents.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateEvents.fulfilled, (state, action) => {
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
      .addCase(updateEvents.rejected, (state, { error }) => {
        state.actionLoading = false;
        state.actionError = error.message || undefined;
      });
  },
});

export const { setEvents } = eventsSlice.actions;

export default eventsSlice.reducer;
