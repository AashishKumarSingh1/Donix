import { model,Schema,Document } from "mongoose";
import { IRecipient } from "./recepeintModel";
export interface IEmergency extends Document {
    recipient: IRecipient["_id"];
    urgencyLevel: "Critical" | "High";
    notes?: string;
    alertSent: boolean;
    createdAt: Date;
  }
  
  const EmergencySchema = new Schema<IEmergency>({
    recipient: { type: Schema.Types.ObjectId, ref: "Recipient", required: true },
    urgencyLevel: { type: String, enum: ["Critical", "High"], required: true },
    notes: { type: String },
    alertSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
  export const Emergency = model<IEmergency>("Emergency", EmergencySchema);
  