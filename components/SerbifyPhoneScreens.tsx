"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  KeyRound,
  Lock,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Wrench,
  Zap,
} from "lucide-react";
import { SPRING_TACTILE } from "./serbifyTheme";

interface SerbifyPhoneScreensProps {
  activeStep: number;
  badgeLabel?: string;
  paymentRail?: string;
  onSelectPaymentRail?: (rail: string) => void;
  bidMode?: boolean;
}

export function SerbifyPhoneScreens({
  activeStep,
  badgeLabel,
  paymentRail,
  onSelectPaymentRail,
  bidMode = false,
}: SerbifyPhoneScreensProps) {
  return (
    <div className="relative mx-auto w-[290px] sm:w-[325px] h-[590px] sm:h-[630px] bg-slate-900 rounded-[44px] p-2.5 shadow-[0_24px_60px_-15px_rgba(11,28,48,0.22)] ring-1 ring-slate-800 flex flex-col overflow-hidden select-none shrink-0">
      {/* Dynamic Island */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
        <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
        <span className="text-[9px] text-white/80 font-mono tracking-wider">
          SERBIFY
        </span>
      </div>

      {/* Screen Container */}
      <div className="relative w-full h-full bg-[#F8FAFC] rounded-[36px] overflow-hidden flex flex-col pt-10">
        {/* Top App Bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src="/assets/serbify-mascot.png"
              alt="Serbify"
              className="w-4 h-4 rounded-full object-contain shrink-0"
            />
            <span className="text-[11px] font-bold text-[#0B1C30] truncate">
              Brgy. San Antonio, Pasig
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#065F46] text-[9px] font-bold tabular-nums shrink-0">
            {badgeLabel ?? `Step ${activeStep + 1}/9`}
          </span>
        </div>

        {/* Animated Step Body */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeStep}-${bidMode ? "bids" : "std"}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={SPRING_TACTILE}
              className="h-full w-full p-3.5 flex flex-col justify-between"
            >
              {activeStep === 0 && <StepDiscovery />}
              {activeStep === 1 && (bidMode ? <StepCompetitiveBids /> : <StepRadarPinning />)}
              {activeStep === 2 && <StepMatchPro />}
              {activeStep === 3 && <StepEnRoute />}
              {activeStep === 4 && <StepArrived />}
              {activeStep === 5 && <StepInProgress />}
              {activeStep === 6 && <StepJobDone />}
              {activeStep === 7 && (
                <StepPayment
                  controlledRail={paymentRail}
                  onSelectRail={onSelectPaymentRail}
                />
              )}
              {activeStep === 8 && <StepCompleted paidVia={paymentRail} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepDiscovery() {
  const trades = [
    { name: "Locksmith Inspection", price: "₱80", eta: "12 mins", tag: "Base", icon: KeyRound },
    { name: "Plumbing & Leaks", price: "₱350", eta: "18 mins", tag: "Fast", icon: Wrench },
    { name: "Aircon Deep Wash", price: "₱550", eta: "Same Day", tag: "Popular", icon: Sparkles },
    { name: "Electrical Repair", price: "₱400", eta: "22 mins", tag: "Certified", icon: Zap },
  ];

  return (
    <div className="flex flex-col gap-2.5 h-full">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-[#0660E4] shrink-0" />
        <span className="text-[11px] font-medium text-[#64748B] truncate">
          Search aircon, plumber, locksmith...
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {trades.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#0660E4]/10 text-[#0660E4] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#0B1C30] truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-[#64748B] tabular-nums">
                    ETA {item.eta}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-extrabold text-[#0660E4] tabular-nums">
                  {item.price}
                </p>
                <span className="text-[9px] font-semibold text-[#475569]">
                  {item.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0660E4] text-white rounded-full py-2.5 px-4 text-center text-xs font-bold">
        Select Trade &amp; Pin Barangay
      </div>
    </div>
  );
}

function StepRadarPinning() {
  return (
    <div className="flex flex-col justify-between h-full gap-2.5">
      <div className="relative flex-1 rounded-2xl border border-[#E2E8F0] bg-[#EAF1FF] overflow-hidden p-3 flex flex-col justify-between">
        <svg
          className="absolute inset-0 w-full h-full opacity-70"
          viewBox="0 0 300 320"
          fill="none"
        >
          <path
            d="M-10 140 C60 130, 140 180, 220 155 C260 140, 290 150, 320 140"
            stroke="#B1C5FF"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path d="M40 0 L170 320" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0 220 L300 190" stroke="#FFFFFF" strokeWidth="5" />
          <circle
            cx="150"
            cy="155"
            r="60"
            stroke="#0660E4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.45"
          />
          <circle
            cx="150"
            cy="155"
            r="98"
            stroke="#0660E4"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.25"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-between gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold">
            searching
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/95 border border-[#E2E8F0] text-[9px] font-bold text-[#0B1C30] tabular-nums">
            9 Pros Nearby
          </span>
        </div>

        {/* Animated Multi-Ring #0660E4 Radar */}
        <div className="relative z-10 self-center flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {[0, 0.5, 1].map((delay) => (
              <motion.span
                key={delay}
                initial={{ scale: 0.4, opacity: 0.7 }}
                animate={{ scale: 2.3, opacity: 0 }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  delay,
                  ease: "easeOut",
                }}
                className="absolute h-16 w-16 rounded-full border border-[#0660E4]/50 bg-[#0660E4]/10"
              />
            ))}
            <div className="relative w-8 h-8 rounded-full bg-[#0660E4] text-white flex items-center justify-center shadow-md">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <span className="mt-2 px-2.5 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[9px] font-bold text-[#0B1C30] tabular-nums">
            Pasig City • Pinned
          </span>
        </div>

        <div className="relative z-10 bg-white/95 border border-[#E2E8F0] rounded-xl p-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-[#475569]">
            Ortigas / Kapitolyo Area
          </span>
          <span className="text-[10px] font-bold text-[#0660E4]">Pinned</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3">
        <p className="text-[11px] font-bold text-[#0B1C30]">
          Barangay San Antonio, Pasig City
        </p>
        <p className="text-[10px] text-[#64748B] mt-0.5">
          Exact gate pinned so your pro arrives smoothly
        </p>
      </div>
    </div>
  );
}

function StepCompetitiveBids() {
  const bids = [
    {
      initials: "JB",
      name: "Jun Bautista",
      trade: "Master Electrician • 4.9★",
      price: "₱1,200",
      note: "Includes breaker diagnostics",
      tone: "bg-[#7C5CFC]",
      recommended: false,
    },
    {
      initials: "RC",
      name: "Ramil Cruz",
      trade: "TESDA NC-II Pro • 5.0★",
      price: "₱1,450",
      note: "Same-day parts + 1yr warranty",
      tone: "bg-[#0660E4]",
      recommended: true,
    },
  ];

  return (
    <div className="flex flex-col justify-between h-full gap-2.5">
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full bg-[#7C5CFC]/12 text-[#7C5CFC] text-[9px] font-bold">
          Competitive Project Bids
        </span>
        <span className="text-[9px] font-bold text-[#64748B] tabular-nums">
          3 Verified Quotes
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {bids.map((b) => (
          <div
            key={b.name}
            className={`rounded-2xl border p-3 flex flex-col gap-2 ${
              b.recommended
                ? "bg-[#7C5CFC]/5 border-[#7C5CFC]/40"
                : "bg-white border-[#E2E8F0]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${b.tone}`}
                >
                  {b.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#0B1C30] truncate">
                    {b.name}
                  </p>
                  <p className="text-[9px] text-[#64748B] tabular-nums truncate">
                    {b.trade}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#7C5CFC] tabular-nums shrink-0">
                {b.price}
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#475569] pt-1 border-t border-[#E2E8F0]/70">
              <span>{b.note}</span>
              {b.recommended && (
                <span className="font-bold text-[#0660E4]">Top Match</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#7C5CFC] text-white rounded-full py-2.5 px-4 text-center text-xs font-bold">
        Compare &amp; Lock Winning Bid
      </div>
    </div>
  );
}

function StepMatchPro() {
  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-[#0660E4] text-white font-bold text-sm flex items-center justify-center">
              AM
            </div>
            <div>
              <p className="text-xs font-bold text-[#0B1C30]">
                Kuya Arnel Mendoza
              </p>
              <p className="text-[10px] text-[#64748B] tabular-nums">
                Aircon &amp; HVAC • 4.9★ (830+ jobs)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#0660E4] text-[9px] font-bold">
            confirmed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2">
            <p className="text-[9px] text-[#64748B]">Identity</p>
            <p className="text-[10px] font-bold text-[#065F46] flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-[#10B981]" /> PhilSys + NBI
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2">
            <p className="text-[9px] text-[#64748B]">Upfront Quote</p>
            <p className="text-xs font-extrabold text-[#0660E4] tabular-nums mt-0.5">
              ₱450 Fixed
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3">
        <p className="text-[10px] font-semibold text-[#475569]">
          ID-Verified Pro Sheet:
        </p>
        <ul className="mt-1.5 space-y-1 text-[10px] text-[#0B1C30]">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> 3D Liveness
            biometric match
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> ₱10,000 Serbify
            property cover
          </li>
        </ul>
      </div>

      <div className="bg-[#0660E4] text-white rounded-full py-2.5 px-4 text-center text-xs font-bold">
        Confirm Kuya Arnel • ₱450
      </div>
    </div>
  );
}

function StepEnRoute() {
  return (
    <div className="flex flex-col justify-between h-full gap-2.5">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0660E4]/10 text-[#0660E4] flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0B1C30] tabular-nums">
              Arriving in 12 mins
            </p>
            <p className="text-[10px] text-[#64748B]">
              Via Shaw Blvd • 1.8 km
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669] text-[9px] font-bold">
          en_route
        </span>
      </div>

      <div className="relative flex-1 rounded-2xl border border-[#E2E8F0] bg-[#EAF1FF] p-3 flex flex-col justify-between overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 280 220"
          fill="none"
        >
          {/* Route Base Track */}
          <path
            d="M35 170 Q 120 120, 235 55"
            stroke="#CBD5E1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Animated Curved Route Drawing */}
          <motion.path
            d="M35 170 Q 120 120, 235 55"
            stroke="#0660E4"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <circle cx="35" cy="170" r="6" fill="#0660E4" />
          <circle cx="235" cy="55" r="7" fill="#10B981" />
        </svg>

        {/* Moving Service Vehicle Icon along Route */}
        <motion.div
          initial={{ left: "12%", top: "74%" }}
          animate={{
            left: ["12%", "42%", "78%"],
            top: ["74%", "50%", "23%"],
          }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border-2 border-[#0660E4] shadow-md flex items-center justify-center text-[#0660E4]"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" />
        </motion.div>

        <div className="relative z-10 bg-white/95 border border-[#E2E8F0] rounded-xl p-2 text-[10px] text-[#0B1C30]">
          <span className="font-bold text-[#0660E4]">Kuya Arnel:</span> “OTW na
          po ma&apos;am, passing Capitol Commons now.”
        </div>
        <div className="relative z-10 self-center flex items-center gap-2 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-bold text-[#0B1C30] tabular-nums">
            Live Map Tracking Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="py-2 rounded-full bg-white border border-[#E2E8F0] text-[#0B1C30] text-[11px] font-bold flex items-center justify-center gap-1">
          <Phone className="w-3.5 h-3.5" /> Private Call
        </div>
        <div className="py-2 rounded-full bg-[#0660E4] text-white text-[11px] font-bold flex items-center justify-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" /> In-App Chat
        </div>
      </div>
    </div>
  );
}

function StepArrived() {
  return (
    <div className="flex flex-col justify-between h-full gap-3">
      {/* Live Push-Notification Banner Pop-Out */}
      <motion.div
        initial={{ opacity: 0, y: -22, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 440, damping: 24 }}
        className="bg-[#ECFDF5] border border-[#10B981]/50 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-md"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#065F46]">
              Kuya Arnel has arrived!
            </p>
            <p className="text-[10px] text-[#065F46]/80">
              At Lobby Gate • Selfie Check Verified
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white text-[#065F46] text-[9px] font-bold border border-[#10B981]/30">
          arrived
        </span>
      </motion.div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#64748B]">Condo / Village Pass ID</span>
          <span className="font-mono font-bold text-[#0B1C30]">SRB-9021</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#64748B]">Verified Trade Badge</span>
          <span className="font-bold text-[#10B981]">TESDA NC-II Active</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#64748B]">Phone Privacy</span>
          <span className="font-bold text-[#0B1C30]">Masked Relay</span>
        </div>
      </div>

      <div className="bg-[#0660E4] text-white rounded-full py-2.5 px-4 text-center text-xs font-bold">
        Start Job &amp; Lock Scope
      </div>
    </div>
  );
}

function StepInProgress() {
  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] text-[9px] font-bold">
              in_progress
            </span>
            <span className="text-[10px] text-[#64748B]">Live Timer</span>
          </div>
          <p className="text-xl font-extrabold text-[#0B1C30] tabular-nums mt-1">
            00:18:42
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] flex items-center justify-center">
          <Timer className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#0B1C30]">
            Agreed Scope &amp; Safety Hold
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#065F46] text-[9px] font-bold flex items-center gap-1">
            <Radio className="w-2.5 h-2.5" /> Live In-App Chat
          </span>
        </div>
        <p className="text-[10px] text-[#64748B]">
          Inverter aircon deep wash &amp; drain line flush. Before-photo saved
          for your peace of mind.
        </p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-2.5 flex items-center justify-between text-[10px]">
        <span className="text-[#475569]">Payment Held Safely</span>
        <span className="font-bold text-[#0660E4] tabular-nums">₱450.00 Held</span>
      </div>
    </div>
  );
}

function StepJobDone() {
  const checks = [
    "Cooling & airflow pressure verified",
    "Condensate drain leak test passed",
    "After-repair photo evidence uploaded",
  ];

  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div className="bg-white rounded-2xl border border-[#10B981]/40 p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0B1C30]">
            Completion Checklist
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#065F46] text-[9px] font-bold">
            3/3 Passed
          </span>
        </div>

        <div className="space-y-1.5">
          {checks.map((label, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ...SPRING_TACTILE, delay: idx * 0.12 }}
              className="p-2 rounded-xl bg-[#ECFDF5]/70 border border-[#10B981]/35 flex items-center justify-between text-[10px] font-medium text-[#0B1C30]"
            >
              <span className="truncate pr-2">{label}</span>
              <motion.span
                initial={{ scale: 0, rotate: -35 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 460,
                  damping: 20,
                  delay: 0.14 + idx * 0.12,
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#475569]">
          Total Locked Amount
        </span>
        <span className="text-sm font-extrabold text-[#0B1C30] tabular-nums">
          ₱450.00
        </span>
      </div>

      <div className="bg-[#10B981] text-white rounded-full py-2.5 px-4 text-center text-xs font-bold">
        Approve Work &amp; Proceed to Pay
      </div>
    </div>
  );
}

function StepPayment({
  controlledRail,
  onSelectRail,
}: {
  controlledRail?: string;
  onSelectRail?: (rail: string) => void;
}) {
  const [internalRail, setInternalRail] = useState("GCash");
  const [confirmed, setConfirmed] = useState(false);

  const selectedRail = controlledRail ?? internalRail;

  const rails = [
    { name: "GCash", sub: "Instant e-Wallet • Zero fee" },
    { name: "Maya", sub: "Maya Wallet • Instant" },
    { name: "QR Ph", sub: "Universal PH QR checkout" },
    { name: "Card", sub: "Debit / Credit Card" },
    { name: "Cash", sub: "Cash after job is done" },
  ];

  return (
    <div className="flex flex-col justify-between h-full gap-2">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-2.5 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-[#64748B]">Total to Pay</p>
          <p className="text-sm font-extrabold text-[#0B1C30] tabular-nums">
            ₱450.00
          </p>
        </div>
        <CreditCard className="w-4 h-4 text-[#0660E4]" />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {rails.map((rail) => {
          const active = selectedRail === rail.name;
          return (
            <button
              key={rail.name}
              type="button"
              onClick={() => {
                setInternalRail(rail.name);
                onSelectRail?.(rail.name);
                setConfirmed(false);
              }}
              className={`rounded-xl border px-2.5 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                active
                  ? "bg-[#0660E4]/5 border-[#0660E4]"
                  : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]"
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-[#0B1C30]">
                  {rail.name}
                </p>
                <p className="text-[8px] text-[#64748B]">{rail.sub}</p>
              </div>
              <span
                className={`w-3 h-3 rounded-full border shrink-0 ${
                  active
                    ? "border-[#0660E4] bg-[#0660E4]"
                    : "border-[#CBD5E1]"
                }`}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className={`rounded-full py-2 px-4 text-center text-[11px] font-bold tabular-nums transition-colors cursor-pointer ${
          confirmed
            ? "bg-[#10B981] text-white"
            : "bg-[#0660E4] hover:bg-[#004AB4] text-white"
        }`}
      >
        {confirmed
          ? `Confirmed via ${selectedRail} ✓`
          : `Release ₱450.00 via ${selectedRail}`}
      </button>
    </div>
  );
}

function StepCompleted({ paidVia = "GCash" }: { paidVia?: string }) {
  return (
    <div className="flex flex-col justify-between h-full gap-3">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 text-center flex flex-col items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[9px] font-bold">
          completed • {paidVia}
        </span>
        <div className="w-11 h-11 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mt-0.5">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-extrabold text-[#0B1C30]">
          Job Completed &amp; Paid
        </p>
        <p className="text-[10px] text-[#64748B] tabular-nums">
          ₱450.00 disbursed to Kuya Arnel
        </p>

        {/* Sequential 5-star #F59E0B rating burst */}
        <div className="flex items-center gap-1 pt-1 text-[#F59E0B]">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.2, y: 6, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 14,
                delay: 0.12 + i * 0.09,
              }}
            >
              <Star className="w-4 h-4 fill-current" />
            </motion.div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-[#0B1C30] tabular-nums">
          5.0★ Verified Client Rating
        </span>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3 flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1.5 font-semibold text-[#475569]">
          <Lock className="w-3.5 h-3.5 text-[#10B981]" /> ₱10,000 Warranty
        </span>
        <span className="font-bold text-[#0660E4] flex items-center gap-1">
          <Zap className="w-3 h-3" /> Instant Payout
        </span>
      </div>

      <div className="bg-white border border-[#E2E8F0] text-[#0B1C30] rounded-full py-2.5 px-4 text-center text-xs font-bold">
        Download Digital Receipt
      </div>
    </div>
  );
}
