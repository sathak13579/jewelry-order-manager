import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "../../../lib/auth";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists. Please use the existing account.",
      });
    }

    // Create admin with default credentials
    const email = "admin@example.com";
    const password = "Admin@123";
    const passwordHash = await hashPassword(password);

    const admin = await User.create({
      email,
      passwordHash,
      role: "admin",
    });

    return res.status(200).json({
      success: true,
      message: `Admin created successfully! Email: ${email}, Password: ${password}`,
      data: { email, password },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
}
