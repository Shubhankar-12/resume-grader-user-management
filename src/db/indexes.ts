import mongoose from "mongoose";
import { makeLogger } from "../logger/Config";

const logger = makeLogger({});

export async function ensureIndexes(): Promise<void> {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    await db.collection("users").createIndex({ email: 1 }, { unique: true, background: true });
    await db.collection("users").createIndex({ "githubProfile.id": 1 }, { sparse: true, background: true });
    await db.collection("user_resumes").createIndex({ user_id: 1, createdAt: -1 }, { background: true });
    await db.collection("user_resumes").createIndex({ status: 1 }, { background: true });
    await db.collection("cover_letters").createIndex({ user_id: 1, createdAt: -1 }, { background: true });
    await db.collection("payment_subscriptions").createIndex({ user_id: 1, status: 1 }, { background: true });
    await db.collection("extracted_resumes").createIndex({ resume_id: 1 }, { background: true });
    await db.collection("reports").createIndex({ resume_id: 1 }, { background: true });
    await db.collection("tailored_resumes").createIndex({ user_id: 1, resume_id: 1 }, { background: true });

    logger.info("MongoDB indexes ensured");
  } catch (err) {
    logger.error("Failed to create indexes", err);
  }
}
