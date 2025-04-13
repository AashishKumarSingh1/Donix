import { Schema, model,models, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: "SuperAdmin" | "Donor" | "Recipient" | "Hospital" | "NGO" | "GovtOfficial";
  phone: string;
  address?: string;
  blockchainAddress: string;
  createdAt: Date;
  isVerified:boolean;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["SuperAdmin", "Donor", "Recipient", "Hospital", "NGO", "GovtOfficial"], required: true },
  phone: { type: String, required: true },
  address: { type: String },
  blockchainAddress: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User = models.User || model("User", UserSchema);
