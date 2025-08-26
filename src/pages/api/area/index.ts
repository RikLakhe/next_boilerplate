import type { NextApiRequest, NextApiResponse } from "next";
import { AreasController } from "@/server/modules/areas/area.controller";

const areasController = new AreasController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await areasController.create(req, res);
      break;

    case "GET":
      await areasController.findAll(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
