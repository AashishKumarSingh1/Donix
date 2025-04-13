import { model, Schema, Document } from "mongoose";
import { User } from "./userModel";

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ISection {
  title: string;
  content: string;
}

export interface ITestimonial {
  user: string;
  feedback: string;
  rating: number;
}

export interface IButton {
  text: string;
  link: string;
}

export interface IPortal extends Document {
  title: string;
  content: string;
  type: "FAQ" | "Awareness" | "Guidelines";
  category?: string;
  author: User["_id"];
  views: number;
  attachments?: string[];
  isPublished: boolean;
  mainImage?: string;
  slideshowImages?: string[];
  faqs?: IFAQ[];
  sections?: ISection[];
  testimonials?: ITestimonial[];
  buttons?: IButton[];
}

const PortalSchema = new Schema<IPortal>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["FAQ", "Awareness", "Guidelines"], required: true },
    category: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    attachments: { type: [String] },
    isPublished: { type: Boolean, default: false },
    mainImage: { type: String },
    slideshowImages: { type: [String] },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    sections: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    testimonials: [
      {
        user: { type: String, required: true },
        feedback: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
      },
    ],
    buttons: [
      {
        text: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Portal = model<IPortal>("Portal", PortalSchema);
