import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";
import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs/promises";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function POST(req: Request) {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, data } = body;
    const collections = await getCollections();

    switch (action) {
      case "saveService": {
        const { _id, ...fields } = data;
        fields.updatedAt = new Date();
        if (_id && ObjectId.isValid(_id)) {
          await collections.services.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
          return NextResponse.json({ success: true, id: _id });
        } else {
          fields.createdAt = new Date();
          const res = await collections.services.insertOne(fields as any);
          return NextResponse.json({ success: true, id: res.insertedId.toString() });
        }
      }
      case "deleteService": {
        if (!ObjectId.isValid(data.id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        await collections.services.deleteOne({ _id: new ObjectId(data.id) });
        return NextResponse.json({ success: true });
      }
      case "savePortfolio": {
        const { _id, ...fields } = data;
        if (_id && ObjectId.isValid(_id)) {
          await collections.portfolio.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
          return NextResponse.json({ success: true, id: _id });
        } else {
          fields.createdAt = new Date();
          const res = await collections.portfolio.insertOne(fields as any);
          return NextResponse.json({ success: true, id: res.insertedId.toString() });
        }
      }
      case "deletePortfolio": {
        if (!ObjectId.isValid(data.id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        await collections.portfolio.deleteOne({ _id: new ObjectId(data.id) });
        return NextResponse.json({ success: true });
      }
      case "saveCaseStudy": {
        const { _id, ...fields } = data;
        fields.updatedAt = new Date();
        if (_id && ObjectId.isValid(_id)) {
          await collections.caseStudies.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
          return NextResponse.json({ success: true, id: _id });
        } else {
          const res = await collections.caseStudies.insertOne(fields as any);
          return NextResponse.json({ success: true, id: res.insertedId.toString() });
        }
      }
      case "deleteCaseStudy": {
        if (!ObjectId.isValid(data.id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        await collections.caseStudies.deleteOne({ _id: new ObjectId(data.id) });
        return NextResponse.json({ success: true });
      }
      case "saveStudioEquipment": {
        const { _id, ...fields } = data;
        if (_id && ObjectId.isValid(_id)) {
          await collections.studioEquipment.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
          return NextResponse.json({ success: true, id: _id });
        } else {
          const res = await collections.studioEquipment.insertOne(fields as any);
          return NextResponse.json({ success: true, id: res.insertedId.toString() });
        }
      }
      case "deleteStudioEquipment": {
        if (!ObjectId.isValid(data.id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        await collections.studioEquipment.deleteOne({ _id: new ObjectId(data.id) });
        return NextResponse.json({ success: true });
      }
      case "saveVacancy": {
        const { _id, ...fields } = data;
        fields.updatedAt = new Date();
        if (_id && ObjectId.isValid(_id)) {
          await collections.vacancies.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
          return NextResponse.json({ success: true, id: _id });
        } else {
          fields.createdAt = new Date();
          const res = await collections.vacancies.insertOne(fields as any);
          return NextResponse.json({ success: true, id: res.insertedId.toString() });
        }
      }
      case "deleteVacancy": {
        if (!ObjectId.isValid(data.id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        await collections.vacancies.deleteOne({ _id: new ObjectId(data.id) });
        return NextResponse.json({ success: true });
      }
      case "updateSubmissionStatus": {
        if (!ObjectId.isValid(data.id)) return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
        await collections.submissions.updateOne(
          { _id: new ObjectId(data.id) },
          { $set: { status: data.status } },
        );
        return NextResponse.json({ success: true });
      }
      case "updateSiteSettings": {
        const { _id, ...fields } = data;
        fields.updatedAt = new Date();
        await collections.siteSettings.updateOne({ agencyName: "brandit." }, { $set: fields }, { upsert: true });
        return NextResponse.json({ success: true });
      }
      case "downloadCv": {
        if (!data.cvStorageKey || typeof data.cvStorageKey !== "string") {
          return NextResponse.json({ success: false, error: "Invalid CV key" }, { status: 400 });
        }
        const safeKey = data.cvStorageKey.replace(/[^a-zA-Z0-9._-]/g, "");
        const filePath = path.resolve(process.cwd(), "uploads", "private", "cv", safeKey);
        try {
          const fileBuffer = await fs.readFile(filePath);
          return NextResponse.json({
            success: true,
            dataBase64: fileBuffer.toString("base64"),
            filename: safeKey,
          });
        } catch {
          return NextResponse.json({ success: false, error: "CV file not found on disk" }, { status: 404 });
        }
      }
      case "saveWorkProject": {
        const { saveAdminWorkProject } = await import("@/server/work-service");
        const res = await saveAdminWorkProject(data);
        return NextResponse.json(res);
      }
      case "deleteWorkProject": {
        const { deleteAdminWorkProject } = await import("@/server/work-service");
        const res = await deleteAdminWorkProject(data.id);
        return NextResponse.json({ success: res });
      }
      case "duplicateWorkProject": {
        const { getWorkProjectBySlug, saveAdminWorkProject } = await import("@/server/work-service");
        const original = await getWorkProjectBySlug(data.slug, true);
        if (!original) {
          return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
        }
        const copySlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
        const { _id, ...rest } = original;
        const copyProject = {
          ...rest,
          slug: copySlug,
          title: `${original.title} (Draft Copy)`,
          isPublished: false,
          isDraft: true,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const res = await saveAdminWorkProject(copyProject);
        return NextResponse.json({ success: true, id: res.id, slug: copySlug });
      }
      case "saveWorkPageSettings": {
        const { saveAdminWorkPageSettings } = await import("@/server/work-service");
        const res = await saveAdminWorkPageSettings(data);
        return NextResponse.json({ success: res });
      }
      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    console.error("Admin action error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
