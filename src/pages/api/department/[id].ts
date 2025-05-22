import type { NextApiRequest, NextApiResponse } from "next";
import { DepartmentController } from "@/server/modules/departments/department.controller";

const departmentController = new DepartmentController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    res.status(400).json({ message: "Invalid ID" });
  }

  switch (req.method) {
    case "PUT":
      await departmentController.update(req, res);
      break;

    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
