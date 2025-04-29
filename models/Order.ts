import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customerName: string;
  orderType: "new" | "repair";
  itemType: string;
  quotedPrice: number;
  goldWeightGrams: number;
  orderDate: Date;
  deliveryDate: Date;
  notes: string;
  status: "pending" | "in_progress" | "completed" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    orderType: {
      type: String,
      required: true,
      enum: ["new", "repair"],
    },
    itemType: { type: String, required: true },
    quotedPrice: { type: Number, required: true },
    goldWeightGrams: { type: Number, required: false },
    orderDate: { type: Date, required: true, default: Date.now },
    deliveryDate: { type: Date, required: true },
    notes: { type: String, required: false },
    status: {
      type: String,
      required: true,
      enum: ["pending", "in_progress", "completed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
