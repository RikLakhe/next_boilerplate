import { RootState } from "../..";

export const selectFiscalYear = (state: RootState) => {
  return state.fiscalYear?.data;
};
export const selectFiscalYearLoading = (state: RootState) => {
  return state.fiscalYear?.loading;
};
export const selectFiscalYearError = (state: RootState) => {
  return state.fiscalYear?.error;
};
