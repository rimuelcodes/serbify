"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Home,
  MessageSquare,
  Navigation,
  Phone,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Wallet,
} from "lucide-react";
import { useLenis } from "./LenisProvider";
import {
  CounterRollUp,
  KineticHeadline,
  MagneticButton,
} from "./KineticPrimitives";
import { COPY, type Persona } from "./SerbifyCopy";
import { SPRING_TACTILE } from "./serbifyTheme";
import { HeroRadarBackground } from "./three/HeroRadarCanvas";
import { InteractivePhoneChassis } from "./three/InteractivePhoneChassis";

interface HeroSectionProps {
  persona: Persona;
}

const MASK_EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ persona }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { lenis } = useLenis();
  const [relayMode, setRelayMode] = useState<"idle" | "call" | "chat">("idle");
  const t = COPY.en.hero[persona];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax depths for orbiting glassmorphic UI cards
  const cardVerifiedY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const cardPricingY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const cardGpsY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 22]);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    selector: string
  ) => {
    const el = document.querySelector(selector);
    if (el instanceof HTMLElement && lenis) {
      e.preventDefault();
      lenis.scrollTo(el, { offset: -16 });
    }
  };

  return (
    <section
      ref={heroRef}
      style={{
        background:
          "linear-gradient(180deg, #EEF4FF 0%, #F9FAFB 65%, #FFFFFF 100%)",
      }}
      className="relative w-full overflow-x-clip"
    >
      {/* Ambient 3D Topographic Radar Canvas */}
      <HeroRadarBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 pt-32 md:pt-36 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column: Editorial & Value Prop */}
        <div className="lg:col-span-7 flex flex-col gap-6 z-10">
          {/* Live Radar Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...SPRING_TACTILE, delay: 0.04 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E2E8F0] w-fit shadow-[0_1px_8px_rgba(11,28,48,0.04)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0660E4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0660E4]" />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${persona}-pill`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-xs font-bold tracking-tight text-[#0660E4]"
              >
                {t.livePill}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* GSAP Masked Line Reveal Display Headline */}
          <KineticHeadline
            as="h1"
            immediate
            triggerKey={persona}
            className="text-[38px] leading-[44px] sm:text-5xl md:text-[56px] md:leading-[64px] font-extrabold tracking-[-0.03em] text-[#0F172A]"
            lines={[
              { text: t.titleTop },
              { text: t.titleAccent, className: "text-[#0660E4]" },
            ]}
          />

          {/* Subheadline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`${persona}-sub`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: MASK_EASE }}
              className="text-base md:text-lg text-[#475569] max-w-xl leading-relaxed"
            >
              {t.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Dual CTA Cluster */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TACTILE, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
          >
            <MagneticButton
              href="#book-flow"
              onClick={(e) =>
                handleScrollTo(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  "#book-flow"
                )
              }
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_8px_24px_rgba(6,96,228,0.22)] transition-colors w-full sm:w-auto"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>

            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_TACTILE}
              href="#verified-pros"
              onClick={(e) => handleScrollTo(e, "#verified-pros")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0B1C30] text-sm font-bold transition-colors"
            >
              <BadgeCheck className="w-4 h-4 text-[#0660E4]" />
              <span>{t.ctaSecondary}</span>
            </motion.a>
          </motion.div>

          {/* Staggered Trust Micro-bar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.24 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
          >
            {[
              { icon: BadgeCheck, color: "text-[#10B981]", text: t.trust1 },
              { icon: Wallet, color: "text-[#0660E4]", text: t.trust2 },
              {
                icon: Star,
                color: "text-[#F59E0B] fill-current",
                text: t.trust3,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 12, scale: 0.96 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: SPRING_TACTILE,
                    },
                  }}
                  className="flex items-center gap-2.5 p-3.5 rounded-[16px] bg-white border border-[#E2E8F0]"
                >
                  <Icon className={`w-5 h-5 shrink-0 ${item.color}`} />
                  <span className="text-xs font-bold text-[#0B1C30] tabular-nums">
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: Tactile Flutter Mockup Cluster + Parallax Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...SPRING_TACTILE, delay: 0.14 }}
          style={{ y: phoneY }}
          className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0"
        >
          {/* Ambient Airy Cobalt Glow & Rings */}
          <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-[#0660E4]/10 blur-3xl pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full border border-[#0660E4]/15 animate-ping pointer-events-none opacity-35" />
          <div className="absolute w-96 h-96 rounded-full border border-[#0660E4]/10 pointer-events-none" />

          {/* 3D Interactive Phone Chassis + Depth-Offset Floating Satellite Badges */}
          <InteractivePhoneChassis
            maxTilt={7}
            scrollTilt
            badges={
              <>
                {/* Floating Glassmorphic Card 1: ID-Verified Pro */}
                <motion.div
                  initial={{ opacity: 0, x: -16, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ ...SPRING_TACTILE, delay: 0.28 }}
                  style={{ y: cardVerifiedY, transform: "translateZ(42px)" }}
                  className="absolute top-20 -left-4 xl:-left-12 bg-white/92 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#E2E8F0] shadow-[0_14px_34px_rgba(11,28,48,0.1)] z-30 hidden sm:flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#0B1C30]">
                      {t.floatingCards.verified}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      {t.floatingCards.verifiedSub}
                    </span>
                  </div>
                </motion.div>

                {/* Floating Glassmorphic Card 2: Upfront Pricing */}
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...SPRING_TACTILE, delay: 0.34 }}
                  style={{ y: cardPricingY, transform: "translateZ(62px)" }}
                  className="absolute -bottom-3 -left-2 sm:-left-10 bg-white/92 backdrop-blur-xl p-3 rounded-2xl border border-[#E2E8F0] shadow-[0_14px_34px_rgba(11,28,48,0.1)] max-w-[230px] z-30 hidden sm:flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0660E4]/10 text-[#0660E4] flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#0B1C30]">
                      {t.floatingCards.pricing}
                    </span>
                    <span className="text-[10px] text-[#475569] tabular-nums">
                      {t.floatingCards.pricingSub}
                    </span>
                  </div>
                </motion.div>

                {/* Floating Glassmorphic Card 3: Live GPS Tracking */}
                <motion.div
                  initial={{ opacity: 0, x: 16, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ ...SPRING_TACTILE, delay: 0.4 }}
                  style={{ y: cardGpsY, transform: "translateZ(54px)" }}
                  className="absolute top-12 -right-2 xl:-right-10 bg-white/92 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#E2E8F0] shadow-[0_14px_34px_rgba(11,28,48,0.1)] z-30 hidden sm:flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center shrink-0">
                    <Radar className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#0B1C30]">
                      {t.floatingCards.gps}
                    </span>
                    <span className="text-[10px] text-[#065F46] font-semibold tabular-nums flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {t.floatingCards.gpsSub}
                    </span>
                  </div>
                </motion.div>
              </>
            }
          >
            {/* iPhone 16 Frame */}
            <div className="relative w-[300px] sm:w-[340px] h-[610px] sm:h-[650px] bg-slate-900 rounded-[44px] p-3 shadow-[0_24px_60px_-15px_rgba(11,28,48,0.22)] ring-1 ring-slate-800 flex flex-col justify-between overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[9px] text-white/75 font-mono">
                SERBIFY LIVE
              </span>
            </div>

            {/* Inner Screen */}
            <div className="relative w-full h-full bg-[#EAF1FF] rounded-[36px] overflow-hidden flex flex-col justify-between pt-10">
              {/* Stylized Vector Map */}
              <div className="absolute inset-0 bg-[#EAF1FF]">
                <svg
                  className="w-full h-full opacity-65"
                  fill="none"
                  viewBox="0 0 350 660"
                >
                  <path
                    d="M-20 280 C60 270, 140 330, 220 300 C270 280, 310 290, 380 270"
                    stroke="#B1C5FF"
                    strokeLinecap="round"
                    strokeWidth="24"
                  />
                  <path
                    d="M40 -10 L180 320 L290 680"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                  <path
                    d="M-10 180 L360 210"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                  />
                  <path
                    d="M0 430 L360 400"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                  />
                  <circle
                    cx="185"
                    cy="275"
                    opacity="0.4"
                    r="90"
                    stroke="#0660E4"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="185"
                    cy="275"
                    opacity="0.2"
                    r="140"
                    stroke="#0660E4"
                    strokeDasharray="6 6"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* Radar Pin */}
                <div className="absolute top-[250px] left-[165px] -translate-x-1/2 -translate-y-1/2">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-28 w-28 rounded-full bg-[#0660E4]/20 animate-ping" />
                    <div className="absolute h-14 w-14 rounded-full bg-[#0660E4]/30" />
                    <div className="relative h-7 w-7 rounded-full bg-[#0660E4] text-white flex items-center justify-center shadow-lg">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Active Pro Markers */}
                <div className="absolute top-[175px] left-[42px] bg-white px-2.5 py-1 rounded-full shadow-md border border-[#E2E8F0] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#0660E4] text-white flex items-center justify-center text-[10px] font-bold">
                    KA
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold leading-tight text-[#0B1C30]">
                      Kuya Arnel
                    </span>
                    <span className="text-[8px] text-[#10B981] font-semibold flex items-center gap-0.5 tabular-nums">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Plumber 4.9★
                    </span>
                  </div>
                </div>

                <div className="absolute top-[305px] right-[26px] bg-white px-2.5 py-1 rounded-full shadow-md border border-[#E2E8F0] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center text-[10px] font-bold">
                    KD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold leading-tight text-[#0B1C30]">
                      Kuya Dennis
                    </span>
                    <span className="text-[8px] text-[#10B981] font-semibold flex items-center gap-0.5 tabular-nums">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Locksmith 5.0★
                    </span>
                  </div>
                </div>
              </div>

              {/* Top In-App Status Bar */}
              <div className="relative z-10 px-4 py-2 flex items-center justify-between">
                <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#E2E8F0] shadow-xs flex items-center gap-1.5">
                  <img
                    alt="Serbify"
                    className="w-4 h-4 object-contain rounded-full"
                    src="/assets/serbify-mascot.png"
                  />
                  <span className="text-[11px] font-bold text-[#0660E4]">
                    Barangay San Antonio, Pasig
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/95 border border-[#E2E8F0] flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B1C30]" />
                </div>
              </div>

              {/* Draggable Bottom Sheet */}
              <div className="relative z-20 m-2 p-3 bg-white/95 backdrop-blur-xl rounded-[24px] border border-[#E2E8F0] shadow-xl flex flex-col gap-2.5">
                <div className="w-8 h-1 bg-[#CBD5E1] rounded-full mx-auto" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#0660E4] text-white flex items-center justify-center font-bold text-sm">
                        AR
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] ring-2 ring-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight text-[#0B1C30]">
                        Arnel Mendoza
                      </p>
                      <p className="text-[10px] text-[#64748B] tabular-nums">
                        Master Plumber • 830+ completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#0660E4] tabular-nums">
                      <CounterRollUp target={350} prefix="₱" suffix=" est." immediate duration={0.9} />
                    </span>
                    <p className="text-[9px] text-[#10B981] font-semibold">
                      GCash Protected
                    </p>
                  </div>
                </div>

                {/* ETA Progress Strip */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-[#0660E4]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#0B1C30] tabular-nums">
                        Arriving in{" "}
                        <CounterRollUp target={18} suffix=" mins" immediate duration={0.9} />
                      </span>
                      <span className="text-[8px] text-[#64748B]">
                        Along Shaw Blvd
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#065F46] text-[9px] font-bold">
                    En Route
                  </span>
                </div>

                {/* Action Bar */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setRelayMode((prev) => (prev === "call" ? "idle" : "call"))
                    }
                    className={`py-2 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      relayMode === "call"
                        ? "bg-[#10B981] text-white"
                        : "bg-[#F1F5F9] text-[#0B1C30] hover:bg-[#E2E8F0]"
                    }`}
                    type="button"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {relayMode === "call" ? "Calling in App..." : "Private Call"}
                  </button>
                  <button
                    onClick={() =>
                      setRelayMode((prev) => (prev === "chat" ? "idle" : "chat"))
                    }
                    className={`py-2 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      relayMode === "chat"
                        ? "bg-[#004AB4] text-white ring-2 ring-[#0660E4]/30"
                        : "bg-[#0660E4] text-white hover:bg-[#004AB4]"
                    }`}
                    type="button"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {relayMode === "chat" ? "Chat Active" : "In-App Chat"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </InteractivePhoneChassis>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
