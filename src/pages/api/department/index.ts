import type { NextApiRequest, NextApiResponse } from "next";
import { DepartmentController } from "@/server/modules/departments/department.controller";

const departmentsController = new DepartmentController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await departmentsController.create(req, res);
      break;

    case "GET":
      await departmentsController.findAll(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
