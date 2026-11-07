import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  variant?: "white" | "black" | "dark";
}

export function Wordmark({ className = "", variant = "white" }: WordmarkProps) {
  const isDarkVariant = variant === "black" || variant === "dark";
  const logoSrc = isDarkVariant ? "/thrideLogo-dark.png" : "/thrideLogo.png";

  return (
    <div className="relative inline-flex items-center group">
      {/* Subtle ambient sapphire bloom behind the logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-full bg-[#0055F6]/15 blur-lg opacity-60 group-hover:opacity-100 group-hover:bg-[#0055F6]/30 transition-all duration-300"
      />
      <img
        src={logoSrc}
        alt="Thrides"
        className={cn(
          "relative h-8 w-auto object-contain select-none shrink-0 logo-bloom",
          className
        )}
        loading="eager"
      />
    </div>
  );
}

