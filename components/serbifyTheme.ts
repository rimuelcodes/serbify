export const SERBIFY_THEME = {
  canvas: "#FBF8F1",
  canvasMesh: "#F4EFE4",
  canvasAlt: "#F4EFE4",
  surface: "#FFFFFF",
  surfaceSubtle: "#F7F3E8",
  borderHairline: "rgba(18, 23, 38, 0.08)",
  inkPrimary: "#121726",
  inkSecondary: "#4B5565",
  inkMuted: "#64748B",
  cobalt: "#0660E4",
  cobaltHover: "#044BB5",
  emerald: "#117A58",
  emeraldDeep: "#0B533C",
  amber: "#E59824",
  amberDeep: "#8A5609",
  terracotta: "#EE8B60",
  terracottaDeep: "#853A15",
  darkNavy: "#121726",
  darkCard: "#181C26",
} as const;

export const SPRING_TACTILE = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
};

export const SPRING_NAV = {
  type: "spring" as const,
  stiffness: 400,
  damping: 32,
};

export interface JourneyStepMeta {
  id: number;
  key: string;
  phase: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeTone: "cobalt" | "emerald" | "amber" | "terracotta";
  telemetry: string;
}

export const NINE_JOURNEY_STEPS: JourneyStepMeta[] = [
  {
    id: 1,
    key: "discovery",
    phase: "Step 01",
    title: "Discovery & Upfront Rates",
    subtitle:
      "Browse vetted Metro Manila trades with transparent starting rates from ₱80 inspection to ₱800 emergency dispatch.",
    badgeText: "Transparent Pricing",
    badgeTone: "cobalt",
    telemetry: "5 Core Trades • ₱80–₱800 Base",
  },
  {
    id: 2,
    key: "radar",
    phase: "Step 02",
    title: "Live Radar & PSGC Pinning",
    subtitle:
      "Pin exact barangays using Philippine Standard Geographic Codes (PSGC) down to purok level—no confusing landmark directions.",
    badgeText: "PSGC 137404000",
    badgeTone: "cobalt",
    telemetry: "Brgy. San Antonio, Pasig • 9 Pros Nearby",
  },
  {
    id: 3,
    key: "match",
    phase: "Step 03",
    title: "Match & Accept Verified Pro",
    subtitle:
      "Review Gov't ID, NBI clearance, 3D liveness status, and real completion counts before locking your pro.",
    badgeText: "KYC + NBI Verified",
    badgeTone: "emerald",
    telemetry: "Kuya Arnel • 4.9★ • 830+ Jobs",
  },
  {
    id: 4,
    key: "en-route",
    phase: "Step 04",
    title: "En Route via Live GPS",
    subtitle:
      "Watch your technician travel along Shaw Blvd or EDSA in real time with WebSocket ETA updates and masked chat.",
    badgeText: "12 mins ETA",
    badgeTone: "cobalt",
    telemetry: "Shaw Blvd Corridor • 1.8 km away",
  },
  {
    id: 5,
    key: "arrived",
    phase: "Step 05",
    title: "Arrived & Gate Check-In",
    subtitle:
      "Receive instant arrival verification with 3D liveness match and condo lobby pass readiness—zero personal phone sharing.",
    badgeText: "Identity Matched",
    badgeTone: "emerald",
    telemetry: "Gate Check-In • Encrypted Relay #9021",
  },
  {
    id: 6,
    key: "in-progress",
    phase: "Step 06",
    title: "In Progress & Scope Lock",
    subtitle:
      "Track live job elapsed time and before-repair photo logs. Any scope change requires your explicit in-app approval.",
    badgeText: "Scope Locked ₱450",
    badgeTone: "amber",
    telemetry: "Timer 00:18:42 • Escrow Held",
  },
  {
    id: 7,
    key: "job-done",
    phase: "Step 07",
    title: "Job Done & Photo Sign-Off",
    subtitle:
      "Inspect completed work with side-by-side before/after evidence before authorizing escrow release.",
    badgeText: "100% Sign-Off",
    badgeTone: "emerald",
    telemetry: "2/2 Checklist Passed • Leak Sealed",
  },
  {
    id: 8,
    key: "payment",
    phase: "Step 08",
    title: "Digital or Cash Payment",
    subtitle:
      "Settle seamlessly via GCash, Maya, QR Ph, Visa/Mastercard via PayMongo, or Cash on Completion with zero hidden fees.",
    badgeText: "PH Payment Rails",
    badgeTone: "cobalt",
    telemetry: "₱450.00 • Zero Surcharge",
  },
  {
    id: 9,
    key: "completed",
    phase: "Step 09",
    title: "Completed & Rated",
    subtitle:
      "Rate your pro, download your BIR-ready digital receipt, and trigger instant payout to your technician's wallet.",
    badgeText: "4.9★ Rated",
    badgeTone: "emerald",
    telemetry: "Instant Pro Payout • ₱10,000 Cover",
  },
];
