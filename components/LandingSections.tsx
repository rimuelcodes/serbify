"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Fingerprint,
  Gavel,
  IdCard,
  KeyRound,
  Lock,
  MapPin,
  Navigation,
  Play,
  Radar,
  Receipt,
  Satellite,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserCheck,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  CounterRollUp,
  KineticHeadline,
  MagneticButton,
  SpotlightCard,
} from "./KineticPrimitives";
import { COPY, type Persona } from "./SerbifyCopy";
import { SPRING_TACTILE } from "./serbifyTheme";
import { PhilippinesCoverageMap3D } from "./three/PhilippinesCoverageCanvas";

interface LandingSectionsProps {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

function AnimatedPeso({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 260, damping: 28 });
  const display = useTransform(spring, (v) => `₱${Math.round(v).toLocaleString()}`);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

const SERVICE_CATEGORIES = [
  {
    id: "locksmith",
    title: "Locksmith",
    desc: "Lockouts, duplicate keys, smart digital lock installation.",
    price: "₱80",
    baseFee: 80,
    psgcFee: 70,
    eta: "< 20 mins",
    badge: "Emergency",
    badgeTone: "bg-[#EE8B60]/20 text-[#853A15]",
    iconBg: "bg-[#EE8B60]/15 text-[#853A15]",
    icon: KeyRound,
  },
  {
    id: "plumbing",
    title: "Plumbing & Leaks",
    desc: "Burst pipes, clogged drains, toilet seals, and water heater repairs.",
    price: "₱350",
    baseFee: 350,
    psgcFee: 50,
    eta: "< 25 mins",
    badge: "Fast Dispatch",
    badgeTone: "bg-[#0660E4]/10 text-[#0660E4]",
    iconBg: "bg-[#0660E4]/10 text-[#0660E4]",
    icon: Wrench,
  },
  {
    id: "electrical",
    title: "Electrical Repairs",
    desc: "Breaker trips, fixture rewiring, ceiling fan mounts, diagnostics.",
    price: "₱400",
    baseFee: 400,
    psgcFee: 50,
    eta: "< 30 mins",
    badge: "Certified",
    badgeTone: "bg-[#7C5CFC]/10 text-[#5B21B6]",
    iconBg: "bg-[#7C5CFC]/10 text-[#7C5CFC]",
    icon: Zap,
  },
  {
    id: "aircon",
    title: "Aircon & Appliances",
    desc: "Inverter deep chemical wash, Freon recharge, leak troubleshooting.",
    price: "₱550",
    baseFee: 550,
    psgcFee: 0,
    eta: "Same Day",
    badge: "Popular",
    badgeTone: "bg-[#10B981]/15 text-[#065F46]",
    iconBg: "bg-[#10B981]/15 text-[#065F46]",
    icon: Wind,
  },
  {
    id: "cleaning",
    title: "House Cleaning",
    desc: "Post-construction, condo turnover disinfection, upholstery steam.",
    price: "₱300",
    baseFee: 300,
    psgcFee: 60,
    eta: "< 45 mins",
    badge: "Top Rated",
    badgeTone: "bg-[#F1F5F9] text-[#475569]",
    iconBg: "bg-[#0660E4]/10 text-[#0660E4]",
    icon: Sparkles,
  },
];

const METRO_MANILA_HUBS = [
  { id: "manila", label: "Manila", x: "44%", y: "31%" },
  { id: "qc", label: "Quezon City", x: "52%", y: "22%" },
  { id: "makati", label: "Makati", x: "48%", y: "36%" },
  { id: "taguig", label: "Taguig", x: "54%", y: "39%" },
  { id: "pasig", label: "Pasig", x: "57%", y: "31%" },
  { id: "mandaluyong", label: "Mandaluyong", x: "51%", y: "31%" },
];

const EXPANSION_HUBS = [
  { id: "cebu", label: "Cebu City", x: "56%", y: "58%" },
  { id: "davao", label: "Davao City", x: "60%", y: "79%" },
];

type ModalTopic = "ios" | "android" | "terms" | "privacy" | "safety" | null;

const MODAL_CONTENT: Record<
  Exclude<ModalTopic, null>,
  { badge: string; title: string; body: string; detail: string }
> = {
  ios: {
    badge: "iPhone & iPad • App Store",
    title: "Serbify for iPhone",
    body: "Book verified Metro Manila pros, track live map arrival, and pay safely with GCash, Maya, card, or cash.",
    detail: "Available across Metro Manila",
  },
  android: {
    badge: "Android • Google Play",
    title: "Serbify for Android",
    body: "Pin your exact barangay or condo gate, get live arrival alerts, and book verified home pros in minutes.",
    detail: "Available across Metro Manila, Cebu & Davao",
  },
  terms: {
    badge: "Terms • Republic of the Philippines",
    title: "Terms of Service",
    body: "All Serbify bookings use clear upfront estimates. In-app payments are held safely and released only once you approve the completed work.",
    detail: "Serbify Technologies Inc. • Customer Protection",
  },
  privacy: {
    badge: "Data Privacy Act (RA 10173)",
    title: "Privacy Policy",
    body: "Personal phone numbers stay hidden with private in-app calls and chat. Government IDs and selfie checks are stored securely and never shared.",
    detail: "Private & Secure • No Ad Tracking",
  },
  safety: {
    badge: "4-Step Verification + ₱10,000 Cover",
    title: "Safety & Verification Guidelines",
    body: "Every technician passes a government ID check, live selfie match, NBI clearance review, and skill check before taking any job.",
    detail: "24/7 Support Desk • ₱10,000 Property Protection",
  },
};

export function LandingSections({
  persona,
  setPersona,
}: LandingSectionsProps) {
  const t = COPY.en;
  const [selectedServiceId, setSelectedServiceId] = useState(
    SERVICE_CATEGORIES[0].id
  );
  const [activeHubId, setActiveHubId] = useState<string>("pasig");
  const [modalTopic, setModalTopic] = useState<ModalTopic>(null);

  useEffect(() => {
    if (!modalTopic) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalTopic(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalTopic]);

  const selectedService =
    SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId) ??
    SERVICE_CATEGORIES[0];

  return (
    <>
      {/* 2. DUAL-PERSONA INTERACTIVE BENTO GRID */}
      <section
        id="verified-pros"
        className="w-full bg-[#FFFFFF]"
      >
        <div className="w-full max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0660E4]">
              {t.bento.eyebrow}
            </span>
            <KineticHeadline
              as="h2"
              className="text-3xl md:text-[36px] md:leading-[44px] font-bold tracking-[-0.03em] text-[#0F172A]"
              lines={[
                { text: t.bento.headingTop },
                { text: t.bento.headingBottom },
              ]}
            />
          </div>

          {/* Spring-animated Segmented Persona Switcher */}
          <div className="inline-flex p-1.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full self-start md:self-auto">
            {(["client", "pro"] as const).map((item) => {
              const active = persona === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPersona(item)}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "text-[#0B1C30]"
                      : "text-[#64748B] hover:text-[#0B1C30]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bento-persona-pill"
                      transition={SPRING_TACTILE}
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-[#E2E8F0]"
                    />
                  )}
                  <span className="relative z-10">
                    {item === "client" ? t.bento.clientTab : t.bento.proTab}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento 1: 8-col */}
          <SpotlightCard
            accent="cobalt"
            className="md:col-span-8 bg-[#EFF6FF]/65 rounded-[24px] border border-[#BFDBFE]/70 p-7 md:p-8 flex flex-col justify-between gap-8"
          >
            <div className="flex flex-col gap-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0660E4]/10 text-[#0660E4] text-xs font-bold w-fit">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {persona === "client"
                    ? "Exact Gate & Barangay Pinning"
                    : "Fast Daily Payouts"}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
                {persona === "client"
                  ? "Pin Your Exact Address & Barangay"
                  : "Keep 100% of Your Tips & Fair Job Rates"}
              </h3>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                {persona === "client"
                  ? "Drop a pin right at your gate so your pro finds you with zero confusion—no more long landmark directions."
                  : "Get paid straight to your GCash or Maya wallet right after the job is approved—no 30-day waiting."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0660E4] text-white flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">
                    Barangay Kapitolyo, Pasig City
                  </p>
                  <p className="text-xs text-[#64748B] tabular-nums">
                    Metro Manila • Arriving in 14 mins
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#10B981]/15 text-[#065F46] text-xs font-bold flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5" /> Pros Nearby
              </span>
            </div>
          </SpotlightCard>

          {/* Bento 2: 4-col (Violet Competitive Bids) */}
          <SpotlightCard
            accent="cobalt"
            className="md:col-span-4 bg-[#F1F5F9]/80 rounded-[24px] border border-[#E2E8F0] p-7 md:p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] text-xs font-bold w-fit">
                <Gavel className="w-3.5 h-3.5" />
                <span>
                  {persona === "client"
                    ? "Compare Offers"
                    : "Nearby Job Alerts"}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0F172A]">
                {persona === "client"
                  ? "Compare Quotes for Bigger Jobs"
                  : "Steady Jobs Near Your Barangay"}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                {persona === "client"
                  ? "Post a renovation or big repair and pick the best offer from trusted pros. Zero hidden fees."
                  : "Send quotes on local repairs within 5km of your location and choose jobs that fit your schedule."}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#7C5CFC] text-white text-[10px] font-bold flex items-center justify-center">
                    JB
                  </div>
                  <span className="text-xs font-bold text-[#0F172A]">
                    Jun B. (Electrician)
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0660E4] tabular-nums">
                  ₱1,200
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-[#7C5CFC]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0660E4] text-white text-[10px] font-bold flex items-center justify-center">
                    RC
                  </div>
                  <span className="text-xs font-bold text-[#0F172A]">
                    Ramil C. (Master Pro)
                  </span>
                </div>
                <span className="text-xs font-bold text-[#7C5CFC] tabular-nums">
                  ₱1,450 (Top)
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* Bento 3: 4-col (Safe In-App Chat & Free Calls) */}
          <SpotlightCard
            accent="cobalt"
            className="md:col-span-4 bg-[#F1F5F9]/80 rounded-[24px] border border-[#E2E8F0] p-7 md:p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0660E4]/10 text-[#0660E4] text-xs font-bold w-fit">
                <Lock className="w-3.5 h-3.5" />
                <span>Private Number</span>
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-[#0F172A]">
                Safe In-App Chat &amp; Free Calls
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                Message or call your pro inside the app without sharing your
                personal mobile number.
              </p>
            </div>

            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                <span className="tabular-nums">Private In-App Chat</span>
                <span className="text-[#10B981] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Live
                </span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-xs text-[#0F172A]">
                “On my way po! Bringing the replacement valve now.”
              </div>
            </div>
          </SpotlightCard>

          {/* Bento 4: 8-col (Verified ID & Selfie Check) */}
          <SpotlightCard
            accent="emerald"
            className="md:col-span-8 bg-[#EFF6FF]/65 rounded-[24px] border border-[#BFDBFE]/70 p-7 md:p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#065F46] text-xs font-bold w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>4-Step Background Check</span>
              </div>
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
                Verified ID &amp; Selfie Check
              </h3>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                Every pro passes a government ID and live selfie check, plus NBI
                clearance, before taking a single job.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  title: "1. Gov't ID",
                  desc: "National ID, UMID, or Driver's License",
                  icon: IdCard,
                },
                {
                  title: "2. Selfie Check",
                  desc: "Live photo match to confirm identity",
                  icon: Fingerprint,
                },
                {
                  title: "3. NBI Clearance",
                  desc: "Verified clean background record",
                  icon: UserCheck,
                },
                {
                  title: "4. Skill Check",
                  desc: "TESDA certificate or trade references",
                  icon: BadgeCheck,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col gap-1.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#065F46] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] pt-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#64748B] leading-snug">
                      {item.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>
        </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORIES HORIZONTAL SHOWCASE */}
      <section
        id="services"
        className="w-full bg-[#F8F9FB] border-y border-[#E2E8F0]/70"
      >
        <div className="w-full max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0660E4]">
            {t.categories.eyebrow}
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <KineticHeadline
              as="h2"
              className="text-3xl md:text-[36px] md:leading-[44px] font-bold tracking-[-0.03em] text-[#0B1C30]"
              lines={[{ text: t.categories.heading }]}
            />
            <span className="text-sm text-[#475569] tabular-nums">
              {t.categories.etaNote}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {SERVICE_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedServiceId === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setSelectedServiceId(cat.id)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...SPRING_TACTILE, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                className={`group text-left bg-white rounded-[24px] border p-6 flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "border-[#0660E4] ring-2 ring-[#0660E4]/15 shadow-[0_12px_32px_rgba(6,96,228,0.1)]"
                    : "border-[#E2E8F0] hover:border-[#0660E4] hover:shadow-[0_12px_32px_rgba(11,28,48,0.06)]"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${cat.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${cat.badgeTone}`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-bold tracking-[-0.015em] transition-colors ${
                        isSelected
                          ? "text-[#0660E4]"
                          : "text-[#0B1C30] group-hover:text-[#0660E4]"
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#475569] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[#E2E8F0]/80 flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748B]">
                      From
                    </span>
                    <span className="text-base font-extrabold text-[#0660E4] tabular-nums">
                      {cat.price}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 tabular-nums">
                      <Clock className="w-3.5 h-3.5" /> {cat.eta}
                    </span>
                    <span className="font-bold text-[#0660E4] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {isSelected ? "Selected" : "Estimate"}{" "}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Inline Interactive Upfront Price Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={SPRING_TACTILE}
          className="mt-6 bg-[#EFF6FF] rounded-[24px] border border-[#BFDBFE] p-6 md:p-8 flex flex-col gap-6 shadow-[0_8px_24px_rgba(6,96,228,0.06)]"
        >
          {/* Spring-loaded Service Category Pill Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full w-fit">
            {SERVICE_CATEGORIES.map((cat) => {
              const active = selectedServiceId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedServiceId(cat.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "text-[#0660E4]"
                      : "text-[#64748B] hover:text-[#0B1C30]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="service-estimator-pill"
                      transition={SPRING_TACTILE}
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-[#E2E8F0]"
                    />
                  )}
                  <span className="relative z-10">{cat.title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0660E4]">
              {t.categories.estimatorTitle}
            </span>
            <AnimatePresence mode="wait">
              <motion.h3
                key={selectedService.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-xl font-bold text-[#0B1C30]"
              >
                {selectedService.title} • Brgy. San Antonio, Pasig
              </motion.h3>
            </AnimatePresence>
            <p className="text-xs text-[#64748B]">{t.categories.estimatorHint}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-1 max-w-3xl">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0]">
              <p className="text-[11px] text-[#64748B] font-semibold">
                {t.categories.baseFee}
              </p>
              <p className="text-lg font-extrabold text-[#0F172A] mt-1">
                <AnimatedPeso value={selectedService.baseFee} />
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0]">
              <p className="text-[11px] text-[#64748B] font-semibold">
                {t.categories.psgcFee}
              </p>
              <p className="text-lg font-extrabold text-[#0F172A] mt-1">
                <AnimatedPeso value={selectedService.psgcFee} />
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#10B981]/30">
              <p className="text-[11px] text-[#065F46] font-semibold">
                {t.categories.hiddenFee}
              </p>
              <p className="text-lg font-extrabold text-[#10B981] mt-1 tabular-nums">
                ₱0
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0660E4] text-white">
              <p className="text-[11px] text-blue-100 font-semibold">
                {t.categories.totalEst}
              </p>
              <p className="text-lg font-extrabold mt-1">
                <AnimatedPeso
                  value={selectedService.baseFee + selectedService.psgcFee}
                />
              </p>
            </div>
          </div>
          </div>
        </motion.div>
        </div>
      </section>

      {/* 4. DRAMATIC DARK MODE SAFETY & PAYMENT SECTION */}
      <section
        id="trust-safety"
        className="w-full bg-[#0B1220] text-white py-24 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
                {t.escrow.eyebrow}
              </span>
              <KineticHeadline
                as="h2"
                className="text-3xl md:text-[36px] md:leading-[44px] font-bold tracking-[-0.03em] text-white"
                lines={[{ text: t.escrow.heading }]}
              />
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                {t.escrow.subtitle}
              </p>
            </div>

            <div className="p-4 bg-[#131C2E] border border-[#24324D] rounded-[20px] flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {t.escrow.guaranteeTitle}
                </p>
                <p className="text-[11px] text-slate-300 tabular-nums">
                  {t.escrow.guaranteeSub}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard
              dark
              accent="cobalt"
              className="bg-[#131C2E] border border-[#24324D] p-7 rounded-[24px] flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#0660E4] tabular-nums">
                    01
                  </span>
                  <MapPin className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Pin Your Exact Address
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Drop a pin at your gate or barangay. Choose emergency help now
                  or pick a scheduled time that works for you.
                </p>
              </div>
              <div className="text-xs text-slate-200 bg-[#0B1220] border border-[#24324D] p-3 rounded-xl font-medium tabular-nums mt-6">
                Brgy. San Antonio, Pasig • Pinned
              </div>
            </SpotlightCard>

            <SpotlightCard
              dark
              accent="cobalt"
              className="bg-[#131C2E] border border-[#24324D] p-7 rounded-[24px] flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#F59E0B] tabular-nums">
                    02
                  </span>
                  <Receipt className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  See Upfront Quotes
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Clear prices before anyone heads over mean zero haggling at
                  your door. Compare pro badges and past reviews.
                </p>
              </div>
              <div className="text-xs text-slate-200 bg-[#0B1220] border border-[#24324D] p-3 rounded-xl font-medium tabular-nums mt-6">
                Agreed Price: ₱450.00 Fixed
              </div>
            </SpotlightCard>

            <SpotlightCard
              dark
              accent="emerald"
              className="bg-[#131C2E] border border-[#24324D] p-7 rounded-[24px] flex flex-col justify-between gap-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#10B981] tabular-nums">
                    03
                  </span>
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Inspect, Approve &amp; Pay
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Follow your pro&apos;s live arrival on the map. Check
                  before-and-after photos and tap Approve when the job is done.
                </p>
              </div>
              <div className="text-xs text-[#10B981] bg-[#0B1220] border border-[#24324D] p-3 rounded-xl font-medium flex items-center justify-between mt-6">
                <span>Payment Released on Approval</span>
                <Check className="w-4 h-4" />
              </div>
            </SpotlightCard>
          </div>

          {/* Payment Options Strip */}
          <div className="bg-[#131C2E] border border-[#24324D] p-6 md:p-7 rounded-[24px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#F59E0B] font-bold">
                Flexible Local Payments
              </span>
              <p className="text-sm text-slate-200 mt-1">
                Zero extra fees on GCash, Maya, QR Ph, Debit/Credit Card, or
                Cash.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { name: "GCash", dot: "bg-blue-400" },
                { name: "Maya", dot: "bg-[#10B981]" },
                { name: "QR Ph", dot: "bg-[#F59E0B]" },
                { name: "Debit / Credit Card", dot: "bg-[#7C5CFC]" },
                { name: "Cash After Job", dot: "bg-slate-300" },
              ].map((rail) => (
                <motion.span
                  key={rail.name}
                  whileHover={{ y: -2 }}
                  transition={SPRING_TACTILE}
                  className="px-4 py-2 bg-[#0B1220] border border-[#24324D] hover:border-[#0660E4] hover:shadow-[0_0_16px_rgba(6,96,228,0.28)] transition-all rounded-full text-xs font-bold text-white flex items-center gap-2 cursor-default"
                >
                  <span className={`w-2 h-2 rounded-full ${rail.dot}`} />
                  {rail.name}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICE AREAS & PHILIPPINES RADAR */}
      <section
        id="coverage"
        className="w-full max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0660E4]">
                {t.coverage.eyebrow}
              </span>
              <KineticHeadline
                as="h2"
                className="text-3xl md:text-[36px] md:leading-[44px] font-bold tracking-[-0.03em] text-[#0B1C30]"
                lines={[{ text: t.coverage.heading }]}
              />
              <p className="text-base text-[#475569] leading-relaxed">
                {t.coverage.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#0B1C30]">
                Active Metro Manila Hubs (Live Now)
              </span>
              <div className="flex flex-wrap gap-2">
                {METRO_MANILA_HUBS.map((hub) => {
                  const active = activeHubId === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onMouseEnter={() => setActiveHubId(hub.id)}
                      onClick={() => setActiveHubId(hub.id)}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        active
                          ? "bg-[#ECFDF5] border-[#10B981] text-[#065F46] shadow-xs"
                          : "bg-white border-[#E2E8F0] text-[#0B1C30] hover:border-[#10B981]/60"
                      }`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                      </span>
                      {hub.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#0B1C30]">
                Expansion Radar Q3/Q4
              </span>
              <div className="flex flex-wrap gap-2">
                {EXPANSION_HUBS.map((hub) => {
                  const active = activeHubId === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onMouseEnter={() => setActiveHubId(hub.id)}
                      onClick={() => setActiveHubId(hub.id)}
                      className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        active
                          ? "bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs"
                          : "bg-[#FEF3C7]/50 border-[#F59E0B]/30 text-[#92400E] hover:border-[#F59E0B]"
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                      {hub.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Archipelago Radar Card */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[420px] bg-white rounded-[24px] border border-[#E2E8F0] p-6 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#0660E4] text-white flex items-center justify-center">
                    <Satellite className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">
                      Metro Manila &amp; Expanding Areas
                    </p>
                    <p className="text-[11px] text-[#64748B]">
                      Live Pro Availability Across Cities
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#065F46] text-xs font-bold flex items-center gap-1.5 tabular-nums">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]" /> 99.8%
                  Online
                </span>
              </div>

              {/* Interactive 3D Philippines Extruded Archipelago */}
              <PhilippinesCoverageMap3D
                activeHubId={activeHubId}
                onSelectHub={setActiveHubId}
              />

              <div className="flex items-center justify-between text-xs text-[#475569] pt-3 border-t border-[#E2E8F0] tabular-nums">
                {(() => {
                  const hubStats: Record<
                    string,
                    { pros: number; dispatch: string; expanding?: boolean }
                  > = {
                    manila: { pros: 312, dispatch: "< 18 mins" },
                    qc: { pros: 428, dispatch: "< 19 mins" },
                    makati: { pros: 284, dispatch: "< 15 mins" },
                    taguig: { pros: 196, dispatch: "< 17 mins" },
                    pasig: { pros: 164, dispatch: "< 20 mins" },
                    mandaluyong: { pros: 98, dispatch: "< 16 mins" },
                    cebu: { pros: 84, dispatch: "Q3 Launch", expanding: true },
                    davao: { pros: 62, dispatch: "Q4 Launch", expanding: true },
                  };
                  const current = hubStats[activeHubId] ?? {
                    pros: 1482,
                    dispatch: "< 22 mins",
                  };
                  return (
                    <>
                      <span>
                        Active Pros Online:{" "}
                        <strong className="text-[#0B1C30]">
                          <CounterRollUp target={current.pros} duration={0.7} />
                        </strong>
                      </span>
                      <span>
                        Median Dispatch:{" "}
                        <strong
                          className={
                            current.expanding
                              ? "text-[#92400E]"
                              : "text-[#0660E4]"
                          }
                        >
                          {current.dispatch}
                        </strong>
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HIGH-CONVERSION APP DOWNLOAD BANNER */}
      <section
        id="download-app"
        className="w-full max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-24"
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0660E4 0%, #044BB3 100%)",
          }}
          className="relative w-full rounded-[28px] p-8 md:p-14 text-white overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[0_24px_60px_rgba(6,96,228,0.22)]"
        >
          <div className="flex flex-col gap-4 max-w-xl z-10 text-center lg:text-left items-center lg:items-start">
            <div className="flex items-center gap-2.5">
              <img
                alt="Serbify Logo"
                className="w-8 h-8 object-contain rounded-full bg-white p-0.5"
                src="/assets/serbify-mascot.png"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                {t.banner.eyebrow}
              </span>
            </div>

            <h2 className="text-3xl md:text-[36px] md:leading-[44px] font-extrabold tracking-[-0.03em] text-white">
              {t.banner.heading}
            </h2>

            <p className="text-sm md:text-base text-blue-100 leading-relaxed">
              {t.banner.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <motion.div
                whileHover={{ y: -2 }}
                transition={SPRING_TACTILE}
              >
                <MagneticButton
                  className="px-5 py-3 rounded-2xl bg-white text-[#0B1C30] hover:bg-blue-50 transition-all flex items-center gap-3 shadow-[0_10px_24px_rgba(11,28,48,0.16)] hover:shadow-[0_14px_30px_rgba(11,28,48,0.22)] cursor-pointer"
                  onClick={() => setModalTopic("ios")}
                >
                  {/* Official Apple Logo SVG */}
                  <svg
                    viewBox="0 0 384 512"
                    className="w-6 h-6 fill-[#0B1C30] shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] leading-tight text-[#475569] font-semibold">
                      Download on the
                    </span>
                    <span className="text-sm font-extrabold leading-tight tracking-[-0.01em] text-[#0B1C30]">
                      App Store
                    </span>
                  </div>
                </MagneticButton>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={SPRING_TACTILE}
              >
                <MagneticButton
                  className="px-5 py-3 rounded-2xl bg-white text-[#0B1C30] hover:bg-blue-50 transition-all flex items-center gap-3 shadow-[0_10px_24px_rgba(11,28,48,0.16)] hover:shadow-[0_14px_30px_rgba(11,28,48,0.22)] cursor-pointer"
                  onClick={() => setModalTopic("android")}
                >
                  {/* Official Four-Color Google Play Prism SVG */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.6 2.3C3.2 2.7 3 3.3 3 4.1v15.8c0 .8.2 1.4.6 1.8l.1.1 8.8-8.8v-.2L3.7 2.2l-.1.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M15.4 15.1l-2.9-2.9v-.4l2.9-2.9.1.1 3.5 2c1 .6 1 1.5 0 2.1l-3.5 2-.1 0z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M15.5 15L12.5 12 3.6 20.9c.3.4.9.4 1.6.1l10.3-6z"
                      fill="#EA4335"
                    />
                    <path
                      d="M15.5 9L5.2 3.1C4.5 2.7 3.9 2.8 3.6 3.1L12.5 12l3-3z"
                      fill="#34A853"
                    />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase tracking-wider leading-tight text-[#475569] font-bold">
                      GET IT ON
                    </span>
                    <span className="text-sm font-extrabold leading-tight tracking-[-0.01em] text-[#0B1C30]">
                      Google Play
                    </span>
                  </div>
                </MagneticButton>
              </motion.div>
            </div>
          </div>

          <div className="z-10 bg-white/12 backdrop-blur-md border border-white/20 p-5 rounded-[24px] flex flex-col items-center gap-2.5 text-center shrink-0">
            <div className="bg-white p-4 rounded-[20px] border border-[#E2E8F0] shadow-[0_10px_28px_rgba(11,28,48,0.16)] flex items-center justify-center">
              <QRCodeSVG
                value="https://serbisyohubph.com"
                size={132}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#0B1C30"
                imageSettings={{
                  src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230660E4'/%3E%3Cpath d='M16 6l8 3.5v6.2c0 5.1-3.4 9.6-8 11.3-4.6-1.7-8-6.2-8-11.3V9.5L16 6z' fill='%23FFFFFF'/%3E%3Cpath d='M13.5 16.2l1.8 1.8 3.7-3.8' stroke='%230660E4' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E",
                  height: 28,
                  width: 28,
                  excavate: true,
                }}
              />
            </div>
            <span className="text-xs font-bold text-white">
              Scan to Install Mobile App
            </span>
            <span className="text-[11px] text-blue-100">
              iOS &amp; Android
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#F1F5F9] border-t border-[#E2E8F0] mt-16">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#0660E4] font-bold text-xl tracking-[-0.02em]">
                <img
                  src="/assets/serbify-mascot.png"
                  alt="Serbify"
                  className="w-8 h-8 object-contain shrink-0"
                />
                <span className="text-[#0F172A]">Serbify</span>
              </div>
              <p className="text-sm text-[#475569] max-w-sm leading-relaxed">
                Your trusted Filipino home services app. Connecting homeowners
                with verified local pros—with upfront pricing and safe payments.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  Gov&apos;t ID Verified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A]">
                  <Lock className="w-3.5 h-3.5 text-[#0660E4]" />
                  Payment Held Safely
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Service Areas
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#475569]">
                <li>Metro Manila (NCR)</li>
                <li>Makati &amp; BGC Taguig</li>
                <li>Pasig, Mandaluyong &amp; QC</li>
                <li>Metro Cebu (Central Visayas)</li>
                <li>Metro Davao (Mindanao)</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Categories
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#475569]">
                <li>Aircon Cleaning &amp; Repair</li>
                <li>Deep Home Cleaning</li>
                <li>Verified Electricians</li>
                <li>Certified Plumbing</li>
                <li>Emergency Locksmith</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Safety &amp; Trust
              </span>
              <ul className="flex flex-col gap-2 text-xs text-[#475569]">
                <li>NBI Clearance Check</li>
                <li className="tabular-nums">Serbify Guarantee (₱10,000)</li>
                <li>Verified ID &amp; Selfie Check</li>
                <li>Exact Gate &amp; Barangay Pinning</li>
                <li>24/7 Support Desk</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E2E8F0] text-xs text-[#64748B]">
            <p>
              © 2026 Serbify Technologies Inc. Republic of the Philippines. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6 font-semibold">
              <button
                type="button"
                onClick={() => setModalTopic("terms")}
                className="hover:text-[#0B1C30] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setModalTopic("privacy")}
                className="hover:text-[#0B1C30] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setModalTopic("safety")}
                className="hover:text-[#0B1C30] transition-colors cursor-pointer"
              >
                Safety Guidelines
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessible Info & Store Dialog */}
      <AnimatePresence>
        {modalTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalTopic(null)}
            className="fixed inset-0 z-[100] bg-[#0B1C30]/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="serbify-modal-title"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={SPRING_TACTILE}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-[24px] border border-[#E2E8F0] p-6 sm:p-7 shadow-[0_24px_60px_rgba(11,28,48,0.2)] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0660E4]/10 text-[#0660E4] text-[11px] font-bold">
                  {MODAL_CONTENT[modalTopic].badge}
                </span>
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setModalTopic(null)}
                  className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0B1C30] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3
                id="serbify-modal-title"
                className="text-xl font-bold tracking-[-0.02em] text-[#0B1C30]"
              >
                {MODAL_CONTENT[modalTopic].title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed">
                {MODAL_CONTENT[modalTopic].body}
              </p>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#065F46] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{MODAL_CONTENT[modalTopic].detail}</span>
              </div>
              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="mt-1 w-full py-2.5 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
