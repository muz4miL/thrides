import { createServerFn } from "@tanstack/react-start";
import type { SubmissionDoc } from "@/server/types";

export const getSiteContentFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getCollections } = await import("@/server/db");
    const {
      siteSettings,
      services,
      portfolio,
      faqs,
      testimonials,
      studioCategories,
      studioEquipment,
      vacancies,
      caseStudies,
    } = await getCollections();

    const [
      settingsDoc,
      servicesDocs,
      portfolioDocs,
      faqDocs,
      testimonialDocs,
      categoryDocs,
      equipmentDocs,
      vacancyDocs,
      caseStudyDocs,
    ] = await Promise.all([
      siteSettings.findOne({ agencyName: "brandit." }),
      services
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
      portfolio
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
      faqs
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
      testimonials
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
      studioCategories
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
      studioEquipment
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ order: 1 })
        .toArray(),
      vacancies
        .find({ isOpen: true, isArchived: false }, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .toArray(),
      caseStudies
        .find({ isPublished: true }, { projection: { _id: 0 } })
        .sort({ publishedAt: -1 })
        .toArray(),
    ]);

    return {
      settings: settingsDoc
        ? {
            agencyName: settingsDoc.agencyName,
            tagline: settingsDoc.tagline,
            contactEmail: settingsDoc.contactEmail,
            phoneWhatsApp: settingsDoc.phoneWhatsApp,
            whatsappLink: settingsDoc.whatsappLink,
            socialLinks: settingsDoc.socialLinks,
            globalSeo: settingsDoc.globalSeo,
          }
        : null,
      services: servicesDocs,
      portfolio: portfolioDocs,
      faqs: faqDocs,
      testimonials: testimonialDocs,
      studioCategories: categoryDocs,
      studioEquipment: equipmentDocs,
      vacancies: vacancyDocs,
      caseStudies: caseStudyDocs,
    };
  } catch (err) {
    console.error("Public content load error:", err);
    return null;
  }
});

const submissionDebounceMap = new Map<string, number>();

