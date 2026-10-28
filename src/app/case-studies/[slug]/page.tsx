import { redirect } from "next/navigation";
import { getAllPublishedWorkSlugs } from "@/server/work-service";

export async function generateStaticParams() {
  return await getAllPublishedWorkSlugs();
}

export default async function CaseStudyDynamicRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/our-work/${slug}`);
}
