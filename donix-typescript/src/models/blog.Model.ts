import { model, Schema, Document } from "mongoose";
import { User } from "./userModel";
export interface IBlog extends Document {
    creator?: User["_id"];
    title: string;
    HeroImage?: string;
    contentwithImages: {
        content: string;
        images?: string;
        link?: string;
    }[];
    createdAt?: Date;
}
const BlogSchema = new Schema<IBlog>(
    {
        creator: { type: Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true },
        HeroImage: { type: String },
        contentwithImages: [
            {
                content: { type: String, required: true },
                images: { type: String,default:"" },
                link: { type: String,default:"" },
            },
        ],
    },
    { timestamps: true }
);
export const Blog = model<IBlog>("Blog", BlogSchema);
