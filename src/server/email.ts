import nodemailer from "nodemailer";

export interface NotificationPayload {
  subject: string;
  type: "contact" | "studio" | "career";
  data: Record<string, unknown>;
}

export async function sendEnquiryNotification(payload: NotificationPayload): Promise<{
  success: boolean;
  error?: string;
}> {
  const recipient = process.env.ENQUIRY_NOTIFICATION_EMAIL || "info@thrides.com";
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(
      `[Email Notification Info] Notification recorded for ${recipient} (Type: ${payload.type}):`,
      JSON.stringify(payload.data, null, 2),
    );
    return {
      success: false,
      error: "SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS in server environment)",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const lines = Object.entries(payload.data)
      .map(([k, v]) => `<strong>${k}:</strong> ${String(v)}`)
      .join("<br/>");

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Thrides Notifications" <no-reply@thrides.com>`,
      to: recipient,
      subject: payload.subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h2 style="margin-top: 0; color: #111;">New Submission Received: ${payload.type.toUpperCase()}</h2>
          <div style="line-height: 1.6; color: #333;">
            ${lines}
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #888;">
            Sent automatically by Thrides website enquiry router.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Email Notification Error]", errorMsg);
    return { success: false, error: errorMsg };
  }
}
