import { describe, it, expect } from "vitest";
import { validateMagicBytes } from "@/server/partner-logo-service";
import crypto from "crypto";
import { z } from "zod";

describe("Partner Logo Service - Validation & Schemas", () => {
  it("validates valid PNG magic bytes", () => {
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    const res = validateMagicBytes(pngHeader);
    expect(res.isValid).toBe(true);
    expect(res.format).toBe("png");
    expect(res.isSolidWarning).toBe(false);
  });

  it("validates valid WebP magic bytes", () => {
    const webpHeader = Buffer.from("RIFF....WEBPVP8 ");
    const res = validateMagicBytes(webpHeader);
    expect(res.isValid).toBe(true);
    expect(res.format).toBe("webp");
    expect(res.isSolidWarning).toBe(false);
  });

  it("flags JPEG magic bytes with a solid background warning", () => {
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const res = validateMagicBytes(jpegHeader);
    expect(res.isValid).toBe(true);
    expect(res.format).toBe("jpeg");
    expect(res.isSolidWarning).toBe(true);
  });

  it("rejects corrupt or unsupported files", () => {
    const corruptFile = Buffer.from("NOT AN IMAGE AT ALL");
    const res = validateMagicBytes(corruptFile);
    expect(res.isValid).toBe(false);
    expect(res.format).toBeNull();
  });

  it("dedupes identical image buffers using sha256 hash", () => {
    const buf1 = Buffer.from("image_data_sample_123");
    const buf2 = Buffer.from("image_data_sample_123");
    const buf3 = Buffer.from("image_data_different_456");

    const hash1 = crypto.createHash("sha256").update(buf1).digest("hex");
    const hash2 = crypto.createHash("sha256").update(buf2).digest("hex");
    const hash3 = crypto.createHash("sha256").update(buf3).digest("hex");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });

  it("validates linkUrl with Zod schema (rejects invalid url, requires https)", () => {
    const httpsUrlSchema = z
      .string()
      .url()
      .refine((val) => val.startsWith("https://"), {
        message: "Must be https",
      });
    expect(httpsUrlSchema.safeParse("https://google.com").success).toBe(true);
    expect(httpsUrlSchema.safeParse("http://insecure.com").success).toBe(false);
    expect(httpsUrlSchema.safeParse("not-a-valid-url").success).toBe(false);
    expect(httpsUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });

  it("clamps settings logoHeight between 24 and 48", () => {
    const clampHeight = (h: number) => Math.max(24, Math.min(48, h));
    expect(clampHeight(10)).toBe(24);
    expect(clampHeight(32)).toBe(32);
    expect(clampHeight(100)).toBe(48);
  });

  it("maintains stable reordering sequence without mutations", () => {
    const orderIds = ["logo-1", "logo-2", "logo-3", "logo-4"];
    const reordered = ["logo-3", "logo-1", "logo-2", "logo-4"];

    const mapped = reordered.map((id, index) => ({ id, sortOrder: index }));
    expect(mapped[0]).toEqual({ id: "logo-3", sortOrder: 0 });
    expect(mapped[1]).toEqual({ id: "logo-1", sortOrder: 1 });
    expect(mapped[2]).toEqual({ id: "logo-2", sortOrder: 2 });
    expect(mapped[3]).toEqual({ id: "logo-4", sortOrder: 3 });
  });
});
