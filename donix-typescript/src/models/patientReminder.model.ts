import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientReminder extends Document {
    patient: string;
    doctor: string;
    dateTime: Date;
    type: string;
    notes?: string;
    reminderSettings: {
        defaultReminderTime: string;
    };
    notificationMethods: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
    };
    hospitalRef: string;
    isScheduled: boolean;
}

const PatientReminderSchema: Schema = new Schema({
    patient: { type: String, required: true },
    doctor: { type: String, required: true },
    dateTime: { type: Date, required: true },
    type: { type: String, required: true },
    notes: { type: String },
    reminderSettings: {
        defaultReminderTime: { type: String, default: "15 minutes before" },
    },
    notificationMethods: {
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: false },
        inApp: { type: Boolean, default: true },
    },
    hospitalRef: { type: String, required: true },
    isScheduled: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IPatientReminder>('PatientReminder', PatientReminderSchema);
