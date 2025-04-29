import type { NextApiRequest, NextApiResponse } from "next";
import { connectToClientDb } from "../../../lib/mongodb";
import { getClientModels } from "../../../lib/clientModels";
import { withClientAuth, AuthHandler } from "../../../lib/auth";

type Data = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

const handler: AuthHandler = async (
  req: NextApiRequest & { user?: any },
  res: NextApiResponse<Data>
) => {
  const { method } = req;
  const user = req.user!; // The middleware ensures this exists

  try {
    // Connect to the client-specific database
    const clientDb = await connectToClientDb(user.dbName);

    // Get models for this client
    const { Order } = getClientModels(clientDb);

    switch (method) {
      case "GET":
        try {
          const orders = await Order.find({}).sort({ createdAt: -1 });
          res.status(200).json({ success: true, data: orders });
        } catch (error) {
          console.error("Error fetching orders:", error);
          res.status(400).json({ success: false });
        }
        break;

      case "POST":
        try {
          const order = await Order.create(req.body);
          res.status(201).json({ success: true, data: order });
        } catch (error: any) {
          console.error("Error creating order:", error);
          res.status(400).json({ success: false, error: error.message });
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
