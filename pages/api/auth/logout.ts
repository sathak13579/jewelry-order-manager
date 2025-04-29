import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  message?: string;
};

// In a JWT-based auth system, we don't need to do anything server-side
// The client simply discards the token
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
