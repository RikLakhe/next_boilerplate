import { Department, User } from "@prisma/client";

export interface DepartmentDetail extends Department {
  departmentManager: User | null;
}
