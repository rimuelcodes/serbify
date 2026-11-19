"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  MapPin,
  Navigation,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { KineticHeadline, SectionCornerTicks } from "./KineticPrimitives";
import { useLenis } from "./LenisProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FourActJourneyStageProps {
  onOpenDemo?: () => void;
}

export function FourActJourneyStage({ onOpenDemo }: FourActJourneyStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { lenis, prefersReducedMotion } = useLenis();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll("[data-bento-card]");
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleDemoClick = () => {
    if (onOpenDemo) {
      onOpenDemo();
      return;
    }
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="book-flow"
      ref={sectionRef}
      className="w-full px-4 sm:px-6 lg:px-8"
    >
      <div
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 16px 36px -12px rgba(18, 23, 38, 0.06)",
        }}
        className="relative w-full max-w-[1240px] mx-auto rounded-[28px] bg-[#F4EFE4] border border-[#E4DEC9] p-8 md:p-12 lg:p-14"
      >
        <SectionCornerTicks />
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-[#121726]/[0.08]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0660E4]">
              Simple 4-Step Booking
            </span>
            <KineticHeadline
              as="h2"
              className="mt-1.5 text-3xl md:text-[36px] md:leading-[44px] font-bold tracking-[-0.03em] text-[#121726]"
              lines={[{ text: "From Pinning Your Home to Job Done." }]}
            />
          </div>

          <button
            type="button"
            onClick={handleDemoClick}
            className="group relative inline-flex items-center gap-1.5 py-1.5 text-sm font-bold text-[#0660E4] hover:text-[#044BB5] transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Try the 30s Interactive Demo</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="pointer-events-none absolute left-0 right-0 bottom-0.5 h-[1.5px] bg-[#0660E4] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>
        </div>

        {/* 4-Card Editorial Process Bento with Tarsi Schematic Workflow Connectors */}
        <div className="relative">
          {/* Desktop Animated SVG Schematic Connector Line (Pin Gate -> ID & NBI Check -> Live Arrival -> Safe Payment) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            className="pointer-events-none hidden lg:block absolute top-[46px] left-[8%] w-[84%] h-6 z-0"
          >
            <line
              x1="0"
              y1="12"
              x2="1200"
              y2="12"
              stroke="rgba(6, 96, 228, 0.22)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
            <line
              x1="0"
              y1="12"
              x2="1200"
              y2="12"
              stroke="rgba(6, 96, 228, 0.65)"
              strokeWidth="1.5"
              strokeDasharray="24 156"
              strokeLinecap="round"
              className="animate-schematic-pulse"
            />
          </svg>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 01 — Pin & Match */}
          <article
            data-bento-card
            className="bg-white border border-[#121726]/[0.08] hover:border-[#0660E4]/36 rounded-[22px] p-7 shadow-[0_16px_36px_-12px_rgba(18,23,38,0.06)] hover:-translate-y-[3px] hover:shadow-[0_18px_36px_-12px_rgba(6,96,228,0.09)] transition-all duration-300 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#EAF1FD] text-[#0660E4] text-xs font-bold tabular-nums">
                01
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#121726]">
                  Pin Your Exact Gate
                </h3>
                <p className="mt-2 text-sm text-[#4B5565] leading-relaxed">
                  Drop a pin in Brgy. San Antonio or anywhere in Metro Manila so
                  your pro arrives with zero confusion.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F7F3E8] border border-[#E6DEC8] p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#EAF1FD] text-[#0660E4] flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#121726] truncate">
                    Brgy. San Antonio, Pasig • Pinned
                  </p>
                  <p className="text-[10px] font-semibold text-[#0660E4] tabular-nums">
                    9 Pros Nearby
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Card 02 — Verified Work (ID & NBI Check) */}
          <article
            data-bento-card
            className="bg-white border border-[#121726]/[0.08] hover:border-[#0660E4]/36 rounded-[22px] p-7 shadow-[0_16px_36px_-12px_rgba(18,23,38,0.06)] hover:-translate-y-[3px] hover:shadow-[0_18px_36px_-12px_rgba(6,96,228,0.09)] transition-all duration-300 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#E6F4EF] text-[#117A58] text-xs font-bold tabular-nums">
                02
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#121726]">
                  ID &amp; NBI-Checked Pros
                </h3>
                <p className="mt-2 text-sm text-[#4B5565] leading-relaxed">
                  Every technician passes government ID, NBI clearance, and live
                  selfie verification before accepting jobs.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#E6F4EF] border border-[#117A58]/20 p-3.5 flex items-center gap-2.5 text-[#117A58]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="text-[11px] font-bold leading-snug">
                Gov&apos;t ID + NBI Verified • Selfie Check Passed
              </span>
            </div>
          </article>

          {/* Card 03 — Live Arrival */}
          <article
            data-bento-card
            className="bg-white border border-[#121726]/[0.08] hover:border-[#0660E4]/36 rounded-[22px] p-7 shadow-[0_16px_36px_-12px_rgba(18,23,38,0.06)] hover:-translate-y-[3px] hover:shadow-[0_18px_36px_-12px_rgba(6,96,228,0.09)] transition-all duration-300 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#EAF1FD] text-[#0660E4] text-xs font-bold tabular-nums">
                03
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#121726]">
                  Track Live Arrival
                </h3>
                <p className="mt-2 text-sm text-[#4B5565] leading-relaxed">
                  Follow your pro&apos;s real-time route to your door with
                  upfront pricing and zero hidden fees.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F7F3E8] border border-[#E6DEC8] p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#EAF1FD] text-[#0660E4] flex items-center justify-center shrink-0">
                  <Navigation className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-bold text-[#121726] truncate">
                  Kuya Arnel • En Route
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#E6F4EF] text-[#117A58] text-[10px] font-bold tabular-nums shrink-0">
                18 mins
              </span>
            </div>
          </article>

          {/* Card 04 — Safe Payment */}
          <article
            data-bento-card
            className="bg-white border border-[#121726]/[0.08] hover:border-[#0660E4]/36 rounded-[22px] p-7 shadow-[0_16px_36px_-12px_rgba(18,23,38,0.06)] hover:-translate-y-[3px] hover:shadow-[0_18px_36px_-12px_rgba(6,96,228,0.09)] transition-all duration-300 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FDF4E3] text-[#8A5609] text-xs font-bold tabular-nums">
                04
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] text-[#121726]">
                  Pay Safely After Completion
                </h3>
                <p className="mt-2 text-sm text-[#4B5565] leading-relaxed">
                  Release payment via GCash, Maya, Card, or Cash only once the
                  job is completed to your satisfaction.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FDF4E3] border border-[#E59824]/25 p-3.5 flex items-center gap-2.5 text-[#8A5609]">
              <Wallet className="w-4 h-4 text-[#E59824] shrink-0" />
              <span className="text-[11px] font-bold tabular-nums leading-snug">
                ₱350 Upfront • Protected via GCash &amp; Maya
              </span>
            </div>
          </article>
        </div>
        </div>
      </div>
    </section>
  );
}
