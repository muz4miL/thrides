import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";

const COOKIE_NAME = "brandit_admin_session";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET() {
  try {
    const session = await verifyAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      siteSettings.findOne({ agencyName: "brandit." }),
      faqs.find({}).sort({ order: 1 }).toArray(),
      testimonials.find({}).sort({ order: 1 }).toArray(),
    ]);

    const { getAdminWorkData } = await import("@/server/work-service");
    const workData = await getAdminWorkData();

    return NextResponse.json({
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
      workProjects: workData.projects,
      workPageSettings: workData.settings,
    });
  } catch (err: unknown) {
    console.error("Admin dashboard fetch error:", err);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
