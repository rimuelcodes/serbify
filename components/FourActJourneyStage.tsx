"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Gavel,
  Navigation,
  Pause,
  Play,
  Radar,
  Receipt,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { useLenis } from "./LenisProvider";
import { KineticHeadline } from "./KineticPrimitives";
import { SerbifyPhoneScreens } from "./SerbifyPhoneScreens";
import { SPRING_TACTILE } from "./serbifyTheme";
import { InteractivePhoneChassis } from "./three/InteractivePhoneChassis";

const AUTOPLAY_MS = 5500;

interface ActMeta {
  num: string;
  label: string;
  title: string;
  description: string;
  telemetry: string;
}

const ACTS_COPY: ActMeta[] = [
  {
    num: "01",
    label: "Pin & Match",
    title: "Pin Your Exact Address & Match a Pro",
    description:
      "Drop a pin right at your gate or barangay so your pro finds you with zero confusion. Compare upfront starting rates or quotes from ID & NBI-checked pros.",
    telemetry: "Kapitolyo, Pasig • 9 Pros Nearby",
  },
  {
    num: "02",
    label: "Live Arrival",
    title: "Live Map Tracking & Lobby Check-In",
    description:
      "Watch your pro travel across Metro Manila with live arrival updates and safe in-app chat. Get an instant arrival alert without sharing your personal mobile number.",
    telemetry: "Along Shaw Blvd • 12 mins away",
  },
  {
    num: "03",
    label: "Verified Work",
    title: "Agreed Scope & Photo Check",
    description:
      "Follow a live job timer and chat safely inside the app while your pro finishes the agreed work. Inspect before-and-after photos and check off every item.",
    telemetry: "Timer 00:18:42 • 3/3 Checks Passed",
  },
  {
    num: "04",
    label: "Safe Payment",
    title: "Pay Safely After the Job is Done",
    description:
      "Pay smoothly via GCash, Maya, QR Ph, debit/credit card, or cash with zero hidden fees. Your payment is held safely and released only once you approve the work.",
    telemetry: "₱450.00 Paid • Protected",
  },
];

const PAYMENT_RAILS = ["GCash", "Maya", "QR Ph", "Card", "Cash"] as const;

