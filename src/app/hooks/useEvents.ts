import { useSelector } from "react-redux";

import {
  selectEvents,
  selectEventsError,
  selectEventsLoading,
} from "../store/features/events/events.selector";

export function useEvents() {
  const events = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);

  return { events, loading, error };
}
