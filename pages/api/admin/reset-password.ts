import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Client from "../../../models/Client";
import { withAdminAuth, hashPassword } from "../../../lib/auth";

type Data = {
  success: boolean;
  message?: string;
};

const handler = async (
  req: NextApiRequest & { user?: any },
  res: NextApiResponse<Data>
) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { clientId, newPassword } = req.body;

    if (!clientId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Client ID and new password are required",
      });
    }

    // Find the client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update client's password
    await Client.findByIdAndUpdate(clientId, { passwordHash });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password",
    });
  }
};

export default withAdminAuth(handler);
