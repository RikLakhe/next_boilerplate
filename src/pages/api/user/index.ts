import type { NextApiRequest, NextApiResponse } from "next";
import { UserController } from "@/server/modules/users/user.controller";

const userController = new UserController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await userController.create(req, res);
      break;

    case "GET":
      await userController.findAll(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
