import { describe, expect, it } from "vitest";
import {
  getPublicWorkPageData,
  getWorkProjectBySlug,
  getAllPublishedWorkSlugs,
} from "@/server/work-service";
import { defaultWorkProjects } from "@/server/default-work-data";

describe("Our Work Portfolio Service", () => {
  it("returns published projects and page settings for /our-work", async () => {
    const { settings, projects } = await getPublicWorkPageData();

    expect(settings).toBeDefined();
    expect(settings.heroHeadingLine1).toBe("Every appearance.");
    expect(settings.heroHeadingLine2).toBe("On purpose.");
    expect(projects.length).toBeGreaterThanOrEqual(4);

    // All public projects must be marked published
    projects.forEach((p) => {
      expect(p.isPublished).toBe(true);
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.clientName).toBeTruthy();
    });
  });

  it("retrieves a published project by slug", async () => {
    const project = await getWorkProjectBySlug("apex-advisory");
    expect(project).toBeDefined();
    expect(project?.clientName).toBe("Apex Strategic Advisory");
    expect(project?.results?.length).toBeGreaterThan(0);
    expect(project?.blocks?.length).toBeGreaterThan(0);
  });

  it("returns null for non-existent slugs", async () => {
    const project = await getWorkProjectBySlug("non-existent-client-slug-xyz");
    expect(project).toBeNull();
  });

  it("returns all published project slugs for static site generation", async () => {
    const slugs = await getAllPublishedWorkSlugs();
    expect(slugs.length).toBeGreaterThanOrEqual(4);
    expect(slugs.map((s) => s.slug)).toContain("apex-advisory");
    expect(slugs.map((s) => s.slug)).toContain("voltex-active");
  });

  it("contains valid modular blocks across default projects", () => {
    defaultWorkProjects.forEach((project) => {
      expect(project.blocks).toBeDefined();
      expect(Array.isArray(project.blocks)).toBe(true);
      project.blocks.forEach((block) => {
        expect(block.id).toBeTruthy();
        expect(block.type).toBeTruthy();
      });
    });
  });
});
