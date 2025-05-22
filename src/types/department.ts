export interface DepartmentProps {
  id?: number;
  departmentName: string;
  description: string | null | undefined;
  departmentManagerId?: number | null;
}
