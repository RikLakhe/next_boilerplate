import type { NextApiRequest, NextApiResponse } from "next";
import { UserController } from "@/server/modules/users/user.controller";

const userController = new UserController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    await userController.list(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
