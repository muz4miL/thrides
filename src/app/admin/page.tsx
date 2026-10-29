import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/server/auth";
import { getCollections } from "@/server/db";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Thrides — Admin Management Console",
  robots: {
    index: false,
    follow: false,
  },
};

const COOKIE_NAME = "brandit_admin_session";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = verifySessionToken(token);
  if (!session) {
    redirect("/admin/login");
  }

  let initialData: any = {
    services: [],
    portfolio: [],
    caseStudies: [],
    vacancies: [],
    submissions: [],
    siteSettings: null,
    faqs: [],
    testimonials: [],
  };

  try {
    const {
      services,
      portfolio,
      caseStudies,
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
      allVacancies,
      allSubmissions,
      settingsDoc,
      allFaqs,
      allTestimonials,
    ] = await Promise.all([
      services.find({}).sort({ order: 1 }).toArray(),
      portfolio.find({}).sort({ order: 1 }).toArray(),
      caseStudies.find({}).sort({ updatedAt: -1 }).toArray(),
      vacancies.find({}).sort({ createdAt: -1 }).toArray(),
      submissions.find({}).sort({ submittedAt: -1 }).limit(100).toArray(),
      siteSettings.findOne({ agencyName: "brandit." }),
      faqs.find({}).sort({ order: 1 }).toArray(),
      testimonials.find({}).sort({ order: 1 }).toArray(),
    ]);

    const { getAdminWorkData } = await import("@/server/work-service");
    const workData = await getAdminWorkData();

    initialData = {
      services: allServices.map((s) => ({ ...s, _id: s._id.toString() })),
      portfolio: allPortfolio.map((p) => ({ ...p, _id: p._id.toString() })),
      caseStudies: allCaseStudies.map((c) => ({ ...c, _id: c._id.toString() })),
      vacancies: allVacancies.map((v) => ({ ...v, _id: v._id.toString() })),
      submissions: allSubmissions.map((s) => ({ ...s, _id: s._id.toString() })),
      siteSettings: settingsDoc ? { ...settingsDoc, _id: settingsDoc._id.toString() } : null,
      faqs: allFaqs.map((f) => ({ ...f, _id: f._id.toString() })),
      testimonials: allTestimonials.map((t) => ({ ...t, _id: t._id.toString() })),
      workProjects: workData.projects,
      workPageSettings: workData.settings,
    };
  } catch (err) {
    console.error("Admin dashboard data fetch error:", err);
    try {
      const { getAdminWorkData } = await import("@/server/work-service");
      const workData = await getAdminWorkData();
      initialData.workProjects = workData.projects;
      initialData.workPageSettings = workData.settings;
    } catch (fallbackErr) {
      console.warn("Could not load fallback admin work data:", fallbackErr);
    }
  }

  return (
    <AdminDashboard
      initialData={initialData}
      user={{ id: session.userId, email: session.email, role: session.role }}
    />
  );
}
