import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import ServicesPage from "@/app/services/page";
import OurWorkPage from "@/app/our-work/page";
import CaseStudiesPage from "@/app/case-studies/page";
import StudioPage from "@/app/studio/page";
import CareersPage from "@/app/careers/page";
import ContactPage from "@/app/contact/page";
import AdminLoginPage from "@/app/admin/login/page";
import NotFoundPage from "@/app/not-found";

describe("Next.js App Router Routes", () => {
  const routesToTest = [
    { name: "Homepage", path: "/", component: HomePage },
    { name: "About", path: "/about", component: AboutPage },
    { name: "Services", path: "/services", component: ServicesPage },
    { name: "Our Work", path: "/our-work", component: OurWorkPage },
    { name: "Case Studies", path: "/case-studies", component: CaseStudiesPage },
    { name: "Studio", path: "/studio", component: StudioPage },
    { name: "Careers", path: "/careers", component: CareersPage },
    { name: "Contact", path: "/contact", component: ContactPage },
    { name: "Admin Login", path: "/admin/login", component: AdminLoginPage },
    { name: "Not Found", path: "/not-found", component: NotFoundPage },
  ];

  routesToTest.forEach(({ name, path, component }) => {
    it(`exports a valid React component for ${name} (${path})`, () => {
      expect(component).toBeDefined();
      expect(typeof component).toBe("function");
    });
  });
});
