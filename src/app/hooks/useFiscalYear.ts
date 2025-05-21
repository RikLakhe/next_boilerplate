import { useSelector } from "react-redux";
import {
  selectFiscalYear,
  selectFiscalYearError,
  selectFiscalYearLoading,
} from "../store/features/fiscalYear/fiscal.selector";

export function useFiscalYear() {
  const fiscalYear = useSelector(selectFiscalYear);
  const loading = useSelector(selectFiscalYearLoading);
  const error = useSelector(selectFiscalYearError);

  return { fiscalYear, loading, error };
}
