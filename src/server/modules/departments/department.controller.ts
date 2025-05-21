import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dtos/create-department.dto";

export class DepartmentsController {
  private readonly departmentsService: DepartmentService;

  constructor() {
    this.departmentsService = new DepartmentService();
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateDepartmentDto, req.body);
      const newDepartment = await this.departmentsService.create(createDto);
      res.status(201).json(newDepartment);
    } catch (error) {
      DepartmentsController.handleError(error, res);
    }
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const departments = await this.departmentsService.findAll();
      res.status(200).json(departments);
    } catch (error) {
      DepartmentsController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const departments = await this.departmentsService.findAll();
      const dropdownList = departments.map((department) => {
        return {
          code: department.id,
          title: department.departmentName,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      DepartmentsController.handleError(error, res);
    }
  }

  private static handleError(error: unknown, res: NextApiResponse) {
    if (error instanceof HttpException) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      logger.error("Unhandled API error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
