import { Area, Designation, EmploymentStatus, User } from "@prisma/client";

export interface UserDetails extends User {
  currentEmploymentStatus: EmploymentStatus | null;
  currentArea: Area | null;
  currentDesignation: Designation | null;
  manager: User | null;
}
