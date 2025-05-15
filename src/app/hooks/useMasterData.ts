import { useSelector } from "react-redux";
import {
  selectMasterData,
  selectMasterDataError,
  selectMasterDataLoading,
} from "../store/features/masterData/masterData.selector";

export function useMasterData() {
  const masterData = useSelector(selectMasterData);
  const loading = useSelector(selectMasterDataLoading);
  const error = useSelector(selectMasterDataError);

  return { masterData, loading, error };
}
