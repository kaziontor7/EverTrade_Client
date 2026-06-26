import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB || "evertrade");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "buyer", // buyer | seller | admin
      },
      phone: {
        type: "string",
        default: "",
      },
      location: {
        type: "string",
        default: "",
      },
      status: {
        type: "string",
        default: "active", // active | suspended
      },
      isVerified: {
        type: "boolean",
        default: false,
      },
    },
  },
  plugins: [
    admin()
  ]
});
