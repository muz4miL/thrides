import crypto from "crypto";
import { getCollections } from "./db";

const JWT_SECRET =
  process.env["JWT_SECRET"] || "brandit_secure_fallback_secret_key_32_characters_minimum";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(":");
    if (!salt || !originalHash) return false;
    const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, "hex"),
      Buffer.from(originalHash, "hex"),
    );
  } catch {
    return false;
  }
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: "admin" | "editor";
  exp: number;
}

export function createSessionToken(userId: string, email: string, role: "admin" | "editor"): string {
  const payload: SessionPayload = {
    userId,
    email,
    role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadEncoded)
    .digest("base64url");
  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadEncoded, signature] = token.split(".");
    if (!payloadEncoded || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(payloadEncoded)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64url").toString("utf-8"),
    ) as SessionPayload;

    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function authenticateCredentials(email: string, password: string) {
  const { adminUsers } = await getCollections();
  const user = await adminUsers.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  // Check lockout
  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (1000 * 60));
    return {
      success: false,
      error: `Account is temporarily locked due to failed attempts. Please try again in ${minutesLeft} minutes.`,
    };
  }

  const isValid = verifyPassword(password, user.passwordHash);

  if (!isValid) {
    const attempts = (user.failedLoginAttempts || 0) + 1;
    const update: Record<string, unknown> = { failedLoginAttempts: attempts };
    if (attempts >= 5) {
      update["lockoutUntil"] = new Date(Date.now() + 15 * 60 * 1000); // 15 min lockout
    }
    await adminUsers.updateOne({ _id: user._id }, { $set: update });
    return { success: false, error: "Invalid email or password" };
  }

  // Reset failed attempts on success
  await adminUsers.updateOne(
    { _id: user._id },
    { $set: { failedLoginAttempts: 0, lastLoginAt: new Date(), lockoutUntil: null } },
  );

  const token = createSessionToken(user._id.toString(), user.email, user.role);
  return {
    success: true,
    token,
    user: { id: user._id.toString(), email: user.email, role: user.role },
  };
}
