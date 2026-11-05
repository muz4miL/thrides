import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";
import crypto from "crypto";
import path from "path";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

async function run() {
  try {
    await client.connect();
    const db = client.db("brandit");

    const newEmail = "admin@thrides.com";
    const newPass = "Thrides2026AdminSecure!";

    await db.collection("admin_users").updateOne(
      { email: newEmail },
      {
        $set: {
          email: newEmail,
          passwordHash: hashPassword(newPass),
          role: "admin",
          failedLoginAttempts: 0,
          lockoutUntil: null,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log("Successfully created/updated admin@thrides.com in admin_users!");

    // Also update site_settings agencyName if it was 'brandit.'
    await db.collection("site_settings").updateMany(
      {},
      {
        $set: {
          agencyName: "Thrides",
          contactEmail: "info@thrides.com",
          updatedAt: new Date(),
        },
      }
    );
    console.log("Successfully updated site_settings to Thrides!");

    const admins = await db.collection("admin_users").find({}).toArray();
    console.log("Current admin emails:", admins.map((a) => a.email));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.close();
  }
}

run();

