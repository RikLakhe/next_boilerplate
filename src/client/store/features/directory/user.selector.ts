import { RootState } from "../..";

export const selectUserData = (state: RootState) => {
  return state.userData?.data;
};
export const selectUserDataLoading = (state: RootState) => {
  return state.userData?.loading;
};
export const selectUserDataError = (state: RootState) => {
  return state.userData?.error;
};