export function FourActJourneyStage() {
  const { prefersReducedMotion } = useLenis();
  const [activeAct, setActiveAct] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Per-act interactive sub-toggles
  const [act1Mode, setAct1Mode] = useState<"radar" | "bids">("radar");
  const [act2Mode, setAct2Mode] = useState<"en_route" | "arrived">("en_route");
  const [act3Mode, setAct3Mode] = useState<"in_progress" | "job_done">("in_progress");
  const [act4View, setAct4View] = useState<"checkout" | "receipt">("checkout");
  const [selectedRail, setSelectedRail] = useState<string>("GCash");

  const acts = ACTS_COPY;
  const currentAct = acts[activeAct];

  // Auto-Play tour interval (pauses automatically on user interaction)
  useEffect(() => {
    if (!isAutoPlay || prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setActiveAct((prev) => (prev + 1) % 4);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isAutoPlay, prefersReducedMotion]);

  const pauseTourOnInteraction = () => {
    if (isAutoPlay) setIsAutoPlay(false);
  };

  // Map 4 Acts + sub-toggles -> SerbifyPhoneScreens step index
  let phoneStep = 1;
  if (activeAct === 0) phoneStep = 1;
  else if (activeAct === 1) phoneStep = act2Mode === "en_route" ? 3 : 4;
  else if (activeAct === 2) phoneStep = act3Mode === "in_progress" ? 5 : 6;
  else if (activeAct === 3) phoneStep = act4View === "checkout" ? 7 : 8;

  return (
    <section
      id="book-flow"
      className="w-full bg-[#F6F7FA] border-y border-[#E2E8F0]/70"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 py-14 md:py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0660E4]">
            Simple 4-Step Booking
          </span>
          <KineticHeadline
            as="h2"
            className="mt-1.5 text-3xl md:text-[36px] md:leading-[44px] font-bold tracking-[-0.03em] text-[#0F172A]"
            lines={[
              {
                text: "From Pinning Your Home to Job Done.",
              },
            ]}
          />
        </div>

        {/* Auto-Play Tour Toggle */}
        <button
          type="button"
          onClick={() => setIsAutoPlay((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-colors self-start md:self-auto cursor-pointer ${
            isAutoPlay
              ? "bg-[#0660E4] text-white border-[#0660E4] shadow-xs"
              : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#0660E4]/50"
          }`}
        >
          {isAutoPlay ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Tour</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#0660E4] fill-current" />
              <span>Auto-Play Tour</span>
            </>
          )}
        </button>
      </div>

      {/* Main Cohesive Bento Stage */}
      <div
        onPointerDown={pauseTourOnInteraction}
        className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_16px_48px_rgba(11,28,48,0.05)] p-4 sm:p-6 md:p-8 flex flex-col gap-8"
      >
        {/* 1. Top Interactive Act Switcher (Pill Segmented Track) */}
        <div className="w-full overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          <div
            role="tablist"
            aria-label="Four-act customer journey"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                setIsAutoPlay(false);
                setActiveAct((prev) => (prev + 1) % 4);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setIsAutoPlay(false);
                setActiveAct((prev) => (prev + 3) % 4);
              }
            }}
            className="inline-flex md:grid md:grid-cols-4 w-max md:w-full p-1.5 bg-[#F1F5F9] rounded-full border border-[#E2E8F0] gap-1"
          >
            {acts.map((act, idx) => {
              const active = activeAct === idx;
              return (
                <button
                  key={act.num}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setActiveAct(idx);
                  }}
                  className={`relative px-4 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
                    active
                      ? "text-[#0B1C30]"
                      : "text-[#64748B] hover:text-[#0B1C30]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="four-act-pill"
                      transition={SPRING_TACTILE}
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-[#E2E8F0] overflow-hidden"
                    >
                      {isAutoPlay && !prefersReducedMotion && (
                        <motion.span
                          key={`progress-${activeAct}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: AUTOPLAY_MS / 1000,
                            ease: "linear",
                          }}
                          style={{ originX: 0 }}
                          className="absolute bottom-0 inset-x-3 h-[2px] bg-[#0660E4] rounded-full"
                        />
                      )}
                    </motion.span>
                  )}
                  <span
                    className={`relative z-10 tabular-nums px-1.5 py-0.5 rounded-full text-[10px] ${
                      active
                        ? "bg-[#0660E4] text-white"
                        : "bg-[#E2E8F0] text-[#475569]"
                    }`}
                  >
                    {act.num}
                  </span>
                  <span className="relative z-10">{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Split Dual-Pane Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Editorial Context & Interactive Micro-Controls */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAct}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={SPRING_TACTILE}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0660E4]/10 text-[#0660E4] text-[11px] font-bold tabular-nums">
                    Step {currentAct.num} / 04
                  </span>
                  <span className="text-xs font-medium text-[#64748B] tabular-nums">
                    {currentAct.telemetry}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#0F172A]">
                  {currentAct.title}
                </h3>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  {currentAct.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Act-Specific Interactive Sub-Toggles */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Try Each Step
              </span>

              {activeAct === 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setAct1Mode("radar")}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      act1Mode === "radar"
                        ? "bg-[#0660E4] text-white border-[#0660E4]"
                        : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#0660E4]"
                    }`}
                  >
                    <Radar className="w-3.5 h-3.5" />
                    Find Nearby Pros
                  </button>
                  <button
                    type="button"
                    onClick={() => setAct1Mode("bids")}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      act1Mode === "bids"
                        ? "bg-[#7C5CFC] text-white border-[#7C5CFC]"
                        : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#7C5CFC]"
                    }`}
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    Compare Quotes for Bigger Jobs
                  </button>
                </div>
              )}

              {activeAct === 1 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setAct2Mode("en_route")}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      act2Mode === "en_route"
                        ? "bg-[#D1FAE5] text-[#059669] border-[#10B981]/50"
                        : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#10B981]"
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    On the Way (12 mins)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAct2Mode("arrived")}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      act2Mode === "arrived"
                        ? "bg-[#10B981] text-white border-[#10B981]"
                        : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#10B981]"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Pro Arrived
                  </button>
                </div>
              )}

              {activeAct === 2 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setAct3Mode("in_progress")}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      act3Mode === "in_progress"
                        ? "bg-[#7C5CFC] text-white border-[#7C5CFC]"
                        : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#7C5CFC]"
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Live Timer &amp; Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setAct3Mode("job_done")}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      act3Mode === "job_done"
                        ? "bg-[#10B981] text-white border-[#10B981]"
                        : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#10B981]"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completion Checklist
                  </button>
                </div>
              )}

              {activeAct === 3 && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {PAYMENT_RAILS.map((rail) => {
                      const active = selectedRail === rail;
                      return (
                        <button
                          key={rail}
                          type="button"
                          onClick={() => {
                            setSelectedRail(rail);
                            setAct4View("checkout");
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                            active
                              ? "bg-[#0660E4] text-white border-[#0660E4]"
                              : "bg-white text-[#0B1C30] border-[#E2E8F0] hover:border-[#0660E4]"
                          }`}
                        >
                          {rail}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setAct4View((v) =>
                          v === "checkout" ? "receipt" : "checkout"
                        )
                      }
                      className="text-xs font-bold text-[#0660E4] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {act4View === "checkout"
                        ? "Preview 5-Star Rating & Receipt →"
                        : "← Back to Payment Options"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Flutter Phone + Floating Glassmorphic Satellite Card */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-2">
            <div className="scale-[0.84] sm:scale-[0.94] lg:scale-100 origin-center -my-10 sm:-my-4 lg:my-0">
              <InteractivePhoneChassis
                maxTilt={6}
                scrollTilt={false}
                badges={
                  <AnimatePresence mode="wait">
                    {activeAct === 0 && (
                      <motion.div
                        key="sat-act-1"
                        initial={{ opacity: 0, x: 16, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.94 }}
                        transition={SPRING_TACTILE}
                        style={{ transform: "translateZ(46px)" }}
                        className="hidden sm:flex absolute top-16 -right-8 xl:-right-12 bg-white/95 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#E2E8F0] shadow-[0_14px_34px_rgba(11,28,48,0.1)] items-center gap-2.5 z-30"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#0F172A]">
                            Gov&apos;t ID + NBI Verified
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            Selfie Check Passed
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {activeAct === 1 && (
                      <motion.div
                        key="sat-act-2"
                        initial={{ opacity: 0, x: -16, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.94 }}
                        transition={SPRING_TACTILE}
                        style={{ transform: "translateZ(46px)" }}
                        className="hidden sm:flex absolute bottom-20 -left-8 xl:-left-12 bg-white/95 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#E2E8F0] shadow-[0_14px_34px_rgba(11,28,48,0.1)] items-center gap-2.5 z-30"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#0660E4]/10 text-[#0660E4] flex items-center justify-center shrink-0">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#0F172A] tabular-nums">
                            {act2Mode === "en_route"
                              ? "12 mins away • 1.8 km"
                              : "Lobby Gate Checked In"}
                          </span>
                          <span className="text-[10px] text-[#065F46] font-semibold">
                            Private In-App Chat
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {activeAct === 2 && (
                      <motion.div
                        key="sat-act-3"
                        initial={{ opacity: 0, y: 14, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.94 }}
                        transition={SPRING_TACTILE}
                        style={{ transform: "translateZ(50px)" }}
                        className="hidden sm:flex flex-col gap-1.5 absolute bottom-10 -right-8 xl:-right-14 w-[200px] bg-white/95 backdrop-blur-xl p-2 rounded-[20px] border border-[#E2E8F0] shadow-[0_16px_40px_rgba(11,28,48,0.12)] z-30"
                      >
                        <div className="w-full rounded-xl overflow-hidden bg-[#F8FAFC] aspect-video border border-[#E2E8F0]">
                          {prefersReducedMotion ? (
                            <img
                              src="/animations/serbify-job-done-poster.jpg"
                              alt="Technician completing home repair"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src="/animations/serbify-job-done.mp4"
                              poster="/animations/serbify-job-done-poster.jpg"
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover block"
                            />
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-[#0F172A] px-1 flex items-center justify-between">
                          <span>Live Job Proof</span>
                          <span className="text-[#10B981]">Verified</span>
                        </span>
                      </motion.div>
                    )}

                    {activeAct === 3 && (
                      <motion.div
                        key="sat-act-4"
                        initial={{ opacity: 0, x: 16, scale: 0.92 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.94 }}
                        transition={SPRING_TACTILE}
                        style={{ transform: "translateZ(46px)" }}
                        className="hidden sm:flex absolute bottom-16 -right-8 xl:-right-12 bg-white/95 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-[#10B981]/50 shadow-[0_14px_34px_rgba(11,28,48,0.1)] items-center gap-2.5 z-30"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
                          {act4View === "receipt" ? (
                            <Receipt className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[#0F172A] tabular-nums">
                            ₱450.00 Paid • {selectedRail}
                          </span>
                          <span className="text-[10px] text-[#065F46] font-semibold">
                            Released After Approval
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
              >
                <SerbifyPhoneScreens
                  activeStep={phoneStep}
                  badgeLabel={`Step ${currentAct.num}/04`}
                  paymentRail={selectedRail}
                  onSelectPaymentRail={setSelectedRail}
                  bidMode={activeAct === 0 && act1Mode === "bids"}
                />
              </InteractivePhoneChassis>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
