import { z } from "zod";
import type { LucideIcon } from "lucide-react";

export const contactFormSchema = z.object({
  services: z.array(z.string()).min(1, "Please select at least one area we can help with."),
  details: z.string().max(1000, "Brief must be under 1000 characters.").optional().default(""),
  fullName: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  company: z.string().trim().optional().default(""),
  preferredTime: z.string().optional().default(""),
  _hp: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ServiceOption {
  id: string;
  label: string;
  icon: LucideIcon;
  feedback: string;
}

export type StepNumber = 1 | 2 | 3 | "success";

