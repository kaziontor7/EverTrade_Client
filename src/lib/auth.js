import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/evertrade_dummy";
const client = new MongoClient(mongoUri);
const db = client.db(process.env.MONGODB_DB || "evertrade");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "dummy_secret_key_for_build_purposes_only",
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
        defaultValue: "buyer", // buyer | seller | admin
      },
      phone: {
        type: "string",
        defaultValue: "",
      },
      location: {
        type: "string",
        defaultValue: "",
      },
      status: {
        type: "string",
        defaultValue: "active", // active | suspended
      },
      isVerified: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  plugins: [
    admin()
  ]
});
