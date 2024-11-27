import { Schema } from "mongoose";

export const TicketSchema = new Schema(
  {
    accountId: { type: Schema.ObjectId, required: true, ref: "Account" },
    eventId: { type: Schema.ObjectId, required: true, ref: "TowerEvent" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

TicketSchema.virtual("profile", {
  localField: "accountId",
  ref: "Account",
  foreignField: "_id",
  justOne: true,
});

TicketSchema.virtual("event", {
  localField: "eventId",
  ref: "TowerEvent",
  foreignField: "_id",
  justOne: true,
});
