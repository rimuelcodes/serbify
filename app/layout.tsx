import type { Metadata, Viewport } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { LenisProvider } from "@/components/LenisProvider";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F7F5F0",
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
    <html lang="en">
      <body className="font-[family-name:var(--font-plus-jakarta)] bg-[#F7F5F0] text-[#121726] selection:bg-[#0660E4] selection:text-white">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
