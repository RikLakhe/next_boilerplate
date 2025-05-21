import { NextApiRequest, NextApiResponse } from "next";
import { HttpException } from "@/server/common/exceptions/http-exception";
import { getServerSession } from "next-auth";
import { LeaveBalanceService } from "./leaveBalance.service";
import { CreateLeaveBalanceDto } from "./dtos/create-leaveBalance.dto";
import { UpdateLeaveBalanceDto } from "./dtos/update-leaveBalance.dto";
import { authOptions } from "@/server/auth";
import { checkRole } from "@/server/common/utils/check-role.util";

export class LeaveBalanceAppController {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  async findAll(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      if (!checkRole(session, ["admin", "hr"])) {
        throw new HttpException(403, "Forbidden");
      }

      const leaveBalances = await this.leaveBalanceService.findAll();
      return res.status(200).json(leaveBalances);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async findByUserId(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      const userId = Number(req.query.userId);
      if (!userId) {
        throw new HttpException(400, "User ID is required");
      }

      if (!checkRole(session, ["admin", "hr"]) && session.user.id !== userId) {
        throw new HttpException(403, "Forbidden");
      }

      const leaveBalances = await this.leaveBalanceService.findByUserId(userId);
      return res.status(200).json(leaveBalances);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async findOne(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      const id = Number(req.query.id);
      if (!id) {
        throw new HttpException(400, "ID is required");
      }

      const leaveBalance = await this.leaveBalanceService.findOne(id);
      if (
        !checkRole(session, ["admin", "hr"]) &&
        session.user.id !== leaveBalance.user_id
      ) {
        throw new HttpException(403, "Forbidden");
      }

      return res.status(200).json(leaveBalance);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      if (!checkRole(session, ["admin", "hr"])) {
        throw new HttpException(403, "Forbidden");
      }

      const createLeaveBalanceDto: CreateLeaveBalanceDto = req.body;
      const newLeaveBalance = await this.leaveBalanceService.create({
        ...createLeaveBalanceDto,
        createdBy: session.user.id,
      });

      return res.status(201).json(newLeaveBalance);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      if (!checkRole(session, ["admin", "hr"])) {
        throw new HttpException(403, "Forbidden");
      }

      const id = Number(req.query.id);
      if (!id) {
        throw new HttpException(400, "ID is required");
      }

      const updateLeaveBalanceDto: UpdateLeaveBalanceDto = req.body;
      const updatedLeaveBalance = await this.leaveBalanceService.update(id, {
        ...updateLeaveBalanceDto,
        updatedBy: session.user.id,
      });

      return res.status(200).json(updatedLeaveBalance);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUsedDays(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      if (!checkRole(session, ["admin", "hr"])) {
        throw new HttpException(403, "Forbidden");
      }

      const id = Number(req.query.id);
      if (!id) {
        throw new HttpException(400, "ID is required");
      }

      const { usedDays } = req.body;
      if (typeof usedDays !== "number") {
        throw new HttpException(400, "Used days must be a number");
      }

      const updatedLeaveBalance = await this.leaveBalanceService.updateUsedDays(
        id,
        usedDays,
      );
      return res.status(200).json(updatedLeaveBalance);
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAvailableDays(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        throw new HttpException(401, "Unauthorized");
      }

      const id = Number(req.query.id);
      if (!id) {
        throw new HttpException(400, "ID is required");
      }

      const leaveBalance = await this.leaveBalanceService.findOne(id);
      if (
        !checkRole(session, ["admin", "hr"]) &&
        session.user.id !== leaveBalance.user_id
      ) {
        throw new HttpException(403, "Forbidden");
      }

      const availableDays = await this.leaveBalanceService.getAvailableDays(id);
      return res.status(200).json({ availableDays });
    } catch (error) {
      if (error instanceof HttpException) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
