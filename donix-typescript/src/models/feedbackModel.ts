import { model,Schema,Document } from "mongoose";
import { User } from "./userModel";
export interface IFeedback extends Document {
    user: User["_id"];
    message: string;
    rating: number;
    createdAt: Date;
  }
  
  const FeedbackSchema = new Schema<IFeedback>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  });
  
  export const Feedback = model<IFeedback>("Feedback", FeedbackSchema);
  