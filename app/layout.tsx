import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LenisProvider } from "@/components/LenisProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#EEF4FF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Serbify — Trusted Local Pros, At Your Door",
  description:
    "Book verified locksmiths, plumbers, electricians, and aircon cleaners across Metro Manila. Upfront pricing from ₱80, verified ID & selfie checks, and safe payments held until the job is done.",
  icons: {
    icon: "/assets/serbify-mascot.png",
  },
  openGraph: {
    title: "Serbify — Trusted Local Pros, At Your Door",
    description:
      "Upfront pricing, exact barangay pinning, verified ID & selfie checks, and safe payments with GCash, Maya, card, or cash.",
    type: "website",
    locale: "en_PH",
    siteName: "Serbify",
  },
  twitter: {
    card: "summary_large_image",
    title: "Serbify — Trusted Local Pros, At Your Door",
    description:
      "Book verified locksmiths, plumbers, electricians, and aircon cleaners across Metro Manila.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-[family-name:var(--font-plus-jakarta)] bg-[#FFFFFF] text-[#0F172A] selection:bg-[#0660E4] selection:text-white">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
