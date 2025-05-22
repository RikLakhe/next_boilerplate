import { Department } from "@prisma/client";

import { DepartmentProps } from "@/types/department";
import { DepartmentService } from "./department.service";

export class DepartmentAppController {
  private readonly departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  async findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  async list(): Promise<DepartmentProps[]> {
    const department = await this.departmentService.findAll();
    return department.map((data) => {
      return {
        id: data.id,
        departmentName: data.departmentName,
        description: data.description,
        departmentManagerId: data.departmentManagerId,
      };
    });
  }

  async listByEntity(): Promise<DepartmentProps[]> {
    const department = await this.departmentService.findAll();
    return department.map((data) => {
      return {
        id: data.id,
        departmentName: data.departmentName,
        description: data.description,
        departmentManagerId: data.departmentManagerId,
      };
    });
  }
}
