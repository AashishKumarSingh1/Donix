import { model, Schema, Document } from "mongoose";
import { User } from "./userModel";

export interface ITicket extends Document {
  user: User["_id"];
  subject: string;
  description: string;
  category: "Verification Issue" | "Organ Matching" | "Technical Issue" | "Legal Concern" | "Other";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  attachments?: string[];
  adminResponse?: string;
  resolvedBy?: User["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Verification Issue", "Organ Matching", "Technical Issue", "Legal Concern", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    attachments: { type: [String] },
    adminResponse: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>("Ticket", TicketSchema);
