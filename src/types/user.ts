export interface UserProps {
  id: number;
  fullName: string | null | undefined;
  email: string;
  currentEmploymentStatusId: number;
  managerId: number | null;
  currentAreaId: number | null;
  currentDesignationId: number | null;
  full_name?: string | null;
}
