import { NextApiRequest, NextApiResponse } from "next";
import { DesignationController } from "../../../server/modules/designation/designation.controller";

const controller = new DesignationController();

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      await controller.findAll(req, res);
      break;

    case "POST":
      await controller.create(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
