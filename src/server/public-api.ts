import { createServerFn } from "@tanstack/react-start";
import { getCollections } from "./db";
import { sendEnquiryNotification } from "./email";
import type { SubmissionDoc } from "./types";

export const getSiteContentFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
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
      siteSettings.findOne({ agencyName: { $in: ["Thrides", "brandit."] } }),
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
    console.error("Public content load error (using fallback):", err);
    return null;
  }
});

// 1. General Contact Form Submission
export const submitContactEnquiryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as Record<string, string>;
    if (!d.fullName || d.fullName.trim().length < 2) {
      throw new Error("Please provide your full name");
    }
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      throw new Error("Please provide a valid email address");
    }
    // Spam honeypot
    if (d._hp && d._hp.trim().length > 0) {
      throw new Error("Spam detected");
    }
    return {
      fullName: d.fullName.trim(),
      email: d.email.trim(),
      phoneWhatsApp: d.phoneWhatsApp?.trim() || "",
      company: d.company?.trim() || "",
      serviceOfInterest: d.serviceOfInterest?.trim() || "",
      message: d.message?.trim() || "",
    };
  })
  .handler(async ({ data }) => {
    const { submissions } = await getCollections();

    const record: SubmissionDoc = {
      type: "contact",
      data: {
        fullName: data.fullName,
        email: data.email,
        phoneWhatsApp: data.phoneWhatsApp,
        company: data.company,
        serviceOfInterest: data.serviceOfInterest,
        message: data.message,
      },
      status: "new",
      emailNotificationSent: false,
      submittedAt: new Date(),
    };

    const result = await submissions.insertOne(record);

    // Trigger email notification asynchronously
    sendEnquiryNotification({
      subject: `New Discovery Call Enquiry: ${data.fullName}`,
      type: "contact",
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

    return { success: true, submissionId: result.insertedId.toString() };
  });

// 2. Studio Rental Enquiry Submission
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

// 3. Careers Job Application Submission
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
      cvData: d.cvData || "", // base64 payload to be stored safely in private storage
    };
  })
  .handler(async ({ data }) => {
    const { vacancies, submissions } = await getCollections();

    // Recheck vacancy status server-side at submission time
    const vacancy = await vacancies.findOne({
      slug: data.vacancySlug,
      isOpen: true,
      isArchived: false,
    });

    if (!vacancy) {
      throw new Error(
        "This vacancy is no longer accepting applications or has been closed.",
      );
    }

    // Save private CV file reference
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

// 4. Get Single Case Study by Slug
export const getCaseStudyBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: unknown) => {
    if (typeof slug !== "string" || !slug) throw new Error("Invalid slug");
    return slug;
  })
  .handler(async ({ data: slug }) => {
    try {
      const { caseStudies } = await getCollections();
      const doc = await caseStudies.findOne({ slug, isPublished: true }, { projection: { _id: 0 } });
      return doc || null;
    } catch (err) {
      console.error("Error loading case study by slug:", err);
      return null;
    }
  });

