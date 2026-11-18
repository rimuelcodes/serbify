export type Locale = "en";
export type Persona = "client" | "pro";

export interface LocalizedStepCopy {
  phase: string;
  title: string;
  subtitle: string;
  badgeText: string;
  telemetry: string;
}

export const COPY = {
  en: {
    nav: {
      clients: "For Homeowners",
      pros: "For Pros",
      services: "Services",
      verifiedPros: "Verified Pros",
      trust: "Trust & Safety",
      coverage: "Areas",
      webApp: "Web App",
      download: "Download App",
    },
    hero: {
      client: {
        livePill: "Live across Metro Manila & Expanding Nationwide",
        titleTop: "Trusted Local Pros,",
        titleAccent: "At Your Door When You Need Help.",
        subtitle:
          "Book verified locksmiths, plumbers, electricians, and aircon cleaners in minutes. See upfront prices, pin your exact gate, and follow your pro's live arrival.",
        ctaPrimary: "Book a Pro Now",
        ctaSecondary: "See How It Works",
        trust1: "Verified ID & Selfie Check",
        trust2: "GCash, Maya, Card & Cash",
        trust3: "4.9★ (24,800+ Jobs)",
        floatingCards: {
          verified: "ID-Verified Pro",
          verifiedSub: "Gov't ID + NBI + Selfie Check",
          pricing: "Upfront Pricing",
          pricingSub: "From ₱80 • ₱0 Hidden Fees",
          gps: "Live Map Tracking",
          gpsSub: "Live Updates • 9 Pros Nearby",
        },
      },
      pro: {
        livePill: "Now Welcoming Verified Trades in NCR, Cebu & Davao",
        titleTop: "Grow Your Service Trade,",
        titleAccent: "With Fast Payouts.",
        subtitle:
          "Get steady local jobs in your barangay with verified trust and fast GCash or Maya payouts—no 30-day invoice delays.",
        ctaPrimary: "Join as a Verified Pro",
        ctaSecondary: "See How Pros Work",
        trust1: "Verified ID & Selfie Badge",
        trust2: "Fast GCash / Maya Payout",
        trust3: "Keep 100% of Tips",
        floatingCards: {
          verified: "Verified Pro Badge",
          verifiedSub: "TESDA & NBI Checked",
          pricing: "Protected Payments",
          pricingSub: "₱450–₱2,400 Avg Job",
          gps: "Nearby Job Alerts",
          gpsSub: "Local Requests < 5km",
        },
      },
    },
    journey: {
      eyebrow: "Simple Booking Flow",
      heading: "Nine Clear Steps from Pin to Done.",
      subtitle:
        "Every booking follows clear, easy steps—from pinning your exact gate to paying safely after you inspect the work.",
      stepOf: "of 9",
      previewLabel: "Live App Preview",
      videoCaptions: {
        step6: "Pro Does the Job",
        step7: "Job Is Finished",
      },
      steps: [
        {
          phase: "Step 01",
          title: "Pick a Service",
          subtitle:
            "Browse trusted Metro Manila pros with clear starting rates from ₱80 locksmith checks to ₱550 aircon deep wash.",
          badgeText: "Upfront Pricing",
          telemetry: "5 Core Trades • ₱80–₱550 Base",
        },
        {
          phase: "Step 02",
          title: "Pin Your Exact Address",
          subtitle:
            "Drop a pin right at your barangay or condo gate so your pro finds you with zero confusion.",
          badgeText: "Finding Pros",
          telemetry: "Kapitolyo, Pasig • 9 Pros Nearby",
        },
        {
          phase: "Step 03",
          title: "Pro Matches & Accepts",
          subtitle:
            "Check your pro's verified government ID, NBI clearance, selfie check, and past job count before they head over.",
          badgeText: "Confirmed",
          telemetry: "Kuya Arnel • 4.9★ • 830+ Jobs",
        },
        {
          phase: "Step 04",
          title: "On the Way",
          subtitle:
            "Watch your pro travel along Shaw Blvd or EDSA in real time with live arrival updates.",
          badgeText: "On the Way",
          telemetry: "12 mins ETA • 1.8 km away",
        },
        {
          phase: "Step 05",
          title: "Arrived at Your Gate",
          subtitle:
            "Get an instant arrival alert with photo verification and condo lobby check-in—without sharing your mobile number.",
          badgeText: "Arrived",
          telemetry: "Lobby Check-In • Private Chat",
        },
        {
          phase: "Step 06",
          title: "Pro Does the Job",
          subtitle:
            "Follow a live job timer and chat safely inside the app while your pro completes the agreed work.",
          badgeText: "In Progress",
          telemetry: "Timer 00:18:42 • Live Updates",
        },
        {
          phase: "Step 07",
          title: "Check the Finished Work",
          subtitle:
            "Inspect before-and-after photos and confirm every item on the checklist before releasing payment.",
          badgeText: "100% Sign-Off",
          telemetry: "3/3 Checks Passed • Verified",
        },
        {
          phase: "Step 08",
          title: "Easy Payment",
          subtitle:
            "Pay smoothly with GCash, Maya, QR Ph, debit/credit card, or cash with zero surprise fees.",
          badgeText: "Safe Payment",
          telemetry: "₱450.00 • Zero Extra Fees",
        },
        {
          phase: "Step 09",
          title: "Done & Rated",
          subtitle:
            "Leave a star rating, save your digital receipt, and release instant payout to your pro.",
          badgeText: "Completed",
          telemetry: "5.0★ Rated • Instant Payout",
        },
      ] as LocalizedStepCopy[],
    },
    bento: {
      eyebrow: "Homeowners & Local Pros",
      headingTop: "Built for Homeowners.",
      headingBottom: "Built for Local Pros.",
      clientTab: "For Homeowners (Book in Seconds)",
      proTab: "For Local Pros (Earn Daily)",
    },
    categories: {
      eyebrow: "Everyday & Emergency Services",
      heading: "Everything your home or business needs.",
      etaNote: "Average pro arrival: under 24 minutes",
      estimatorTitle: "Upfront Price Breakdown",
      estimatorHint: "Click any service card to preview transparent pricing",
      baseFee: "Starting Inspection Fee",
      psgcFee: "Distance & Area Estimate",
      hiddenFee: "Hidden Booking Fees",
      totalEst: "Estimated Total",
    },
    escrow: {
      eyebrow: "Protected Payments",
      heading: "Pay Safely After the Job is Done.",
      subtitle:
        "Your payment is held safely and only released once you approve the completed work—zero surprise fees.",
      guaranteeTitle: "100% Serbify Guarantee",
      guaranteeSub: "₱10,000 Property Protection Included",
    },
    coverage: {
      eyebrow: "Service Areas",
      heading: "Available in your Barangay.",
      subtitle:
        "From condos in BGC and Ortigas to subdivisions across nearby provinces, find a verified pro in under 30 minutes.",
    },
    banner: {
      eyebrow: "Get Serbify on iOS & Android",
      heading: "Ready to fix your home or grow your trade?",
      subtitle:
        "Join over 25,000 satisfied homeowners across Metro Manila and hundreds of vetted pros booking trusted service on demand.",
    },
  },
} as const;
