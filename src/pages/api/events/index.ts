import type { NextApiRequest, NextApiResponse } from "next";

import { EventsController } from "@/server/modules/events/events.controller";

const eventsController = new EventsController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      await eventsController.create(req, res);
      break;

    case "GET":
      await eventsController.findAll(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
