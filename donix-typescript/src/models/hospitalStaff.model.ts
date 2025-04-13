import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalStaff extends Document {
    department: string;
    email: string;
    name: string;
    role: string;
    hospital: mongoose.Types.ObjectId;
}

const HospitalStaffSchema: Schema = new Schema({
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['doctor', 'nurse', 'admin'] },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    assignedRoles: {
        type: [String],
        enum: [
            'Full Patient Data Access',
            'Full Donor Data Access',
            'Access to Sensitive Data',
            'Administrative Function'
        ],
        default: []
    }
});

export default mongoose.model<IHospitalStaff>('HospitalStaff', HospitalStaffSchema);
