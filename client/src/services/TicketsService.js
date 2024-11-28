import { TicketEvent, TicketProfile } from "@/models/Ticket.js";
import { api } from "./AxiosService.js";
import { AppState } from "@/AppState.js";
import { logger } from "@/utils/Logger.js";

class TicketsService {
  async getAccountAttendingEvents() {
    const response = await api.get("account/tickets");
    const attendingEvents = response.data.map(
      (attendingEvent) => new TicketEvent(attendingEvent)
    );
    AppState.eventTickets = attendingEvents;
  }
  async getEventAttendees(eventId) {
    const response = await api.get(`api/events/${eventId}/tickets`);
    const acquiredAttendees = response.data.map(
      (attendee) => new TicketProfile(attendee)
    );
    AppState.profileTickets = acquiredAttendees;
  }

  async createTicket(ticketData) {
    const response = await api.post("api/tickets", ticketData);
    const createdTicket = new TicketProfile(response.data);
    AppState.profileTickets.push(createdTicket);
    AppState.activeTowerEvent.ticketCount++;
  }

  async deleteTicket(ticketId) {
    const response = await api.delete(`api/tickets/${ticketId}`);
    logger.log(response.data);
    const ticketIndex = AppState.eventTickets.findIndex(
      (eventTicket) => eventTicket.id === ticketId
    );
    AppState.eventTickets.splice(ticketIndex, 1);
  }
}

export const ticketsService = new TicketsService();
