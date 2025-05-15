import type { NextApiRequest, NextApiResponse } from "next";
import { MasterDataController } from "@/server/modules/masterData/masterData.controller";

const masterDataController = new MasterDataController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await masterDataController.create(req, res);
      break;

    case "GET":
      await masterDataController.findAll(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
