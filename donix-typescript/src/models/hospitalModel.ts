import { Schema, model, Document } from "mongoose";
import { User } from "./userModel";

export interface IHospital extends Document {
  name: string;
  location: string;
  contactNumber: string;
  adminUser?: User["_id"];
  accreditation?: string;
  specialization: string[];
  servicesOffered: string[];
  staff: {
    doctors: number;
    nurses: number;
    supportStaff: number;
  };
  capacity: {
    totalBeds: number;
    icuBeds: number;
    ventilators: number;
  };
  emergencyContact: string;
  website?: string;
  establishedYear?: number;
  createdAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    adminUser: { type: Schema.Types.ObjectId, ref: "User" },
    accreditation: { type: String, default: "Not Accredited" },
    specialization: { type: [String], required: true },
    servicesOffered: { type: [String], required: true },
    staff: {
      doctors: { type: Number, default: 0 },
      nurses: { type: Number, default: 0 },
      supportStaff: { type: Number, default: 0 },
    },
    capacity: {
      totalBeds: { type: Number, default: 0 },
      icuBeds: { type: Number, default: 0 },
      ventilators: { type: Number, default: 0 },
    },
    emergencyContact: { type: String, required: true },
    website: { type: String },
    establishedYear: { type: Number },
  },
  { timestamps: true }
);

export const Hospital = model<IHospital>("Hospital", HospitalSchema);
