import { User } from "@prisma/client";

import { UsersService } from "./user.service";

export class UserAppController {
  private readonly userService: UsersService;

  constructor() {
    this.userService = new UsersService();
  }

  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
