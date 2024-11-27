import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { towerEventsService } from "../services/TowerEventsService.js";
import { ticketsService } from "../services/TicketsService.js";
import { towerCommentsService } from "../services/TowerCommentsService.js";

export class TowerEventsController extends BaseController {
  constructor() {
    super("api/events");
    this.router
      .get("", this.getAllEvents)
      .get("/:eventId", this.getSpecificEvent)
      .get("/:eventId/tickets", this.getUsersTickets)
      .get("/:eventId/comments", this.getEventComments)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post("", this.createEvent)
      .put("/:eventId", this.updateEvent)
      .delete("/:eventId", this.cancelEvent);
  }

  async createEvent(request, response, next) {
    try {
      const eventData = request.body;
      const userInfo = request.userInfo;
      eventData.creatorId = userInfo.id;
      const createdEvent = await towerEventsService.createEvent(eventData);
      response.send(createdEvent);
    } catch (e) {
      next(e);
    }
  }

  async getAllEvents(request, response, next) {
    try {
      const acquiredEvents = await towerEventsService.getAllEvents();
      response.send(acquiredEvents);
    } catch (e) {
      next(e);
    }
  }

  async getSpecificEvent(request, response, next) {
    try {
      const eventId = request.params.eventId;
      const specificEvent = await towerEventsService.getSpecificEvent(eventId);
      response.send(specificEvent);
    } catch (e) {
      next(e);
    }
  }

  // NOTE People who have tickets for the event
  async getUsersTickets(request, response, next) {
    try {
      const eventId = request.params.eventId;
      const usersTickets = await ticketsService.getUsersTickets(eventId);
      response.send(usersTickets);
    } catch (e) {
      next(e);
    }
  }

  async getEventComments(request, response, next) {
    try {
      const eventId = request.params.eventId;
      const eventComments = await towerCommentsService.getEventComments(
        eventId
      );
      response.send(eventComments);
    } catch (e) {
      next(e);
    }
  }

  async updateEvent(request, response, next) {
    try {
      const eventId = request.params.eventId;
      const eventData = request.body;
      const user = request.userInfo;
      const updatedEvent = await towerEventsService.updateEvent(
        eventId,
        user.id,
        eventData
      );
      response.send(updatedEvent);
    } catch (e) {
      next(e);
    }
  }

  async cancelEvent(request, response, next) {
    try {
      const eventId = request.params.eventId;
      const userId = request.userInfo.id;
      const cancelledEvent = await towerEventsService.cancelEvent(
        userId,
        eventId
      );
      response.send(cancelledEvent);
    } catch (e) {
      next(e);
    }
  }
}
