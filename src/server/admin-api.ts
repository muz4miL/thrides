import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { authenticateCredentials, verifySessionToken, type SessionPayload } from "./auth";
import { getCollections } from "./db";
import { ObjectId } from "mongodb";

const COOKIE_NAME = "brandit_admin_session";

async function requireAdminSession(): Promise<SessionPayload> {
  const token = getCookie(COOKIE_NAME);
  if (!token) {
    throw new Error("Unauthorized: Please log in to access the admin portal.");
  }
  const session = verifySessionToken(token);
  if (!session) {
    throw new Error("Session expired or invalid. Please log in again.");
  }
  return session;
}

// 1. Admin Login
export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { email?: string; password?: string };
    if (!d.email || !d.password) {
      throw new Error("Email and password are required");
    }
    return { email: d.email, password: d.password };
  })
  .handler(async ({ data }) => {
    const authResult = await authenticateCredentials(data.email, data.password);
    if (!authResult.success || !authResult.token) {
      throw new Error(authResult.error || "Authentication failed");
    }

    setCookie(COOKIE_NAME, authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: authResult.user };
  });

// 2. Admin Logout
export const adminLogoutFn = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { success: true };
});

// 3. Admin Check Session
export const adminCheckSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(COOKIE_NAME);
  if (!token) return { isAuthenticated: false, user: null };
  const session = verifySessionToken(token);
  if (!session) return { isAuthenticated: false, user: null };
  return {
    isAuthenticated: true,
    user: { id: session.userId, email: session.email, role: session.role },
  };
});

// 4. Admin Get Full Dashboard Data
export const adminGetDashboardDataFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const {
    services,
    portfolio,
    caseStudies,
    studioCategories,
    studioEquipment,
    vacancies,
    submissions,
    siteSettings,
    faqs,
    testimonials,
  } = await getCollections();

  const [
    allServices,
    allPortfolio,
    allCaseStudies,
    allCategories,
    allEquipment,
    allVacancies,
    allSubmissions,
    settingsDoc,
    allFaqs,
    allTestimonials,
  ] = await Promise.all([
    services.find({}).sort({ order: 1 }).toArray(),
    portfolio.find({}).sort({ order: 1 }).toArray(),
    caseStudies.find({}).sort({ updatedAt: -1 }).toArray(),
    studioCategories.find({}).sort({ order: 1 }).toArray(),
    studioEquipment.find({}).sort({ order: 1 }).toArray(),
    vacancies.find({}).sort({ createdAt: -1 }).toArray(),
    submissions.find({}).sort({ submittedAt: -1 }).limit(100).toArray(),
    siteSettings.findOne({ agencyName: { $in: ["Thrides", "brandit."] } }),
    faqs.find({}).sort({ order: 1 }).toArray(),
    testimonials.find({}).sort({ order: 1 }).toArray(),
  ]);

  return {
    services: allServices.map((s) => ({ ...s, _id: s._id.toString() })),
    portfolio: allPortfolio.map((p) => ({ ...p, _id: p._id.toString() })),
    caseStudies: allCaseStudies.map((c) => ({ ...c, _id: c._id.toString() })),
    studioCategories: allCategories.map((c) => ({ ...c, _id: c._id.toString() })),
    studioEquipment: allEquipment.map((e) => ({ ...e, _id: e._id.toString() })),
    vacancies: allVacancies.map((v) => ({ ...v, _id: v._id.toString() })),
    submissions: allSubmissions.map((s) => ({ ...s, _id: s._id.toString() })),
    siteSettings: settingsDoc ? { ...settingsDoc, _id: settingsDoc._id.toString() } : null,
    faqs: allFaqs.map((f) => ({ ...f, _id: f._id.toString() })),
    testimonials: allTestimonials.map((t) => ({ ...t, _id: t._id.toString() })),
  };
});

// 5. Service Operations
export const adminSaveServiceFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, any>)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { services } = await getCollections();

    const { _id, ...fields } = data;
    fields.updatedAt = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await services.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
      return { success: true, id: _id };
    } else {
      fields.createdAt = new Date();
      const res = await services.insertOne(fields as any);
      return { success: true, id: res.insertedId.toString() };
    }
  });

export const adminDeleteServiceFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { services } = await getCollections();
    if (!ObjectId.isValid(data.id)) throw new Error("Invalid record ID");
    await services.deleteOne({ _id: new ObjectId(data.id) });
    return { success: true };
  });

