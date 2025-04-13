import { model,Schema,Document } from "mongoose";
import { IDonor } from "./donorModel";
import { IOrgan } from "./organModel";
import { IHospital } from "./hospitalModel";
import { IRecipient } from "./recepeintModel";
export interface ITransplant extends Document {
    donor: IDonor["_id"];
    recipient: IRecipient["_id"];
    organ: IOrgan["_id"];
    hospital: IHospital["_id"];
    transplantDate: Date;
    successStatus: boolean;
    postTransplantReport?: string;
    createdAt: Date;
  }
  
  const TransplantSchema = new Schema<ITransplant>({
    donor: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "Recipient", required: true },
    organ: { type: Schema.Types.ObjectId, ref: "Organ", required: true },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    transplantDate: { type: Date, required: true },
    successStatus: { type: Boolean, default: false },
    postTransplantReport: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
  export const Transplant = model<ITransplant>("Transplant", TransplantSchema);
  