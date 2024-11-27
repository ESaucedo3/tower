import { dbContext } from "../db/DbContext.js";
import { Forbidden } from "../utils/Errors.js";

class TicketsService {
  async getUsersTickets(eventId) {
    const tickets = await dbContext.Tickets.find({ eventId: eventId })
      .populate("profile", "-email")
      .populate("event");
    return tickets;
  }
  async getAccountTickets(userId) {
    const tickets = await dbContext.Tickets.find({ accountId: userId })
      .populate("profile", "-email")
      .populate("event");
    return tickets;
  }
  async createTicket(ticketData) {
    const ticket = await dbContext.Tickets.create(ticketData);
    await ticket.populate("profile", "-email");
    await ticket.populate("event");
    return ticket;
  }
  async deleteTicket(userId, ticketId) {
    const ticketToDelete = await dbContext.Tickets.findById(ticketId);
    if (!ticketToDelete) throw Error(`There is no id of ${ticketToDelete}`);
    if (ticketToDelete.accountId != userId)
      throw new Forbidden("You cannot remove a ticket that is not yours");
    await ticketToDelete.deleteOne();
    return "Ticket succesfully removed";
  }
}

export const ticketsService = new TicketsService();
