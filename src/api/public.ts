// Client-side API functions for public website (Next.js migrated)

export async function submitContactEnquiryFn({ data }: { data: any }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  return res.json();
}

export async function submitStudioEnquiryFn({ data }: { data: any }) {
  const res = await fetch("/api/studio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  return res.json();
}

export async function submitCareerApplicationFn({ data }: { data: any }) {
  const res = await fetch("/api/careers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  return res.json();
}
