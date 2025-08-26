import type { NextApiRequest, NextApiResponse } from "next";
import { AreasController } from "@/server/modules/areas/area.controller";

const areasController = new AreasController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await areasController.list(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
