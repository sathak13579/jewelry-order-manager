import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb";
import Client from "../../../../models/Client";
import { withAdminAuth, hashPassword } from "../../../../lib/auth";
import { connectToClientDb } from "../../../../lib/mongodb";
import { nanoid } from "nanoid";

type Data = {
  success: boolean;
  data?: any;
  message?: string;
};

const handler = async (
  req: NextApiRequest & { user?: any },
  res: NextApiResponse<Data>
) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Get all clients
        const clients = await Client.find({})
          .select("-passwordHash")
          .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: clients });
      } catch (error) {
        console.error("Error fetching clients:", error);
        res
          .status(500)
          .json({ success: false, message: "Error fetching clients" });
      }
      break;

    case "POST":
      try {
        const { businessName, email, password } = req.body;

        // Validate inputs
        if (!businessName || !email || !password) {
          return res.status(400).json({
            success: false,
            message: "Business name, email, and password are required",
          });
        }

        // Check if email already exists
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
          return res.status(400).json({
            success: false,
            message: "A client with this email already exists",
          });
        }

        // Generate a unique database name for this client
        const dbNameId = nanoid(10);
        const dbName = `jewelry_client_${dbNameId}`;

        // Hash the password
        const passwordHash = await hashPassword(password);

        // Create the client in the admin database
        const client = await Client.create({
          businessName,
          email,
          passwordHash,
          dbName,
          active: true,
        });

        // Initialize the client's database by connecting to it
        try {
          const clientDb = await connectToClientDb(dbName);
          // No need to create models as they'll be created on first use

          // Return success with client info (excluding password)
          const clientData = {
            _id: client._id,
            businessName: client.businessName,
            email: client.email,
            dbName: client.dbName,
            active: client.active,
            createdAt: client.createdAt,
          };

          return res.status(201).json({ success: true, data: clientData });
        } catch (dbError) {
          // If client DB creation fails, delete the client record
          await Client.findByIdAndDelete(client._id);
          console.error("Error creating client database:", dbError);
          return res.status(500).json({
            success: false,
            message: "Failed to create client database",
          });
        }
      } catch (error) {
        console.error("Error creating client:", error);
        return res.status(500).json({
          success: false,
          message: "An error occurred while creating the client",
        });
      }
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
      break;
  }
};

export default withAdminAuth(handler);