export const submitContactEnquiryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as Record<string, string>;
    if (!d.fullName || d.fullName.trim().length < 2) {
      throw new Error("Please provide your full name");
    }
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error("Please provide a valid email address");
    }
    if (!d.phoneWhatsApp || d.phoneWhatsApp.trim().length < 5) {
      throw new Error("Please provide your phone or WhatsApp number");
    }
    if (d._hp && d._hp.trim().length > 0) {
      throw new Error("Spam detected");
    }
    return {
      fullName: d.fullName.trim(),
      email: d.email.trim(),
      phoneWhatsApp: d.phoneWhatsApp.trim(),
      company: d.company?.trim() || "",
      packageInterest: d.packageInterest?.trim() || "",
      serviceOfInterest: d.serviceOfInterest?.trim() || "",
      budgetRange: d.budgetRange?.trim() || "",
      message: d.message?.trim() || "",
    };
  })
  .handler(async ({ data }) => {
    // 1. Double submission debounce check (15 seconds window)
    const debounceKey = `${data.email.toLowerCase()}:${data.phoneWhatsApp}`;
    const lastSubmitTime = submissionDebounceMap.get(debounceKey);
    const now = Date.now();

    if (lastSubmitTime && now - lastSubmitTime < 15000) {
      throw new Error(
        "Your enquiry was already submitted moments ago. Our team reviews every message personally and will reply within 24 hours.",
      );
    }
    submissionDebounceMap.set(debounceKey, now);

    // Clean up stale debounce keys
    if (submissionDebounceMap.size > 200) {
      for (const [k, time] of submissionDebounceMap.entries()) {
        if (now - time > 60000) submissionDebounceMap.delete(k);
      }
    }

    const record: SubmissionDoc = {
      type: "contact",
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneWhatsApp: data.phoneWhatsApp,
        company: data.company,
        packageInterest: data.packageInterest,
        serviceOfInterest: data.serviceOfInterest,
        budgetRange: data.budgetRange,
        message: data.message,
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    let result;
    try {
      const { getCollections } = await import("@/server/db");
      const { submissions } = await getCollections();
      result = await submissions.insertOne(record);
    } catch (dbErr: any) {
      console.error("[Database Storage Error]", dbErr?.message || dbErr);
      throw new Error(
        "We are temporarily unable to record your enquiry to the database due to a server connection issue. Please contact us directly via WhatsApp at +92 337 3252840 or email info@thrides.com.",
      );
    }

    // Attempt background email notification (isolated from DB storage success)
    try {
      const { sendEnquiryNotification } = await import("@/server/email");
      sendEnquiryNotification({
        subject: `New Discovery Call Enquiry: ${data.fullName}`,
        type: "contact",
        data,
      }).then(async (res) => {
        try {
          const { getCollections } = await import("@/server/db");
          const { submissions } = await getCollections();
          if (res.success) {
            await submissions.updateOne(
              { _id: result.insertedId },
              { $set: { emailNotificationSent: true } },
            );
          } else {
            await submissions.updateOne(
              { _id: result.insertedId },
              { $set: { emailNotificationError: res.error } },
            );
          }
        } catch {
          // Non-fatal background email status update
        }
      });
    } catch {
      // Email delivery error does not fail the database write record
    }

    return { success: true, submissionId: result.insertedId.toString() };
  });

export const submitStudioEnquiryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as Record<string, string>;
    if (!d.fullName || d.fullName.trim().length < 2) {
      throw new Error("Please provide your full name");
    }
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error("Please provide a valid email address");
    }
    if (!d.phoneWhatsApp || d.phoneWhatsApp.trim().length < 5) {
      throw new Error("Please provide your phone / WhatsApp number");
    }
    if (d._hp && d._hp.trim().length > 0) {
      throw new Error("Spam detected");
    }
    return {
      fullName: d.fullName.trim(),
      email: d.email.trim(),
      phoneWhatsApp: d.phoneWhatsApp.trim(),
      shootType: d.shootType?.trim() || "Commercial",
      preferredDate: d.preferredDate?.trim() || "",
      duration: d.duration?.trim() || "",
      equipmentRequirements: d.equipmentRequirements?.trim() || "",
      message: d.message?.trim() || "",
    };
  })
  .handler(async ({ data }) => {
    const { getCollections } = await import("@/server/db");
    const { sendEnquiryNotification } = await import("@/server/email");
    const { submissions } = await getCollections();

    const record: SubmissionDoc = {
      type: "studio",
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneWhatsApp: data.phoneWhatsApp,
        shootType: data.shootType,
        preferredDate: data.preferredDate,
        duration: data.duration,
        equipmentRequirements: data.equipmentRequirements,
        message: data.message,
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    const result = await submissions.insertOne(record);

    sendEnquiryNotification({
      subject: `New Studio Rental Enquiry: ${data.fullName} (${data.shootType})`,
      type: "studio",
      data,
    }).then(async (res) => {
      if (res.success) {
        await submissions.updateOne(
          { _id: result.insertedId },
          { $set: { emailNotificationSent: true } },
        );
      } else {
        await submissions.updateOne(
          { _id: result.insertedId },
          { $set: { emailNotificationError: res.error } },
        );
      }
    });

    return {
      success: true,
      submissionId: result.insertedId.toString(),
      message:
        "Thank you. Your studio enquiry has been received. Our team will contact you shortly to confirm availability and arrangements.",
    };
  });

export const submitCareerApplicationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as Record<string, string>;
    if (!d.fullName || d.fullName.trim().length < 2) {
      throw new Error("Please enter your full name");
    }
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error("Please provide a valid email address");
    }
    if (!d.vacancySlug) {
      throw new Error("Please select a valid open vacancy");
    }
    if (d._hp && d._hp.trim().length > 0) {
      throw new Error("Spam detected");
    }
    return {
      fullName: d.fullName.trim(),
      email: d.email.trim(),
      vacancySlug: d.vacancySlug.trim(),
      candidateLocation: d.candidateLocation?.trim() || "",
      portfolioUrl: d.portfolioUrl?.trim() || "",
      cvOriginalFilename: d.cvOriginalFilename?.trim() || "resume.pdf",
      cvData: d.cvData || "",
    };
  })
  .handler(async ({ data }) => {
    const { getCollections } = await import("@/server/db");
    const { sendEnquiryNotification } = await import("@/server/email");
    const { vacancies, submissions } = await getCollections();

    const vacancy = await vacancies.findOne({
      slug: data.vacancySlug,
      isOpen: true,
      isArchived: false,
    });

    if (!vacancy) {
      throw new Error("This vacancy is no longer accepting applications or has been closed.");
    }

    let cvStorageKey = "";
    if (data.cvData) {
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const privateDir = path.resolve(process.cwd(), "uploads", "private", "cv");
        await fs.mkdir(privateDir, { recursive: true });
        const uniqueKey = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${data.cvOriginalFilename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const filePath = path.join(privateDir, uniqueKey);

        const buffer = Buffer.from(data.cvData.replace(/^data:[^;]+;base64,/, ""), "base64");
        await fs.writeFile(filePath, buffer);
        cvStorageKey = uniqueKey;
      } catch (err) {
        console.error("Failed to store private CV file:", err);
      }
    }

    const record: SubmissionDoc = {
      type: "career",
      data: {
        fullName: data.fullName,
        email: data.email,
        vacancyId: vacancy.slug,
        vacancyTitle: vacancy.jobTitle,
        candidateLocation: data.candidateLocation,
        portfolioUrl: data.portfolioUrl,
        cvStorageKey,
        cvOriginalFilename: data.cvOriginalFilename,
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    const result = await submissions.insertOne(record);

    sendEnquiryNotification({
      subject: `New Job Application: ${data.fullName} for ${vacancy.jobTitle}`,
      type: "career",
      data: {
        fullName: data.fullName,
        email: data.email,
        vacancy: vacancy.jobTitle,
        location: data.candidateLocation,
        portfolio: data.portfolioUrl,
      },
    }).then(async (res) => {
      if (res.success) {
        await submissions.updateOne(
          { _id: result.insertedId },
          { $set: { emailNotificationSent: true } },
        );
      } else {
        await submissions.updateOne(
          { _id: result.insertedId },
          { $set: { emailNotificationError: res.error } },
        );
      }
    });

    return {
      success: true,
      submissionId: result.insertedId.toString(),
      message: "Application submitted successfully. Our talent team will review your profile.",
    };
  });

export const getCaseStudyBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: unknown) => {
    if (typeof slug !== "string" || !slug) throw new Error("Invalid slug");
    return slug;
  })
  .handler(async ({ data: slug }) => {
    try {
      const { getCollections } = await import("@/server/db");
      const { caseStudies } = await getCollections();
      const doc = await caseStudies.findOne(
        { slug, isPublished: true },
        { projection: { _id: 0 } },
      );
      return doc || null;
    } catch (err) {
      console.error("Error loading case study by slug:", err);
      return null;
    }
  });
