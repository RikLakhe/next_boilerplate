import type { NextApiRequest, NextApiResponse } from "next";

import { EventsController } from "@/server/modules/events/events.controller";

const eventController = new EventsController();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    res.status(400).json({ message: "Invalid ID" });
  }

  switch (req.method) {
    case "PUT":
      await eventController.update(req, res);
      break;

    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
