"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

const mongoUri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "evertrade";

let cachedClient = null;

async function getDb() {
  if (cachedClient) {
    return cachedClient.db(dbName);
  }
  const client = await MongoClient.connect(mongoUri);
  cachedClient = client;
  return client.db(dbName);
}

export async function completeOnboarding(userId, data) {
  if (!userId) return { success: false, message: "Unauthorized" };

  try {
    const db = await getDb();
    const updateData = {
      role: data.role,
      phone: data.phone,
      location: data.location,
      onboarded: true,
      updatedAt: new Date()
    };

    let queryId = userId;
    try {
      if (typeof userId === 'string' && userId.length === 24) {
        queryId = new ObjectId(userId);
      }
    } catch (e) {
      // Ignore invalid object id errors
    }



    const result = await db.collection("user").updateOne(
      { $or: [{ _id: userId }, { _id: queryId }] },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: `User not found. ID passed: ${userId}` };
    }

    // Revalidate paths to ensure fresh data
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { success: false, message: error.message };
  }
}
