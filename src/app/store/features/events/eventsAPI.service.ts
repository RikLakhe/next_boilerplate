import axiosConfig from "@/app/config/axiosConfig";
import { EventsAppProps } from "@/types/calendar";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEvents = createAsyncThunk("fetch/events", async () => {
  const resp = await axiosConfig.get<EventsAppProps[]>("/events");
  return resp.data;
});

export const storeEvents = createAsyncThunk(
  "store/events",
  async (data: EventsAppProps) => {
    try {
      const resp = await axiosConfig.post<EventsAppProps>("/events", data);
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);

export const updateEvents = createAsyncThunk(
  "update/events",
  async (data: EventsAppProps) => {
    try {
      const resp = await axiosConfig.put<EventsAppProps>(
        `/events/${data.id}`,
        data,
      );
      return resp.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
);
