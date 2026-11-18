"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { FourActJourneyStage } from "@/components/FourActJourneyStage";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";
import { useLenis } from "@/components/LenisProvider";
import type { Persona } from "@/components/SerbifyCopy";
import { SerbifyGameStage } from "@/components/SerbifyGameStage";

export default function HomePage() {
  const [persona, setPersona] = useState<Persona>("client");
  const [inLanding, setInLanding] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const { lenis } = useLenis();

  useEffect(() => {
    const gameEl = document.getElementById("game-stage");
    if (!gameEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInLanding(!entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(gameEl);
    return () => observer.disconnect();
  }, []);

  const handleSkipToSite = useCallback(() => {
    const target = document.getElementById("landing-experience");
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: 0 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [lenis]);

  const handleReplayDemo = useCallback(() => {
    setResetSignal((n) => n + 1);
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [lenis]);

  return (
    <div className="min-h-screen bg-[#E7EEF8] text-[#0B1C30]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#0660E4] focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <AnimatePresence>
        {inLanding && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <FloatingNavbar persona={persona} setPersona={setPersona} />
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        <SerbifyGameStage
          onSkipToSite={handleSkipToSite}
          resetSignal={resetSignal}
        />

        <div id="landing-experience">
          <HeroSection persona={persona} />
          <FourActJourneyStage />
          <LandingSections persona={persona} setPersona={setPersona} />
        </div>
      </main>

      <AnimatePresence>
        {inLanding && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            onClick={handleReplayDemo}
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-xs font-bold shadow-[0_12px_28px_rgba(6,96,228,0.34)] active:scale-95 transition-all cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Play Interactive Demo</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
