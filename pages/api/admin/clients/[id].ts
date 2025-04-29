import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb";
import Client from "../../../../models/Client";
import { withAdminAuth, hashPassword } from "../../../../lib/auth";

type Data = {
  success: boolean;
  data?: any;
  message?: string;
};

const handler = async (
  req: NextApiRequest & { user?: any },
  res: NextApiResponse<Data>
) => {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const client = await Client.findById(id).select("-passwordHash");
        if (!client) {
          return res
            .status(404)
            .json({ success: false, message: "Client not found" });
        }
        res.status(200).json({ success: true, data: client });
      } catch (error) {
        console.error("Error fetching client:", error);
        res
          .status(500)
          .json({ success: false, message: "Error fetching client" });
      }
      break;

    case "PUT":
      try {
        const { businessName, email, password, active } = req.body;

        // Build update object
        const updateData: any = {};
        if (businessName) updateData.businessName = businessName;
        if (email) updateData.email = email;
        if (password) updateData.passwordHash = await hashPassword(password);
        if (active !== undefined) updateData.active = active;

        // Update the client
        const client = await Client.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }).select("-passwordHash");

        if (!client) {
          return res
            .status(404)
            .json({ success: false, message: "Client not found" });
        }

        res.status(200).json({ success: true, data: client });
      } catch (error) {
        console.error("Error updating client:", error);
        res
          .status(500)
          .json({ success: false, message: "Error updating client" });
      }
      break;

    case "DELETE":
      try {
        // Note: In a production system, you might want to:
        // 1. Archive the client record instead of deletion
        // 2. Handle cleanup of the client's database (or at least mark it for cleanup)

        const deletedClient = await Client.findByIdAndDelete(id);

        if (!deletedClient) {
          return res
            .status(404)
            .json({ success: false, message: "Client not found" });
        }

        res
          .status(200)
          .json({ success: true, message: "Client deleted successfully" });
      } catch (error) {
        console.error("Error deleting client:", error);
        res
          .status(500)
          .json({ success: false, message: "Error deleting client" });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
};

export default withAdminAuth(handler);
