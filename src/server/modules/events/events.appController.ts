import { EventsAppProps } from "@/types/calendar";
import { EventsService } from "./events.service";

export class EventsAppController {
  private readonly eventsService: EventsService;

  constructor() {
    this.eventsService = new EventsService();
  }

  async list(): Promise<EventsAppProps[]> {
    return this.eventsService.findAll();
  }
}
