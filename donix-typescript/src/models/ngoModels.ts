import { model,Schema,Document } from "mongoose";
import { IHospital } from "./hospitalModel";
import { User } from "./userModel";
export interface INGO extends Document {
    name: string;
    adminUser?: User["_id"];
    mission: string;
    location: string;
    contactNumber: string;
    email: string;
    website?: string;
    areasOfWork: string[];
    partneredHospitals?: IHospital["_id"][];
    totalVolunteers: number;
    establishedYear?: number;
    createdAt: Date;
  }
  
  const NGOSchema = new Schema<INGO>(
    {
      name: { type: String, required: true },
      adminUser: { type: Schema.Types.ObjectId, ref: "User" },
      mission: { type: String, required: true },
      location: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String, required: true },
      website: { type: String },
      areasOfWork: { type: [String], required: true },
      partneredHospitals: [{ type: Schema.Types.ObjectId, ref: "Hospital" }],
      totalVolunteers: { type: Number, default: 0 },
      establishedYear: { type: Number },
    },
    { timestamps: true }
  );
  
  export const NGO = model<INGO>("NGO", NGOSchema);
  