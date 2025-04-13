import { Schema,model,Document } from "mongoose";
import { User } from "./userModel";
export interface IChat extends Document {
    sender: User["_id"];
    receiver: User["_id"];
    message: string;
    timestamp: Date;
    isRead: boolean;
  }
  
  const ChatSchema = new Schema<IChat>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  });
  
  export const Chat = model<IChat>("Chat", ChatSchema);
  