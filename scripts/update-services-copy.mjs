import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

async function run() {
  try {
    await client.connect();
    const db = client.db("brandit");

    // 1. Update Process Steps (How it works)
    await db.collection("sp_process_steps").deleteMany({});
    await db.collection("sp_process_steps").insertMany([
      {
        stepNumber: "01",
        timeLabel: "DAY 1",
        title: "Free strategy call",
        desc: "30 minutes. We audit your marketing. Zero obligation.",
        sortOrder: 0,
        visible: true,
      },
      {
        stepNumber: "02",
        timeLabel: "DAY 3",
        title: "Your plan",
        desc: "One clear plan. Only the moves that matter.",
        sortOrder: 1,
        visible: true,
      },
      {
        stepNumber: "03",
        timeLabel: "WEEK 2",
        title: "We build",
        desc: "Dates locked. Kickoff done. We ship.",
        sortOrder: 2,
        visible: true,
      },
    ]);
    console.log("Updated sp_process_steps successfully");

    // 2. Update Checklist Items (Client Onboarding left panel)
    await db.collection("sp_checklist_items").deleteMany({});
    await db.collection("sp_checklist_items").insertMany([
      {
        title: "A plan behind every move",
        desc: "Everything ties to your goals.",
        sortOrder: 0,
        visible: true,
      },
      {
        title: "Strategy backed by data",
        desc: "We research before we create.",
        sortOrder: 1,
        visible: true,
      },
      {
        title: "Plain-language reporting",
        desc: "You always know what's working.",
        sortOrder: 2,
        visible: true,
      },
    ]);
    console.log("Updated sp_checklist_items successfully");

    // 3. Update Timeline Steps (Client Onboarding right panel)
    await db.collection("sp_timeline_steps").deleteMany({});
    await db.collection("sp_timeline_steps").insertMany([
      {
        dayLabel: "Day 1",
        title: "Welcome",
        desc: "A named contact from hour one.",
        sortOrder: 0,
        visible: true,
      },
      {
        dayLabel: "Day 2",
        title: "First 48 Hours",
        desc: "30 minutes. One action plan.",
        sortOrder: 1,
        visible: true,
      },
      {
        dayLabel: "Day 5",
        title: "Kickoff Call",
        desc: "Goals, timeline, deliverables. Locked.",
        sortOrder: 2,
        visible: true,
      },
      {
        dayLabel: "Day 14",
        title: "Live Delivery",
        desc: "Track progress in real time.",
        sortOrder: 3,
        visible: true,
      },
    ]);
    console.log("Updated sp_timeline_steps successfully");

    console.log("ALL SERVICES COPY UPDATED IN MONGODB ATLAS!");
  } catch (err) {
    console.error("Error updating MongoDB copy:", err);
  } finally {
    await client.close();
  }
}

run();

