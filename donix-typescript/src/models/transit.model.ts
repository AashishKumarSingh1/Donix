import mongoose, { Schema, Document } from 'mongoose';

export interface ITransit extends Document {
    organId: string;
    currentLocation: string;
    destinationHospitalId: string;
    isTransit: boolean;
    preservationAsFinal: boolean;
    delayed: boolean;
    justToMove: boolean;
    path: string[];
    timestamps: {
        createdAt: Date;
        updatedAt: Date;
    };
}

const TransitSchema: Schema = new Schema(
    {
        organId: { type: String, required: true },
        currentLocation: { type: String, required: true },
        destinationHospitalId: { type: String, required: true },
        isTransit: { type: Boolean, default: false },
        preservationAsFinal: { type: Boolean, default: false },
        delayed: { type: Boolean, default: false },
        justToMove: { type: Boolean, default: false },
        path: { type: [String], default: [] },
    },
    { timestamps: true }
);

export const Transit = mongoose.model<ITransit>('Transit', TransitSchema);
