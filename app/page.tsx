"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#FBF8F1] text-[#121726]">
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
            <FloatingNavbar />
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        <SerbifyGameStage
          onSkipToSite={handleSkipToSite}
          resetSignal={resetSignal}
        />

        <div id="landing-experience" className="flex flex-col gap-8 md:gap-12 pt-8 md:pt-12">
          <HeroSection persona={persona} />
          <FourActJourneyStage onOpenDemo={handleReplayDemo} />
          <LandingSections persona={persona} setPersona={setPersona} />
        </div>
      </main>
    </div>
  );
}
