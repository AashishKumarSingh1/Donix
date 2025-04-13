import { model, Schema, Document } from "mongoose";
import { User } from "./userModel";
import { IMedicalProblem } from "./medicalProblemModel";

export interface INotification extends Document {
  sender?: User["_id"];
  receiver?: User["_id"];
  forAll: boolean;
  message: string;
  type: "TransplantUpdate" | "DonorMatch" | "EmergencyAlert" | "General";
  title:string,
  isRead: boolean;
  link:string;
  medicalProblem?: IMedicalProblem["_id"];
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: false },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: false },
    forAll: { type: Boolean, default: false },
    message: { type: String, required: true },
    title:{type:String,required:true},
    type: { 
      type: String, 
      enum: ["TransplantUpdate", "DonorMatch", "EmergencyAlert", "General"], 
      required: true 
    },
    link:{type:String,required:false},
    isRead: { type: Boolean, default: false },
    medicalProblem: { type: Schema.Types.ObjectId, ref: "MedicalProblem", required: false },
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", NotificationSchema);
