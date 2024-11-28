import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { ticketsService } from "../services/TicketsService.js";

export class TicketsController extends BaseController {
  constructor() {
    super("api/tickets");
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post("", this.createTicket)
      .delete("/:ticketId", this.deleteTicket);
  }

  async createTicket(request, response, next) {
    try {
      const ticketData = request.body;
      ticketData.accountId = request.userInfo.id;
      const createdTicket = await ticketsService.createTicket(ticketData);
      response.send(createdTicket);
    } catch (e) {
      next(e);
    }
  }

  async deleteTicket(request, response, next) {
    try {
      const ticketId = request.params.ticketId;
      const userId = request.userInfo.id;
      const deletedMsg = await ticketsService.deleteTicket(userId, ticketId);
      response.send(deletedMsg);
    } catch (e) {
      next(e);
    }
  }
}
