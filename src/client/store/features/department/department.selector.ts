import { RootState } from "../..";

export const selectDepartment = (state: RootState) => {
  return state.department?.data;
};
export const selectDepartmentLoading = (state: RootState) => {
  return state.department?.loading;
};
export const selectDepartmentError = (state: RootState) => {
  return state.department?.error;
};
