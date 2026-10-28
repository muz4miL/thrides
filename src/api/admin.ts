// Client-side API functions for admin portal (Next.js migrated)

export async function adminLoginFn({ data }: { data: { email: string; password: string } }) {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Login failed");
  return json;
}

export async function adminLogoutFn() {
  const res = await fetch("/api/admin/auth/logout", { method: "POST" });
  return res.json();
}

export async function adminCheckSessionFn() {
  const res = await fetch("/api/admin/auth/session");
  return res.json();
}

export async function adminGetDashboardDataFn() {
  const res = await fetch("/api/admin/dashboard");
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return res.json();
}

async function callAdminAction(action: string, data: any) {
  const res = await fetch("/api/admin/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || `Failed to perform ${action}`);
  return json;
}

export const adminSaveServiceFn = ({ data }: { data: any }) => callAdminAction("saveService", data);
export const adminDeleteServiceFn = ({ data }: { data: { id: string } }) => callAdminAction("deleteService", data);
export const adminSavePortfolioFn = ({ data }: { data: any }) => callAdminAction("savePortfolio", data);
export const adminDeletePortfolioFn = ({ data }: { data: { id: string } }) => callAdminAction("deletePortfolio", data);
export const adminSaveCaseStudyFn = ({ data }: { data: any }) => callAdminAction("saveCaseStudy", data);
export const adminDeleteCaseStudyFn = ({ data }: { data: { id: string } }) => callAdminAction("deleteCaseStudy", data);
export const adminSaveStudioEquipmentFn = ({ data }: { data: any }) => callAdminAction("saveStudioEquipment", data);
export const adminDeleteStudioEquipmentFn = ({ data }: { data: { id: string } }) => callAdminAction("deleteStudioEquipment", data);
export const adminSaveVacancyFn = ({ data }: { data: any }) => callAdminAction("saveVacancy", data);
export const adminDeleteVacancyFn = ({ data }: { data: { id: string } }) => callAdminAction("deleteVacancy", data);
export const adminUpdateSubmissionStatusFn = ({ data }: { data: { id: string; status: any } }) => callAdminAction("updateSubmissionStatus", data);
export const adminUpdateSiteSettingsFn = ({ data }: { data: any }) => callAdminAction("updateSiteSettings", data);
export const adminDownloadCvFn = ({ data }: { data: { cvStorageKey: string } }) => callAdminAction("downloadCv", data);
