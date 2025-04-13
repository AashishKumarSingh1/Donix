import { Schema, model, Document } from "mongoose";
import { User } from "./userModel";
import { IHospital } from "./hospitalModel";

export interface IRecipient extends Document {
  user: User["_id"]; 
  requiredOrgan: "Heart" | "Kidney" | "Liver" | "Lungs" | "Pancreas" | "Cornea";
  urgencyLevel: "Low" | "Medium" | "High";
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  HLACompatibility?: string;
  medicalHistory?: string;
  hospitalAssigned?: {
    hospital: IHospital["_id"];
    assignedDoctor: string;
  };
  additionalNotes?: string;
  status: "Active" | "Waiting" | "Removed";
  sourceAddedBy: "Hospital" | "NGO" | "System";
  createdAt: Date;
}

const RecipientSchema = new Schema<IRecipient>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requiredOrgan: {
      type: String,
      enum: ["Heart", "Kidney", "Liver", "Lungs", "Pancreas", "Cornea"],
      required: true,
    },
    urgencyLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    HLACompatibility: { type: String },
    medicalHistory: { type: String },
    hospitalAssigned: {
      hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },
      assignedDoctor: { type: String },
    },
    additionalNotes: { type: String },
    status: { type: String, enum: ["Active", "Waiting", "Removed"], default: "Waiting" },
    sourceAddedBy: { type: String, enum: ["Hospital", "NGO", "System"], required: true },
  },
  { timestamps: true }
);

export const Recipient = model<IRecipient>("Recipient", RecipientSchema);
