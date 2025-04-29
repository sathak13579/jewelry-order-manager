import { NextApiRequest, NextApiResponse } from "next";
import { sign, verify } from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import { IUser } from "../models/User";
import { IClient } from "../models/Client";

// JWT secret key - should be in .env
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define token types
export type AdminTokenPayload = {
  id: string;
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
};

export type ClientTokenPayload = {
  id: string;
  email: string;
  businessName: string;
  dbName: string;
  role: "client";
  iat?: number;
  exp?: number;
};

export type TokenPayload = AdminTokenPayload | ClientTokenPayload;

// Generate JWT token for admin
export function generateAdminToken(user: IUser): string {
  const payload: AdminTokenPayload = {
    id: String(user._id),
    email: user.email,
    role: "admin",
  };

  return sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// Generate JWT token for client
export function generateClientToken(client: IClient): string {
  const payload: ClientTokenPayload = {
    id: String(client._id),
    email: client.email,
    businessName: client.businessName,
    dbName: client.dbName,
    role: "client",
  };

  return sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

// Compare password with hash
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Auth middleware types
export type AuthHandler = (
  req: NextApiRequest & { user?: TokenPayload },
  res: NextApiResponse
) => Promise<void>;

export type AuthMiddleware = (
  handler: AuthHandler
) => (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

// Middleware to protect routes that require admin access
export const withAdminAuth: AuthMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing" });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Add user to request object
    (req as any).user = decoded;

    // Call the API handler
    return handler(req as any, res);
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid authentication" });
  }
};

// Middleware to protect routes that require client access
export const withClientAuth: AuthMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing" });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "client") {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Add user to request object
    (req as any).user = decoded;

    // Call the API handler
    return handler(req as any, res);
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid authentication" });
  }
};
