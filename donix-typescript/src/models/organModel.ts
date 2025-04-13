import { model,Schema,Document } from "mongoose";
import { IDonor } from "./donorModel";
export interface IOrgan extends Document {
    donor: IDonor["_id"];
    organType: string;
    status: "Available" | "Matched" | "Transplanted";
    location?: string;
    createdAt: Date;
  }
  
  const OrganSchema = new Schema<IOrgan>({
    donor: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    organType: { type: String, enum: ["Heart", "Kidney", "Liver", "Lungs", "Pancreas", "Cornea"], required: true },
    status: { type: String, enum: ["Available", "Matched", "Transplanted"], default: "Available" },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
  export const Organ = model<IOrgan>("Organ", OrganSchema);
  