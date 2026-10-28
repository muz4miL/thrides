import { NextResponse } from "next/server";
import { getCollections } from "@/server/db";
import { sendEnquiryNotification } from "@/server/email";
import type { SubmissionDoc } from "@/server/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = body.data || body;

    if (!data.fullName || typeof data.fullName !== "string" || data.fullName.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Please provide your full name" }, { status: 400 });
    }

    if (!data.email || typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ success: false, error: "Please provide a valid email address" }, { status: 400 });
    }

    // Spam honeypot
    if (data._hp && typeof data._hp === "string" && data._hp.trim().length > 0) {
      return NextResponse.json({ success: false, error: "Spam detected" }, { status: 400 });
    }

    const { submissions } = await getCollections();

    const record: SubmissionDoc = {
      type: "contact",
      data: {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phoneWhatsApp: data.phoneWhatsApp?.trim() || "",
        company: data.company?.trim() || "",
        packageInterest: data.packageInterest?.trim() || "",
        serviceOfInterest: data.serviceOfInterest?.trim() || "",
        budgetRange: data.budgetRange?.trim() || "",
        message: data.message?.trim() || "",
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    const result = await submissions.insertOne(record);

    // Trigger email notification asynchronously
    sendEnquiryNotification({
      subject: `New Discovery Call Enquiry: ${record.data.fullName}`,
      type: "contact",
      data: record.data,
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
    });
  } catch (err: unknown) {
    console.error("Contact enquiry submission error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your request at this time. Please try again later.",
      },
      { status: 500 },
    );
  }
}
