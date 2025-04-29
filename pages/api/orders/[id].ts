import type { NextApiRequest, NextApiResponse } from "next";
import { connectToClientDb } from "../../../lib/mongodb";
import { getClientModels } from "../../../lib/clientModels";
import { withClientAuth, AuthHandler } from "../../../lib/auth";

type Data = {
  success: boolean;
  data?: any;
  message?: string;
};

const handler: AuthHandler = async (
  req: NextApiRequest & { user?: any },
  res: NextApiResponse<Data>
) => {
  const {
    query: { id },
    method,
  } = req;
  const user = req.user!; // The middleware ensures this exists

  try {
    // Connect to the client-specific database
    const clientDb = await connectToClientDb(user.dbName);

    // Get models for this client
    const { Order } = getClientModels(clientDb);

    switch (method) {
      case "GET":
        try {
          const order = await Order.findById(id);
          if (!order) {
            return res.status(404).json({ success: false });
          }
          res.status(200).json({ success: true, data: order });
        } catch (error) {
          console.error("Error fetching order:", error);
          res.status(400).json({ success: false });
        }
        break;

      case "PUT":
        try {
          const order = await Order.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!order) {
            return res.status(404).json({ success: false });
          }
          res.status(200).json({ success: true, data: order });
        } catch (error) {
          console.error("Error updating order:", error);
          res.status(400).json({ success: false });
        }
        break;

      case "DELETE":
        try {
          const deletedOrder = await Order.deleteOne({ _id: id });
          if (!deletedOrder) {
            return res.status(404).json({ success: false });
          }
          res.status(200).json({ success: true, data: {} });
        } catch (error) {
          console.error("Error deleting order:", error);
          res.status(400).json({ success: false });
        }
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res
      .status(500)
      .json({ success: false, message: "Database connection error" });
  }
};

export default withClientAuth(handler);
