import { NextApiRequest, NextApiResponse } from "next";
import { validateDto } from "@/server/common/utils/validation.util";
import logger from "@/server/common/utils/logger.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { UsersService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";

export class UserController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createDto = await validateDto(CreateUserDto, req.body);
      const newUser = await this.usersService.create(createDto);
      res.status(201).json(newUser);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const users = await this.usersService.findAll();
      res.status(200).json(users);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  async list(req: NextApiRequest, res: NextApiResponse) {
    try {
      const users = await this.usersService.findAll();
      const dropdownList = users.map((user) => {
        return {
          code: user.id,
          title: user.fullName,
        };
      });
      res.status(200).json(dropdownList);
    } catch (error) {
      UserController.handleError(error, res);
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
