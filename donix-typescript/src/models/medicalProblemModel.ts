import { Schema, model, Document } from "mongoose";
import { User } from "./userModel";

export interface IMedicalProblem extends Document {
  user: User["_id"];
  conditionName: string;
  severity: "Mild" | "Moderate" | "Severe" | "Critical";
  diagnosedAt: Date;
  notes?: string;
  updatedAt: Date;
}

const MedicalProblemSchema = new Schema<IMedicalProblem>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  conditionName: { type: String, required: true },
  severity: { type: String, enum: ["Mild", "Moderate", "Severe", "Critical"], required: true },
  diagnosedAt: { type: Date, required: true },
  notes: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

export const MedicalProblem = model<IMedicalProblem>("MedicalProblem", MedicalProblemSchema);