// 6. Portfolio Operations
export const adminSavePortfolioFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, any>)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { portfolio } = await getCollections();

    const { _id, ...fields } = data;
    if (_id && ObjectId.isValid(_id)) {
      await portfolio.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
      return { success: true, id: _id };
    } else {
      fields.createdAt = new Date();
      const res = await portfolio.insertOne(fields as any);
      return { success: true, id: res.insertedId.toString() };
    }
  });

export const adminDeletePortfolioFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { portfolio } = await getCollections();
    if (!ObjectId.isValid(data.id)) throw new Error("Invalid record ID");
    await portfolio.deleteOne({ _id: new ObjectId(data.id) });
    return { success: true };
  });

// 7. Case Study Operations
export const adminSaveCaseStudyFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, any>)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { caseStudies } = await getCollections();

    const { _id, ...fields } = data;
    fields.updatedAt = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await caseStudies.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
      return { success: true, id: _id };
    } else {
      const res = await caseStudies.insertOne(fields as any);
      return { success: true, id: res.insertedId.toString() };
    }
  });

export const adminDeleteCaseStudyFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { caseStudies } = await getCollections();
    if (!ObjectId.isValid(data.id)) throw new Error("Invalid record ID");
    await caseStudies.deleteOne({ _id: new ObjectId(data.id) });
    return { success: true };
  });

// 8. Studio Gear Operations
export const adminSaveStudioEquipmentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, any>)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { studioEquipment } = await getCollections();

    const { _id, ...fields } = data;
    if (_id && ObjectId.isValid(_id)) {
      await studioEquipment.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
      return { success: true, id: _id };
    } else {
      const res = await studioEquipment.insertOne(fields as any);
      return { success: true, id: res.insertedId.toString() };
    }
  });

export const adminDeleteStudioEquipmentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { studioEquipment } = await getCollections();
    if (!ObjectId.isValid(data.id)) throw new Error("Invalid record ID");
    await studioEquipment.deleteOne({ _id: new ObjectId(data.id) });
    return { success: true };
  });

// 9. Vacancy Operations
export const adminSaveVacancyFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, any>)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { vacancies } = await getCollections();

    const { _id, ...fields } = data;
    fields.updatedAt = new Date();

    if (_id && ObjectId.isValid(_id)) {
      await vacancies.updateOne({ _id: new ObjectId(_id) }, { $set: fields });
      return { success: true, id: _id };
    } else {
      fields.createdAt = new Date();
      const res = await vacancies.insertOne(fields as any);
      return { success: true, id: res.insertedId.toString() };
    }
  });

export const adminDeleteVacancyFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { vacancies } = await getCollections();
    if (!ObjectId.isValid(data.id)) throw new Error("Invalid record ID");
    await vacancies.deleteOne({ _id: new ObjectId(data.id) });
    return { success: true };
  });

// 10. Submissions Status Update
export const adminUpdateSubmissionStatusFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; status: "new" | "in_review" | "contacted" | "archived" })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { submissions } = await getCollections();
    if (!ObjectId.isValid(data.id)) throw new Error("Invalid submission ID");
    await submissions.updateOne(
      { _id: new ObjectId(data.id) },
      { $set: { status: data.status } },
    );
    return { success: true };
  });

// 11. Site Settings Update
export const adminUpdateSiteSettingsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, any>)
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { siteSettings } = await getCollections();
    const { _id, ...fields } = data;
    fields.updatedAt = new Date();

    await siteSettings.updateOne(
      { agencyName: { $in: ["Thrides", "brandit."] } },
      { $set: fields },
      { upsert: true },
    );
    return { success: true };
  });

// 12. Secure CV Download for Admin
export const adminDownloadCvFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { cvStorageKey: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (!data.cvStorageKey || typeof data.cvStorageKey !== "string") {
      throw new Error("Invalid CV key");
    }

    // Path traversal defense
    const safeKey = data.cvStorageKey.replace(/[^a-zA-Z0-9._-]/g, "");
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.resolve(process.cwd(), "uploads", "private", "cv", safeKey);

    try {
      const fileBuffer = await fs.readFile(filePath);
      return {
        success: true,
        dataBase64: fileBuffer.toString("base64"),
        filename: safeKey,
      };
    } catch {
      throw new Error("CV file not found on disk");
    }
  });

