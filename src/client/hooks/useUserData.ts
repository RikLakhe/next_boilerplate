import { useSelector } from "react-redux";
import {
  selectUserData,
  selectUserDataError,
  selectUserDataLoading,
} from "../store/features/directory/user.selector";

export function useUserData() {
  const userData = useSelector(selectUserData);
  const loading = useSelector(selectUserDataLoading);
  const error = useSelector(selectUserDataError);

  return { userData, loading, error };
}
