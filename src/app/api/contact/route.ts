import { NextResponse } from "next/server";
import { getCollections } from "@/server/db";
import { sendEnquiryNotification } from "@/server/email";
import type { SubmissionDoc } from "@/server/types";

// In-memory rate limiting map for basic abuse prevention
const rateLimitMap = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.data || body;

    // 1. Spam Honeypot Protection
    if (data._hp && typeof data._hp === "string" && data._hp.trim().length > 0) {
      return NextResponse.json({ success: false, error: "Spam detected." }, { status: 400 });
    }

    // 2. Name validation
    if (
      !data.fullName ||
      typeof data.fullName !== "string" ||
      data.fullName.trim().length < 2 ||
      data.fullName.trim().length > 120
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide your name (at least 2 characters)." },
        { status: 400 },
      );
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !data.email ||
      typeof data.email !== "string" ||
      !emailRegex.test(data.email.trim()) ||
      data.email.trim().length > 150
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const cleanEmail = data.email.trim().toLowerCase();

    // 4. Rate Limiting Check (max 1 submission per 10 seconds per email)
    const now = Date.now();
    const lastSubmissionTime = rateLimitMap.get(cleanEmail);
    if (lastSubmissionTime && now - lastSubmissionTime < 10000) {
      return NextResponse.json(
        {
          success: false,
          error: "Your enquiry was already received. Please wait a moment before sending another message.",
        },
        { status: 429 },
      );
    }

    // 5. Services extraction and validation
    let servicesList: string[] = [];
    if (Array.isArray(data.services)) {
      servicesList = data.services
        .filter((s: unknown) => typeof s === "string" && s.trim().length > 0)
        .slice(0, 10);
    } else if (typeof data.serviceOfInterest === "string" && data.serviceOfInterest.trim()) {
      servicesList = [data.serviceOfInterest.trim()];
    }

    // 6. Optional URL normalization and safety
    let cleanWebsiteUrl = "";
    if (data.websiteUrl && typeof data.websiteUrl === "string") {
      let rawUrl = data.websiteUrl.trim();
      if (rawUrl.length > 0) {
        if (!/^https?:\/\//i.test(rawUrl)) {
          rawUrl = `https://${rawUrl}`;
        }
        try {
          const parsed = new URL(rawUrl);
          cleanWebsiteUrl = parsed.toString().slice(0, 200);
        } catch {
          // Keep raw string if it's a handle or domain
          cleanWebsiteUrl = data.websiteUrl.trim().slice(0, 200);
        }
      }
    }

    // 7. Brief length limit (max 3000 chars)
    const cleanBrief =
      typeof data.message === "string" ? data.message.trim().slice(0, 3000) : "";

    const { submissions } = await getCollections();

    // 8. Idempotency Check
    const idempotencyKey = typeof data.idempotencyKey === "string" ? data.idempotencyKey.trim() : null;
    if (idempotencyKey) {
      const existing = await submissions.findOne({ idempotencyKey });
      if (existing) {
        return NextResponse.json({
          success: true,
          submissionId: existing._id.toString(),
          message: "Enquiry already processed.",
        });
      }
    }

    // 9. Construct Clean Submission Record
    const record: SubmissionDoc = {
      type: "contact",
      data: {
        fullName: data.fullName.trim().slice(0, 120),
        email: cleanEmail,
        phoneWhatsApp: typeof data.phoneWhatsApp === "string" ? data.phoneWhatsApp.trim().slice(0, 40) : "",
        company: typeof data.company === "string" ? data.company.trim().slice(0, 150) : "",
        services: servicesList,
        serviceOfInterest: servicesList.length > 0 ? servicesList.join(", ") : "Not sure yet",
        packageInterest: typeof data.packageInterest === "string" ? data.packageInterest.trim().slice(0, 100) : "",
        budgetRange: typeof data.budgetRange === "string" ? data.budgetRange.trim().slice(0, 80) : "",
        timeline: typeof data.timeline === "string" ? data.timeline.trim().slice(0, 80) : "",
        websiteUrl: cleanWebsiteUrl,
        sourcePage: typeof data.sourcePage === "string" ? data.sourcePage.trim().slice(0, 100) : "/contact",
        message: cleanBrief,
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
      idempotencyKey: idempotencyKey || undefined,
    };

    const result = await submissions.insertOne(record);
    rateLimitMap.set(cleanEmail, now);

    // Clean rate limit map occasionally
    if (rateLimitMap.size > 200) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now - v > 60000) rateLimitMap.delete(k);
      }
    }

    // 10. Asynchronously dispatch email notification
    sendEnquiryNotification({
      subject: `New Discovery Call Enquiry: ${record.data.fullName}`,
      type: "contact",
      data: record.data,
    })
      .then(async (res) => {
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
      })
      .catch((e) => {
        console.error("Non-fatal email notification error:", e);
      });

    return NextResponse.json({
      success: true,
      submissionId: result.insertedId.toString(),
    });
  } catch (err: unknown) {
    console.error("Contact enquiry submission error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your enquiry at this time. Please try again or reach out directly.",
      },
      { status: 500 },
    );
  }
}
