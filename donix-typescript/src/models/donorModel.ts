import { Schema, model, Document } from "mongoose";
import { User } from "./userModel";
import { IHospital } from "./hospitalModel";

export interface IDonor extends Document {
  user: User["_id"];
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  HLACompatibility?: string;
  organsAvailable: ("Heart" | "Kidney" | "Liver" | "Lungs" | "Pancreas" | "Cornea")[];
  isLivingDonor: boolean;
  consentSigned: {
    status: boolean;
    dateSigned?: Date;
  };
  hospitalRegisteredAt?: IHospital["_id"];
  donationType: "Full-Body" | "Specific Organs";
  medicalHistory?: string;
  contactDetails?: {
    emergencyContactName: string;
    emergencyContactNumber: string;
  };
  status: "Available" | "Pending" | "Unavailable";
  createdAt: Date;
}

const DonorSchema = new Schema<IDonor>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: true },
    HLACompatibility: { type: String },
    organsAvailable: {
      type: [String],
      enum: ["Heart", "Kidney", "Liver", "Lungs", "Pancreas", "Cornea"],
      required: true,
    },
    isLivingDonor: { type: Boolean, default: false },
    consentSigned: {
      status: { type: Boolean, required: true },
      dateSigned: { type: Date },
    },
    hospitalRegisteredAt: { type: Schema.Types.ObjectId, ref: "Hospital" },
    donationType: { type: String, enum: ["Full-Body", "Specific Organs"], required: true },
    medicalHistory: { type: String },
    contactDetails: {
      emergencyContactName: { type: String },
      emergencyContactNumber: { type: String },
    },
    status: { type: String, enum: ["Available", "Pending", "Unavailable"], default: "Pending" },
  },
  { timestamps: true }
);

export const Donor = model<IDonor>("Donor", DonorSchema);
