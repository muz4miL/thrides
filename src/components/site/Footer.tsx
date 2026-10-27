import { Wordmark } from "./Wordmark";
import { MessageSquare, Mail, Phone, MapPin } from "lucide-react";
import { siteMeta } from "@/content/site";

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="relative w-full overflow-hidden bg-[#09090B] text-white pt-16 pb-12 select-none border-t border-black/10"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          {/* Brand & Closing Line */}
          <div className="md:col-span-6 max-w-[500px]">
            <a href="/" aria-label="Thrides home" className="inline-block text-white">
              <Wordmark className="text-3xl text-white" />
            </a>
            <p className="mt-4 text-[16px] sm:text-[17px] font-medium leading-relaxed text-neutral-300">
              {siteMeta.contact.closingLine}
            </p>
            <p className="mt-2 text-[14px] text-neutral-400">
              {siteMeta.subHeadline}
            </p>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-6 flex flex-col md:items-end gap-3 text-[14px] text-neutral-300">
            <a
              href={`mailto:${siteMeta.contact.email}`}
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail size={16} className="text-blue-400" />
              <span>{siteMeta.contact.email}</span>
            </a>

            <a
              href={`tel:${siteMeta.contact.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone size={16} className="text-blue-400" />
              <span>{siteMeta.contact.phoneDisplay}</span>
            </a>

            <a
              href={`https://wa.me/${siteMeta.contact.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <MessageSquare size={16} className="text-blue-400" />
              <span>WhatsApp: {siteMeta.contact.phoneDisplay}</span>
            </a>

            <div className="inline-flex items-start gap-2 text-neutral-400 max-w-sm md:text-right mt-1">
              <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <span>{siteMeta.contact.office}</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#71717A]">
          <p>© {new Date().getFullYear()} Thrides. All rights reserved.</p>
          <p>{siteMeta.trustBarSummary}</p>
        </div>
      </div>
    </footer>
  );
}
