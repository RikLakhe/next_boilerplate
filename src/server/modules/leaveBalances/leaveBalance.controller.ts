import { NextApiRequest, NextApiResponse } from "next";
import { LeaveBalanceAppController } from "./leaveBalance.app.controller";
import { LeaveBalanceService } from "./leaveBalance.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const leaveBalanceService = new LeaveBalanceService();
  const leaveBalanceAppController = new LeaveBalanceAppController(
    leaveBalanceService,
  );

  switch (req.method) {
    case "GET":
      if (req.query.userId) {
        return leaveBalanceAppController.findByUserId(req, res);
      }
      if (req.query.id) {
        if (req.query.availableDays) {
          return leaveBalanceAppController.getAvailableDays(req, res);
        }
        return leaveBalanceAppController.findOne(req, res);
      }
      return leaveBalanceAppController.findAll(req, res);

    case "POST":
      return leaveBalanceAppController.create(req, res);

    case "PUT":
      if (req.query.id) {
        if (req.query.usedDays) {
          return leaveBalanceAppController.updateUsedDays(req, res);
        }
        return leaveBalanceAppController.update(req, res);
      }
      return res.status(400).json({ message: "ID is required" });

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
