import { NextResponse } from "next/server";
import { getCollections } from "@/server/db";
import { sendEnquiryNotification } from "@/server/email";
import type { SubmissionDoc } from "@/server/types";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.data || body;

    if (!data.fullName || typeof data.fullName !== "string" || data.fullName.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Please enter your full name" }, { status: 400 });
    }
    if (!data.email || typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ success: false, error: "Please provide a valid email address" }, { status: 400 });
    }
    if (!data.vacancySlug) {
      return NextResponse.json({ success: false, error: "Please select a valid open vacancy" }, { status: 400 });
    }
    if (data._hp && typeof data._hp === "string" && data._hp.trim().length > 0) {
      return NextResponse.json({ success: false, error: "Spam detected" }, { status: 400 });
    }

    const { vacancies, submissions } = await getCollections();

    let vacancyTitle = "General Application";
    const vacancy = await vacancies.findOne({
      slug: data.vacancySlug,
      isOpen: true,
      isArchived: false,
    });

    if (vacancy) {
      vacancyTitle = vacancy.jobTitle;
    }

    // Save private CV file if provided
    let cvStorageKey = "";
    if (data.cvData && typeof data.cvData === "string") {
      try {
        const privateDir = path.resolve(process.cwd(), "uploads", "private", "cv");
        await fs.mkdir(privateDir, { recursive: true });
        const safeName = (data.cvOriginalFilename || "resume.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
        const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const filePath = path.join(privateDir, uniqueKey);

        const buffer = Buffer.from(data.cvData.replace(/^data:[^;]+;base64,/, ""), "base64");
        await fs.writeFile(filePath, buffer);
        cvStorageKey = uniqueKey;
      } catch (err) {
        console.error("Failed to store private CV file:", err);
      }
    }

    const record: SubmissionDoc = {
      type: "career",
      data: {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        vacancyId: data.vacancySlug,
        vacancyTitle,
        candidateLocation: data.candidateLocation?.trim() || "",
        portfolioUrl: data.portfolioUrl?.trim() || "",
        cvStorageKey,
        cvOriginalFilename: data.cvOriginalFilename || "resume.pdf",
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    const result = await submissions.insertOne(record);

    sendEnquiryNotification({
      subject: `New Job Application: ${record.data.fullName} for ${vacancyTitle}`,
      type: "career",
      data: {
        fullName: record.data.fullName,
        email: record.data.email,
        vacancy: vacancyTitle,
        location: record.data.candidateLocation,
        portfolio: record.data.portfolioUrl,
      },
    }).then(async (res) => {
      try {
        if (res.success) {
          await submissions.updateOne(
            { _id: result.insertedId },
            { $set: { emailNotificationSent: true } },
          );
        } else {
          await submissions.updateOne(
            { _id: result.insertedId },
            { $set: { emailNotificationError: res.error || "Email delivery failed" } },
          );
        }
      } catch (e) {
        console.error("Failed to update notification status:", e);
      }
    });

    return NextResponse.json({
      success: true,
      submissionId: result.insertedId.toString(),
      message: "Application submitted successfully. Our talent team will review your profile.",
    });
  } catch (err: unknown) {
    console.error("Career application submission error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit application. Please try again.",
      },
      { status: 500 },
    );
  }
}
