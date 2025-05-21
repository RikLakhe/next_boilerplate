import { RootState } from "../..";

export const selectEvents = (state: RootState) => {
  return state.events?.data;
};
export const selectEventsLoading = (state: RootState) => {
  return state.events?.loading;
};
export const selectEventsError = (state: RootState) => {
  return state.events?.error;
};
