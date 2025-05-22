import { DepartmentDetail } from "@/types/department";
import { DepartmentService } from "./department.service";

export class DepartmentAppController {
  private readonly departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  async list(): Promise<DepartmentDetail[]> {
    return this.departmentService.findAll();
  }
}
