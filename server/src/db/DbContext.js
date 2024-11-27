import mongoose from "mongoose";
import { AccountSchema } from "../models/Account";
import { TowerEventSchema } from "../models/TowerEvent.js";
import { TowerCommentSchema } from "../models/TowerComment.js";
import { TicketSchema } from "../models/Ticket.js";

class DbContext {
  Account = mongoose.model("Account", AccountSchema);
  TowerEvents = mongoose.model("TowerEvent", TowerEventSchema);
  TowerComments = mongoose.model("TowerComment", TowerCommentSchema);
  Tickets = mongoose.model("Ticket", TicketSchema);
}

export const dbContext = new DbContext();
