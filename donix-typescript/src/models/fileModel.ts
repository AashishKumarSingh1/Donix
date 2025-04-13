import { model, Schema, Document } from "mongoose";

export interface IFile extends Document {
    filename: string;
    filepath: string;
    mimetype: string;
    size: number;
    uploadedAt: Date;
}

const FileSchema = new Schema<IFile>(
    {
        filename: { type: String, required: true },
        filepath: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const File = model<IFile>("File", FileSchema);
