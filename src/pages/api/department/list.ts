import type { NextApiRequest, NextApiResponse } from "next";
import { DepartmentsController } from "@/server/modules/departments/department.controller";

const departmentsController = new DepartmentsController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await departmentsController.list(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
