import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  variant?: "white" | "black" | "dark";
}

export function Wordmark({ className = "", variant = "white" }: WordmarkProps) {
  const isDarkVariant = variant === "black" || variant === "dark";
  const logoSrc = isDarkVariant ? "/thrideLogo-dark.png" : "/thrideLogo.png";

  return (
    <img
      src={logoSrc}
      alt="Thrides"
      className={cn("h-8 w-auto object-contain select-none shrink-0", className)}
      loading="eager"
    />
  );
}

