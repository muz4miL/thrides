import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

async function dedupeCollection(db, colName, keyField) {
  const col = db.collection(colName);
  const docs = await col.find({}).sort({ _id: 1 }).toArray();
  const seen = new Set();
  const toDelete = [];

  for (const doc of docs) {
    const key = doc[keyField];
    if (seen.has(key)) {
      toDelete.push(doc._id);
    } else {
      seen.add(key);
    }
  }

  if (toDelete.length > 0) {
    const res = await col.deleteMany({ _id: { $in: toDelete } });
    console.log(`Deleted ${res.deletedCount} duplicates from ${colName}`);
  } else {
    console.log(`No duplicates found in ${colName}`);
  }
}

async function run() {
  try {
    await client.connect();
    const db = client.db("brandit");

    await dedupeCollection(db, "sp_faqs", "question");
    await dedupeCollection(db, "sp_comparison_rows", "feature");
    await dedupeCollection(db, "sp_process_steps", "stepNumber");
    await dedupeCollection(db, "sp_checklist_items", "title");
    await dedupeCollection(db, "sp_timeline_steps", "dayLabel");

    console.log("\n--- Final Counts ---");
    for (const col of [
      "sp_settings",
      "sp_hero",
      "sp_packages",
      "sp_comparison_rows",
      "sp_process_steps",
      "sp_checklist_items",
      "sp_timeline_steps",
      "sp_core_services",
      "sp_faqs",
    ]) {
      const count = await db.collection(col).countDocuments({});
      console.log(col, ":", count);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();

