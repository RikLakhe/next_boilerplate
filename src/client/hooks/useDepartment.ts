import { useSelector } from "react-redux";
import {
  selectDepartment,
  selectDepartmentError,
  selectDepartmentLoading,
} from "../store/features/department/department.selector";

export function useDepartment() {
  const department = useSelector(selectDepartment);
  const error = useSelector(selectDepartmentError);
  const loading = useSelector(selectDepartmentLoading);

  return { department, loading, error };
}
