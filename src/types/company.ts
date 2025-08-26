import dayjs from "dayjs";

export interface CompanyValue {
  value: string;
  description: string;
}

export interface WorkingWeekData {
  key: string;
  day: string;
  isActive: boolean;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}

export interface FiscalYearData {
  key: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  isActive?: boolean;
}

export interface CompanyFormData {
  companyName: string;
  companyEmail: string;
  missionStatement: string;
  phoneNumber: string;
  website: string;
  country: string;
  state: string;
  city: string;
  timezone: string;
  companyValues: CompanyValue[];
  fiscalYears: FiscalYearData[];
  workingWeek: Record<
    string,
    {
      isActive: boolean;
      startTime?: dayjs.Dayjs;
      endTime?: dayjs.Dayjs;
    }
  >;
  celebrateEmployees: boolean;
  newEmployee: boolean;
  workAnniversary: boolean;
  birthdays: boolean;
  enableCompanyValues?: boolean;
}
