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
    if (!data.phoneWhatsApp || typeof data.phoneWhatsApp !== "string" || data.phoneWhatsApp.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Please provide your phone / WhatsApp number" }, { status: 400 });
    }
    if (data._hp && typeof data._hp === "string" && data._hp.trim().length > 0) {
      return NextResponse.json({ success: false, error: "Spam detected" }, { status: 400 });
    }

    const { submissions } = await getCollections();

    const record: SubmissionDoc = {
      type: "studio",
      data: {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phoneWhatsApp: data.phoneWhatsApp.trim(),
        shootType: data.shootType?.trim() || "Commercial Video",
        preferredDate: data.preferredDate?.trim() || "",
        duration: data.duration?.trim() || "",
        equipmentRequirements: data.equipmentRequirements?.trim() || "",
        message: data.message?.trim() || "",
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    const result = await submissions.insertOne(record);

    sendEnquiryNotification({
      subject: `New Studio Rental Enquiry: ${record.data.fullName} (${record.data.shootType})`,
      type: "studio",
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
      message:
        "Thank you. Your studio enquiry has been received. Our team will contact you shortly to confirm availability and arrangements.",
    });
  } catch (err: unknown) {
    console.error("Studio enquiry submission error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit enquiry. Please check your details and try again.",
      },
      { status: 500 },
    );
  }
}
