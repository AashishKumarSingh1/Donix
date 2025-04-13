import mongoose, { Schema, Document } from 'mongoose';

interface IHospitalStore extends Document {
  hospitalId: string;
  organIds: string[];
}

const HospitalStoreSchema: Schema = new Schema(
  {
    hospitalId: { type: String, required: true, unique: true },
    organIds: { type: [String], required: true },
  },
  { timestamps: true }
);

const HospitalStore = mongoose.model<IHospitalStore>('HospitalStore', HospitalStoreSchema);

export default HospitalStore;
