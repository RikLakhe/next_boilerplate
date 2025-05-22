import { NextApiRequest, NextApiResponse } from "next";

import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dtos/create-department.dto";
import { UpdateDepartmentDto } from "./dtos/update-department.dto";

export class DepartmentController {
  private readonly departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const department = await this.departmentService.findAll();
      res.status(200).json(department);
    } catch (error) {
      DepartmentController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const department = await this.departmentService.findAll();
      const dropdownList = department.map((data) => {
        return {
          id: data.id,
          departmentName: data.departmentName,
          description: data.description,
          departmentManagerId: data.departmentManagerId,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      DepartmentController.handleError(error, res);
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateDepartmentDto, req.body);

      const newDepartment = await this.departmentService.create(createDto);
      res.status(201).json(newDepartment);
    } catch (error) {
      DepartmentController.handleError(error, res);
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const updateDto = await validateDto(UpdateDepartmentDto, req.body);

      const newDepartment = await this.departmentService.update(
        updateDto.id,
        updateDto,
      );
      res.status(201).json(newDepartment);
    } catch (error) {
      DepartmentController.handleError(error, res);
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
