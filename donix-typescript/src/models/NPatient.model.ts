import { Schema, model, Document } from 'mongoose';

interface NPatient extends Document {
  date: Date;
  doctor: string;
  notes: string;
  patient: string;
  type: string;
}

const NPatientSchema = new Schema<NPatient>({
  date: { type: Date, required: true },
  doctor: { type: String, required: true },
  notes: { type: String, required: true },
  patient: { type: String, required: true },
  type: { type: String, required: true },
});

export const NPatientModel = model<NPatient>('NPatient', NPatientSchema);
