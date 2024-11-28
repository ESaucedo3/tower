import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden, NotFound } from "../utils/Errors.js";

class TowerEventsService {
  async createEvent(eventData) {
    const eventToBeCreated = await dbContext.TowerEvents.create(eventData);
    await eventToBeCreated.populate("creator");
    await eventToBeCreated.populate("ticketCount");
    return eventToBeCreated;
  }
  async getAllEvents() {
    const acquiredEvents = await dbContext.TowerEvents.find()
      .populate("creator")
      .populate("ticketCount");
    return acquiredEvents;
  }
  async getSpecificEvent(eventId) {
    const specificEvent = await dbContext.TowerEvents.findById(eventId)
      .populate("creator")
      .populate("ticketCount");
    if (specificEvent === null) throw NotFound;
    return specificEvent;
  }
  async updateEvent(eventId, userId, eventData) {
    const eventToUpdate = await dbContext.TowerEvents.findById(eventId);
    await eventToUpdate.populate("creator");
    await eventToUpdate.populate("ticketCount");
    if (eventToUpdate.isCanceled) {
      throw new BadRequest("Event has been cancelled");
    }
    if (eventToUpdate === null) {
      throw new Error(`No ID with ${eventId} was found`);
    }
    if (eventToUpdate.creatorId != userId) {
      throw new Forbidden("You cannot update something that isn't yours");
    }

    // NOTE Might not work as expected unsure at the current moment
    // NOTE Check if eventData is valid otherwise keep the original or if a particular property wasn't updated keep the original
    eventToUpdate.name = eventData.name ?? eventToUpdate.name;
    eventToUpdate.description =
      eventData.description ?? eventToUpdate.description;
    eventToUpdate.location = eventData.location
      ? eventData.location
      : eventToUpdate.location;
    eventToUpdate.type = eventData.type ? eventData.type : eventToUpdate.type;
    eventToUpdate.startDate = eventData.startDate
      ? new Date(eventData.startDate)
      : eventToUpdate.startDate;
    eventToUpdate.capacity = eventData.capacity
      ? eventData.capacity
      : eventToUpdate.capacity;
    eventToUpdate.coverImg = eventData.coverImg
      ? eventData.coverImg
      : eventToUpdate.coverImg;

    await eventToUpdate.save();
    return eventToUpdate;
  }
  async cancelEvent(userId, eventId) {
    const eventToCancel = await dbContext.TowerEvents.findById(eventId);
    await eventToCancel.populate("creator");

    if (eventToCancel === null) {
      throw new Error(`No ID with ${eventId} was found`);
    }

    if (eventToCancel.creatorId != userId) {
      throw new Forbidden("You cannot cancel something that isn't yours");
    }

    eventToCancel.isCanceled = !eventToCancel.isCanceled;

    await eventToCancel.save();
    return eventToCancel;
  }
}

export const towerEventsService = new TowerEventsService();
