import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import "../styles.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { SmoothScroll } from "@/providers/SmoothScroll";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env["SITE_URL"] || "http://localhost:3000"),
  title: {
    default: "Thrides | Digital Creative Agency",
    template: "%s | Thrides",
  },
  description:
    "Thrides is a digital creative agency that puts your brand in front of the right customers, with a purpose behind every move. Book a free strategy call.",
  openGraph: {
    title: "Thrides | Digital Creative Agency",
    description:
      "Thrides is a digital creative agency that puts your brand in front of the right customers, with a purpose behind every move. Book a free strategy call.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#08080B] text-foreground font-sans antialiased">
        <QueryProvider>
          <SmoothScroll />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
