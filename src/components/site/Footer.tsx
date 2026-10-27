import { useState, type FormEvent } from "react";
import { Wordmark } from "./Wordmark";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { siteMeta } from "@/content/site";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <footer
      aria-label="Site footer"
      className="relative w-full overflow-hidden bg-[#000000] text-white pt-20 pb-6 sm:pb-8 select-none border-t border-white/[0.08]"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Top Logo & Statement */}
        <div className="mb-14 sm:mb-16 max-w-xl">
          <a href="/" aria-label="Thrides home" className="inline-block mb-5">
            <Wordmark className="h-10 sm:h-12 w-auto" />
          </a>
          <p className="text-[17px] sm:text-[18px] text-[#A1A1AA] leading-relaxed">
            Thrides is a high-growth digital creative and performance agency that specializes in
            creative performance, brand identity, and scalable ad campaigns built to convert.
          </p>
        </div>

        {/* 3-Column Defiant-Style Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Column 1: Primary Navigation (Big Bold Typography) */}
          <div className="md:col-span-3 flex flex-col gap-3.5 sm:gap-4">
            <a
              href="/"
              className="font-display text-2xl sm:text-[28px] font-extrabold text-white hover:text-[#F3FF00] transition-colors tracking-tight"
            >
              Home
            </a>
            <a
              href="/about"
              className="font-display text-2xl sm:text-[28px] font-extrabold text-white hover:text-[#F3FF00] transition-colors tracking-tight"
            >
              About Us
            </a>
            <a
              href="/our-work"
              className="font-display text-2xl sm:text-[28px] font-extrabold text-white hover:text-[#F3FF00] transition-colors tracking-tight"
            >
              Case Studies
            </a>
            <a
              href="/careers"
              className="font-display text-2xl sm:text-[28px] font-extrabold text-white hover:text-[#F3FF00] transition-colors tracking-tight"
            >
              Careers
            </a>
            <a
              href="/studio"
              className="font-display text-2xl sm:text-[28px] font-extrabold text-white hover:text-[#F3FF00] transition-colors tracking-tight"
            >
              Studio
            </a>
            <a
              href="/contact"
              className="font-display text-2xl sm:text-[28px] font-extrabold text-white hover:text-[#F3FF00] transition-colors tracking-tight"
            >
              Contact
            </a>
          </div>

          {/* Column 2: Services with Serif Heading and Subtle Divider Lines */}
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="font-serif italic text-2xl sm:text-[28px] font-normal text-white mb-5 tracking-tight">
              Services
            </h4>
            <ul className="flex flex-col divide-y divide-white/[0.08] text-[15px] sm:text-[16px]">
              <li>
                <a
                  href="/services#creative-performance"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  Performance Creative
                </a>
              </li>
              <li>
                <a
                  href="/services#paid-social"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  Meta & Instagram Ads
                </a>
              </li>
              <li>
                <a
                  href="/services#paid-search"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  Google & YouTube Ads
                </a>
              </li>
              <li>
                <a
                  href="/services#creative-performance"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  TikTok & Vertical Video
                </a>
              </li>
              <li>
                <a
                  href="/services#conversion-websites"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  CRO & Landing Pages
                </a>
              </li>
              <li>
                <a
                  href="/services#brand-content"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  Email & SMS Marketing
                </a>
              </li>
              <li>
                <a
                  href="/services#conversion-websites"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  Web Design & Development
                </a>
              </li>
              <li>
                <a
                  href="/services#brand-identity"
                  className="block py-2.5 text-[#A1A1AA] hover:text-[#F3FF00] transition-colors"
                >
                  Branding & Visual Direction
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: The Defiant "Now it's time to scale" Newsletter & Community Card */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-[24px] bg-[#0E0E12] border border-white/[0.12] p-7 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Now it&apos;s time to scale.
                </h3>
                {/* 3 carousel indicators like Defiant */}
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                </div>
              </div>

              <p className="mt-1 text-[14px] text-[#A1A1AA]">
                Join our free community & receive weekly growth strategies.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-xl border border-white/10 bg-[#17171F] px-4 py-3.5 text-[14px] text-white placeholder-[#71717A] focus:outline-none focus:border-[#F3FF00] transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-[14px] font-bold text-black transition-all hover:bg-[#F3FF00] hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Joined!</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-3 text-[12px] text-[#71717A]">
                No spam. We respect your privacy.
              </p>
            </div>

            {/* Direct Contact Links */}
            <div className="flex flex-col gap-2.5 text-[14px] text-[#A1A1AA] pt-2">
              <a
                href={`mailto:${siteMeta.contact.email}`}
                className="inline-flex items-center gap-2 hover:text-[#F3FF00] transition-colors"
              >
                <Mail size={15} className="text-[#F3FF00]" />
                <span>{siteMeta.contact.email}</span>
              </a>

              <a
                href={`tel:${siteMeta.contact.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 hover:text-[#F3FF00] transition-colors"
              >
                <Phone size={15} className="text-[#F3FF00]" />
                <span>{siteMeta.contact.phoneDisplay}</span>
              </a>

              <div className="inline-flex items-start gap-2 text-[#71717A] text-[13px] mt-1">
                <MapPin size={15} className="text-[#F3FF00] shrink-0 mt-0.5" />
                <span>{siteMeta.contact.office}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright Row */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#71717A]">
          <p>© {new Date().getFullYear()} Thrides Ventures Pty Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              Terms & Conditions
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              Earnings Disclaimer
            </a>
          </div>
        </div>

        {/* ========================================================
            THE ICONIC DEFIANT WATERMARK (GIANT GHOST WORDMARK)
           ======================================================== */}
        <div className="mt-12 sm:mt-16 w-full overflow-hidden select-none pointer-events-none text-center">
          <span className="block font-display font-black tracking-[-0.06em] text-[clamp(72px,17vw,250px)] leading-[0.76] text-[#0D0D11] uppercase select-none">
            thrides.
          </span>
        </div>
      </div>
    </footer>
  );
}
