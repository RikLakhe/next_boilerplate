import { NextApiRequest, NextApiResponse } from "next";

import { FiscalYearController } from "@/server/modules/fiscalYear/fiscalYear.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const controller = new FiscalYearController();

  switch (req.method) {
    case "GET":
      if (req.query.id) {
        await controller.findOne(req, res);
      } else {
        await controller.findAll(req, res);
      }
      break;
    case "POST":
      await controller.create(req, res);
      break;
    case "PUT":
      await controller.update(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
