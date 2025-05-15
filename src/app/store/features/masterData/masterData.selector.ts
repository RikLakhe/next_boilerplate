import { RootState } from "../..";

export const selectMasterData = (state: RootState) => {
  return state.masterData?.data;
};
export const selectMasterDataLoading = (state: RootState) => {
  return state.masterData?.loading;
};
export const selectMasterDataError = (state: RootState) => {
  return state.masterData?.error;
};
