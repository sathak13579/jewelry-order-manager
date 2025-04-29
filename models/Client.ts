import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  businessName: string;
  email: string;
  passwordHash: string;
  dbName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema(
  {
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    dbName: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Client ||
  mongoose.model<IClient>("Client", ClientSchema);
