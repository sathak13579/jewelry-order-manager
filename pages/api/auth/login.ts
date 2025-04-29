import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import Client from "../../../models/Client";
import { comparePasswords, generateClientToken } from "../../../lib/auth";

type Data = {
  success: boolean;
  token?: string;
  client?: {
    id: string;
    businessName: string;
    email: string;
  };
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find the client
    const client = await Client.findOne({ email, active: true });

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or inactive account",
      });
    }

    // Verify password
    const isPasswordValid = await comparePasswords(
      password,
      client.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateClientToken(client);

    // Return success with token and basic client info
    return res.status(200).json({
      success: true,
      token,
      client: {
        id: client._id,
        businessName: client.businessName,
        email: client.email,
      },
    });
  } catch (error) {
    console.error("Client login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
}
