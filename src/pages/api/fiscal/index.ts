import { FiscalYearController } from "@/server/modules/fiscalYear/fiscalYear.controller";
import type { NextApiRequest, NextApiResponse } from "next";

const fiscalYearController = new FiscalYearController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await fiscalYearController.create(req, res);
      break;

    case "GET":
      await fiscalYearController.findAll(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
