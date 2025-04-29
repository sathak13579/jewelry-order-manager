import mongoose, { Connection, Schema } from "mongoose";
import { IOrder } from "../models/Order";

// Cache of registered models per connection
const registeredModels: Record<string, boolean> = {};

// Create models for a specific client DB connection
export function getClientModels(connection: Connection) {
  const dbName = connection.name;

  // Only register models once per connection to prevent duplicate model errors
  if (!registeredModels[dbName]) {
    // Order model for client-specific database
    const OrderSchema = new Schema(
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
          enum: [
            "pending",
            "in_progress",
            "completed",
            "delivered",
            "cancelled",
          ],
          default: "pending",
        },
      },
      {
        timestamps: true,
      }
    );

    // Register the models on this connection if they haven't been registered
    if (!connection.models.Order) {
      connection.model<IOrder>("Order", OrderSchema);
    }

    // Mark models as registered for this connection
    registeredModels[dbName] = true;
  }

  return {
    Order: connection.models.Order,
  };
}
