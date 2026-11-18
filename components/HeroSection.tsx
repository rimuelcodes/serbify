"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
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
import { InteractivePhoneChassis } from "./three/InteractivePhoneChassis";

interface HeroSectionProps {
  persona: Persona;
}

const MASK_EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ persona }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const phoneFloatRef = useRef<HTMLDivElement>(null);
  const { lenis, prefersReducedMotion } = useLenis();
  const [relayMode, setRelayMode] = useState<"idle" | "call" | "chat">("idle");
  const t = COPY.en.hero[persona];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax depths for orbiting glassmorphic UI cards
  const cardVerifiedY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const cardPricingY = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const cardGpsY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 18]);

  // GSAP expo.out entrance stagger + gentle continuous levitation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const leftItems = heroRef.current?.querySelectorAll("[data-hero-stagger]");
      if (leftItems && leftItems.length > 0) {
        gsap.fromTo(
          leftItems,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "expo.out",
            clearProps: "transform",
          }
        );
      }

      const badges = heroRef.current?.querySelectorAll("[data-hero-badge]");
      if (badges && badges.length > 0) {
        gsap.fromTo(
          badges,
          { y: 16, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.09,
            delay: 0.25,
            ease: "expo.out",
            clearProps: "transform",
          }
        );
      }

      if (phoneFloatRef.current) {
        gsap.fromTo(
          phoneFloatRef.current,
          { y: 24, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
            onComplete: () => {
              if (!phoneFloatRef.current) return;
              gsap.to(phoneFloatRef.current, {
                y: -5,
                duration: 3.2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              });
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

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
        backgroundColor: "#F7F5F0",
        backgroundImage: `
          radial-gradient(58% 52% at 74% 48%, rgba(229, 152, 36, 0.07) 0%, rgba(229, 152, 36, 0) 70%),
          radial-gradient(65% 60% at 15% 85%, #EFECE6 0%, rgba(239, 236, 230, 0) 72%)
        `,
      }}
      className="relative w-full overflow-x-clip"
    >
      {/* Whisper-quiet warm architectural grid fading toward edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(24, 24, 27, 0.032) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 24, 27, 0.032) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 75% 68% at 62% 46%, black 15%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 68% at 62% 46%, black 15%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 pt-32 md:pt-36 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial & Value Prop on Calm Uninterrupted Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-6 z-10">
            {/* Live Pill */}
            <div
              data-hero-stagger
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/86 backdrop-blur-md border border-[#18181B]/[0.07] w-fit shadow-[0_12px_28px_-8px_rgba(28,25,23,0.07)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#117A58] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#117A58]" />
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${persona}-pill`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs font-bold tracking-tight text-[#121726]"
                >
                  {t.livePill}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Display Headline: Obsidian Ink with Typographic Rhythm */}
            <div data-hero-stagger>
              <KineticHeadline
                as="h1"
                immediate
                triggerKey={persona}
                className="text-[38px] leading-[44px] sm:text-5xl md:text-[56px] md:leading-[62px] tracking-[-0.035em] text-[#121726]"
                lines={[
                  { text: t.titleTop, className: "font-extrabold text-[#121726]" },
                  {
                    text: t.titleAccent,
                    className: "font-semibold text-[#2C3446]",
                  },
                ]}
              />
            </div>

            {/* Subheadline */}
            <div data-hero-stagger>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${persona}-sub`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: MASK_EASE }}
                  className="text-base md:text-lg text-[#4B5565] max-w-xl leading-relaxed"
                >
                  {t.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Dual CTA Cluster */}
            <div
              data-hero-stagger
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
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_12px_28px_rgba(6,96,228,0.24)] transition-colors w-full sm:w-auto"
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
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/90 border border-[#18181B]/[0.08] hover:bg-[#EFECE6] text-[#121726] text-sm font-bold shadow-[0_8px_20px_-6px_rgba(28,25,23,0.06)] transition-colors"
              >
                <BadgeCheck className="w-4 h-4 text-[#117A58]" />
                <span>{t.ctaSecondary}</span>
              </motion.a>
            </div>

            {/* Trust Micro-bar */}
            <div
              data-hero-stagger
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
            >
              {[
                {
                  icon: BadgeCheck,
                  color: "text-[#117A58]",
                  bg: "bg-[#E6F4EF]",
                  text: t.trust1,
                },
                {
                  icon: Wallet,
                  color: "text-[#0660E4]",
                  bg: "bg-[#EAF1FD]",
                  text: t.trust2,
                },
                {
                  icon: Star,
                  color: "text-[#E59824] fill-current",
                  bg: "bg-[#FDF4E3]",
                  text: t.trust3,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3.5 rounded-[16px] bg-white/86 backdrop-blur-md border border-[#18181B]/[0.07] shadow-[0_12px_28px_-10px_rgba(28,25,23,0.06)]"
                  >
                    <span
                      className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </span>
                    <span className="text-xs font-bold text-[#121726] tabular-nums">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Tactile Smartphone Mockup Cluster + Harmonized Orbiting Callouts */}
          <motion.div
            style={{ y: phoneY }}
            className="lg:col-span-5 relative flex items-center justify-center pt-4 lg:pt-0"
          >
            {/* Sunlit Warm Glow behind Smartphone Stage */}
            <div
              aria-hidden="true"
              className="absolute w-80 h-80 sm:w-[440px] sm:h-[440px] rounded-full bg-[#E59824]/[0.10] blur-3xl pointer-events-none"
            />

            <div ref={phoneFloatRef}>
              <InteractivePhoneChassis
                maxTilt={6}
                scrollTilt
                badges={
                  <>
                    {/* Floating Callout 1: ID-Verified Pro */}
                    <motion.div
                      data-hero-badge
                      style={{ y: cardVerifiedY, transform: "translateZ(42px)" }}
                      className="absolute top-16 -left-4 xl:-left-14 bg-white/88 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#18181B]/[0.07] shadow-[0_20px_44px_-12px_rgba(28,25,23,0.1)] z-30 hidden sm:flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#E6F4EF] text-[#117A58] flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#121726]">
                          {t.floatingCards.verified}
                        </span>
                        <span className="text-[10px] text-[#4B5565]">
                          {t.floatingCards.verifiedSub}
                        </span>
                      </div>
                    </motion.div>

                    {/* Floating Callout 2: Upfront Pricing */}
                    <motion.div
                      data-hero-badge
                      style={{ y: cardPricingY, transform: "translateZ(62px)" }}
                      className="absolute -bottom-3 -left-2 sm:-left-12 bg-white/88 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#18181B]/[0.07] shadow-[0_20px_44px_-12px_rgba(28,25,23,0.1)] max-w-[230px] z-30 hidden sm:flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FDF4E3] text-[#E59824] flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#121726]">
                          {t.floatingCards.pricing}
                        </span>
                        <span className="text-[10px] text-[#4B5565] tabular-nums">
                          {t.floatingCards.pricingSub}
                        </span>
                      </div>
                    </motion.div>

                    {/* Floating Callout 3: Live Map Tracking */}
                    <motion.div
                      data-hero-badge
                      style={{ y: cardGpsY, transform: "translateZ(54px)" }}
                      className="absolute top-10 -right-2 xl:-right-12 bg-white/88 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#18181B]/[0.07] shadow-[0_20px_44px_-12px_rgba(28,25,23,0.1)] z-30 hidden sm:flex items-center gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#EAF1FD] text-[#0660E4] flex items-center justify-center shrink-0">
                        <Radar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#121726]">
                          {t.floatingCards.gps}
                        </span>
                        <span className="text-[10px] text-[#117A58] font-semibold tabular-nums flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#117A58]" />
                          {t.floatingCards.gpsSub}
                        </span>
                      </div>
                    </motion.div>
                  </>
                }
              >
                {/* Brushed Dark-Titanium Phone Chassis */}
                <div className="relative w-[300px] sm:w-[340px] h-[610px] sm:h-[650px] bg-[#181C26] rounded-[44px] p-3 shadow-[0_30px_60px_-15px_rgba(28,25,23,0.22)] ring-1 ring-white/15 flex flex-col justify-between overflow-hidden">
                  {/* Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#121726] rounded-full z-30 flex items-center justify-between px-3 border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-[#117A58] animate-pulse" />
                    <span className="text-[9px] text-white/80 font-mono">
                      SERBIFY LIVE
                    </span>
                  </div>

                  {/* Inner Screen (Warm Mineral Map) */}
                  <div className="relative w-full h-full bg-[#F7F5F0] rounded-[36px] overflow-hidden flex flex-col justify-between pt-10">
                    {/* Stylized Vector Map */}
                    <div className="absolute inset-0 bg-[#EFECE6]">
                      <svg
                        className="w-full h-full opacity-75"
                        fill="none"
                        viewBox="0 0 350 660"
                      >
                        <path
                          d="M-20 280 C60 270, 140 330, 220 300 C270 280, 310 290, 380 270"
                          stroke="#D6D1C7"
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
                          opacity="0.35"
                          r="90"
                          stroke="#0660E4"
                          strokeDasharray="4 4"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="185"
                          cy="275"
                          opacity="0.18"
                          r="140"
                          stroke="#0660E4"
                          strokeDasharray="6 6"
                          strokeWidth="1.5"
                        />
                      </svg>

                      {/* Active Route Pin */}
                      <div className="absolute top-[250px] left-[165px] -translate-x-1/2 -translate-y-1/2">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-28 w-28 rounded-full bg-[#0660E4]/18 animate-ping" />
                          <div className="absolute h-14 w-14 rounded-full bg-[#0660E4]/25" />
                          <div className="relative h-7 w-7 rounded-full bg-[#0660E4] text-white flex items-center justify-center shadow-lg">
                            <Home className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Active Pro Markers (Unobstructed) */}
                      <div className="absolute top-[175px] left-[42px] bg-white px-2.5 py-1 rounded-full shadow-md border border-[#18181B]/[0.08] flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#0660E4] text-white flex items-center justify-center text-[10px] font-bold">
                          KA
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold leading-tight text-[#121726]">
                            Kuya Arnel
                          </span>
                          <span className="text-[8px] text-[#117A58] font-semibold flex items-center gap-0.5 tabular-nums">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Plumber
                            4.9★
                          </span>
                        </div>
                      </div>

                      <div className="absolute top-[305px] right-[26px] bg-white px-2.5 py-1 rounded-full shadow-md border border-[#18181B]/[0.08] flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#E59824] text-white flex items-center justify-center text-[10px] font-bold">
                          KD
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold leading-tight text-[#121726]">
                            Kuya Dennis
                          </span>
                          <span className="text-[8px] text-[#117A58] font-semibold flex items-center gap-0.5 tabular-nums">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Locksmith
                            5.0★
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top In-App Status Bar */}
                    <div className="relative z-10 px-4 py-2 flex items-center justify-between">
                      <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#18181B]/[0.08] shadow-xs flex items-center gap-1.5">
                        <img
                          alt="Serbify"
                          className="w-4 h-4 object-contain rounded-full"
                          src="/assets/serbify-mascot.png"
                        />
                        <span className="text-[11px] font-bold text-[#121726]">
                          Barangay San Antonio, Pasig
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/95 border border-[#18181B]/[0.08] flex items-center justify-center shadow-xs">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#121726]" />
                      </div>
                    </div>

                    {/* Draggable Bottom Sheet */}
                    <div className="relative z-20 m-2 p-3 bg-white/96 backdrop-blur-xl rounded-[24px] border border-[#18181B]/[0.08] shadow-xl flex flex-col gap-2.5">
                      <div className="w-8 h-1 bg-[#D6D1C7] rounded-full mx-auto" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-[#0660E4] text-white flex items-center justify-center font-bold text-sm">
                              AR
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#117A58] ring-2 ring-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight text-[#121726]">
                              Arnel Mendoza
                            </p>
                            <p className="text-[10px] text-[#4B5565] tabular-nums">
                              Master Plumber • 830+ completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-[#121726] tabular-nums">
                            <CounterRollUp
                              target={350}
                              prefix="₱"
                              suffix=" est."
                              immediate
                              duration={0.9}
                            />
                          </span>
                          <p className="text-[9px] text-[#117A58] font-semibold">
                            GCash Protected
                          </p>
                        </div>
                      </div>

                      {/* ETA Progress Strip */}
                      <div className="bg-[#F7F5F0] border border-[#18181B]/[0.07] p-2 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Navigation className="w-4 h-4 text-[#0660E4]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#121726] tabular-nums">
                              Arriving in{" "}
                              <CounterRollUp
                                target={18}
                                suffix=" mins"
                                immediate
                                duration={0.9}
                              />
                            </span>
                            <span className="text-[8px] text-[#4B5565]">
                              Along Shaw Blvd
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#E6F4EF] text-[#117A58] text-[9px] font-bold">
                          En Route
                        </span>
                      </div>

                      {/* Action Bar */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            setRelayMode((prev) =>
                              prev === "call" ? "idle" : "call"
                            )
                          }
                          className={`py-2 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            relayMode === "call"
                              ? "bg-[#117A58] text-white"
                              : "bg-[#EFECE6] text-[#121726] hover:bg-[#E5E0D7]"
                          }`}
                          type="button"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {relayMode === "call"
                            ? "Calling in App..."
                            : "Private Call"}
                        </button>
                        <button
                          onClick={() =>
                            setRelayMode((prev) =>
                              prev === "chat" ? "idle" : "chat"
                            )
                          }
                          className={`py-2 rounded-full text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                            relayMode === "chat"
                              ? "bg-[#044BB5] text-white ring-2 ring-[#0660E4]/30"
                              : "bg-[#0660E4] text-white hover:bg-[#044BB5]"
                          }`}
                          type="button"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {relayMode === "chat"
                            ? "Chat Active"
                            : "In-App Chat"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </InteractivePhoneChassis>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
