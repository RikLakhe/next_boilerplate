export interface EventsProps {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  event_type_code: string | null;
  is_all_day?: boolean | null;
  is_recurring?: boolean | null;
  recurrence_pattern?: string | null;
  visibility_scope?: string | null;
  is_active?: boolean;
  created_by: number;
}

export interface EventsAppProps {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isAllDay?: boolean | null;
  isRecurring?: boolean | null;
  recurrencePattern?: string | null;
  visibilityScope?: string | null;
  isActive?: boolean;
  createdBy: number;
}
