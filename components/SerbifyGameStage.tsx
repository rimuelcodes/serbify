"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  ArrowDown,
  ArrowRight,
  Bike,
  BookOpen,
  Bus,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Footprints,
  Home,
  KeyRound,
  MapPin,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  KineticHeadline,
  MagneticButton,
  TactileTokenBadge,
} from "./KineticPrimitives";
import { useLenis } from "./LenisProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

export type GameLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type ServiceKey = "plumber" | "electrician" | "locksmith";

interface ServiceOption {
  key: ServiceKey;
  label: string;
  price: string;
  accent: string;
  softBg: string;
  videoSrc: string;
  taskSummary: string;
  samplePrice: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceOption[] = [
  {
    key: "plumber",
    label: "Plumber",
    price: "from ₱150",
    accent: "#0660E4",
    softBg: "#EAF1FD",
    videoSrc: "/animations/job-plumber.mp4",
    taskSummary: "Under-sink leak & valve seal",
    samplePrice: "₱450",
    Icon: Wrench,
  },
  {
    key: "electrician",
    label: "Electrician",
    price: "from ₱150",
    accent: "#E59824",
    softBg: "#FDF4E3",
    videoSrc: "/animations/job-electrician.mp4",
    taskSummary: "Breaker check & outlet wiring",
    samplePrice: "₱480",
    Icon: Zap,
  },
  {
    key: "locksmith",
    label: "Locksmith",
    price: "from ₱80",
    accent: "#117A58",
    softBg: "#E6F4EF",
    videoSrc: "/animations/job-locksmith.mp4",
    taskSummary: "Door deadbolt & key cylinder",
    samplePrice: "₱350",
    Icon: KeyRound,
  },
];

interface StoryStepMeta {
  level: GameLevel;
  shortLabel: string;
  title: string;
  instruction: string;
  badge: string;
  telemetryTitle: string;
  telemetryValue: string;
}

const STORY_STEPS: StoryStepMeta[] = [
  {
    level: 1,
    shortLabel: "1. Pick Service",
    title: "Pick a Home Service",
    instruction:
      "Tap Plumber, Electrician, or Locksmith inside the phone—or choose a trade below to begin.",
    badge: "Upfront Rates",
    telemetryTitle: "Upfront Metro Manila Rates",
    telemetryValue: "From ₱80 • Zero Hidden Fees",
  },
  {
    level: 2,
    shortLabel: "2. Smart Match",
    title: "Smart Barangay Radar",
    instruction:
      "Serbify scans verified pros near your pinned street and locks in the closest match.",
    badge: "Live Matching",
    telemetryTitle: "Barangay Dispatch Scan",
    telemetryValue: "Checking 9 Verified Pros",
  },
  {
    level: 3,
    shortLabel: "3. ID & NBI Check",
    title: "ID & NBI-Verified Pro",
    instruction:
      "Review Kuya Arnel's government ID, NBI clearance, and upfront quote before he heads out.",
    badge: "99.4% Match Rate",
    telemetryTitle: "NBI & Gov ID Verified",
    telemetryValue: "99.4% Match Rate",
  },
  {
    level: 4,
    shortLabel: "4. Live Arrival",
    title: "Track Every Kilometer",
    instruction:
      "Follow your pro's live route across Metro Manila—from jeepney to doorstep—with 2x speed.",
    badge: "Real-Time ETA",
    telemetryTitle: "Shaw Blvd Corridor",
    telemetryValue: "1.8 km away • Live GPS",
  },
  {
    level: 5,
    shortLabel: "5. Job Complete",
    title: "Verified Work & Sign-Off",
    instruction:
      "Watch the repair wrap up cleanly. Inspect before releasing payment from safe escrow.",
    badge: "Scope Locked",
    telemetryTitle: "Photo & Checklist Sign-Off",
    telemetryValue: "Escrow Protected",
  },
  {
    level: 6,
    shortLabel: "6. Safe Payment",
    title: "Release Payment Safely",
    instruction:
      "Settle with GCash, Maya, card, or cash only once you confirm the job is done.",
    badge: "Zero Hidden Fees",
    telemetryTitle: "PH Payment Rails",
    telemetryValue: "GCash • Maya • Card • Cash",
  },
];

interface TransitStage {
  id: number;
  label: string;
  mode: string;
  isJeepney?: boolean;
  Icon: React.ComponentType<{ className?: string }>;
}

const TRANSIT_STAGES: TransitStage[] = [
  { id: 0, label: "Walking to main highway", mode: "Walking", Icon: Footprints },
  { id: 1, label: "Riding motorcycle", mode: "Motorcycle", Icon: Bike },
  { id: 2, label: "Driving on highway", mode: "Car", Icon: Car },
  { id: 3, label: "Taking city bus", mode: "Bus", Icon: Bus },
  {
    id: 4,
    label: "Riding Philippine Jeepney",
    mode: "Jeepney",
    isJeepney: true,
    Icon: Bus,
  },
  { id: 5, label: "Walking to your house", mode: "Walking", Icon: Footprints },
];

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

function JeepneyBadge({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="6" width="30" height="12" rx="3" fill="#E59824" />
      <rect x="4" y="4" width="24" height="3" rx="1.5" fill="#0660E4" />
      <rect x="5" y="8" width="6" height="5" rx="1" fill="#E0F2FE" />
      <rect x="13" y="8" width="6" height="5" rx="1" fill="#E0F2FE" />
      <rect x="21" y="8" width="6" height="5" rx="1" fill="#E0F2FE" />
      <path d="M2 14h30v2H2z" fill="#EF4444" />
      <path d="M2 16h30v1.5H2z" fill="#117A58" />
      <circle cx="9" cy="19" r="3" fill="#121726" />
      <circle cx="9" cy="19" r="1.2" fill="#E2E8F0" />
      <circle cx="25" cy="19" r="3" fill="#121726" />
      <circle cx="25" cy="19" r="1.2" fill="#E2E8F0" />
      <circle cx="31" cy="12" r="1.4" fill="#FEF08A" />
    </svg>
  );
}

interface SerbifyGameStageProps {
  onSkipToSite: () => void;
  onLevelChange?: (level: GameLevel) => void;
  resetSignal?: number;
}

export function SerbifyGameStage({
  onSkipToSite,
  onLevelChange,
  resetSignal = 0,
}: SerbifyGameStageProps) {
  const { lenis, prefersReducedMotion } = useLenis();

  const [demoStarted, setDemoStarted] = useState(false);
  const [level, setLevel] = useState<GameLevel>(1);
  const [selectedService, setSelectedService] = useState<ServiceOption>(
    SERVICES[0]
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState<"blog" | "guide" | null>(
    null
  );
  const [hoveredStep, setHoveredStep] = useState<GameLevel | null>(null);
  const [rewardPulseKey, setRewardPulseKey] = useState(0);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [tappedService, setTappedService] = useState<ServiceKey | null>(null);
  const [headerCondensed, setHeaderCondensed] = useState(false);
  const [autoPreviewPulse, setAutoPreviewPulse] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setHeaderCondensed(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Autonomous preview tap ripple on first service row while idle on hero
  useEffect(() => {
    if (demoStarted || level !== 1 || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setAutoPreviewPulse((n) => n + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, [demoStarted, level, prefersReducedMotion]);

  useEffect(() => {
    if (ctaHovered && !prefersReducedMotion) {
      setAutoPreviewPulse((n) => n + 1);
    }
  }, [ctaHovered, prefersReducedMotion]);

  // Level 2/3 radar state
  const [radarMatched, setRadarMatched] = useState(false);

  // Level 4 transit state
  const [transitStageIdx, setTransitStageIdx] = useState(0);
  const [transitProgress, setTransitProgress] = useState(0);
  const [transitArrived, setTransitArrived] = useState(false);
  const [doubleSpeed, setDoubleSpeed] = useState(false);

  // Level 5 job video state
  const [jobProgress, setJobProgress] = useState(0);
  const [jobFinished, setJobFinished] = useState(false);

  // Level 6 payment state
  const [paymentPhase, setPaymentPhase] = useState<
    "ready" | "sending" | "sent"
  >("ready");

  // Stage & Hardware Refs
  const stageRef = useRef<HTMLElement>(null);
  const phoneEntranceRef = useRef<HTMLDivElement>(null);
  const phoneLevitationRef = useRef<HTMLDivElement>(null);
  const phoneTiltRef = useRef<HTMLDivElement>(null);
  const phoneRecoilRef = useRef<HTMLDivElement>(null);
  const phoneScreenRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  // quickTo setters for smooth 60fps pointer-reactive 3D tilt
  const quickTiltX = useRef<gsap.QuickToFunc | null>(null);
  const quickTiltY = useRef<gsap.QuickToFunc | null>(null);
  const quickSheenX = useRef<gsap.QuickToFunc | null>(null);

  // Level-specific refs
  const transitVehicleRef = useRef<HTMLDivElement>(null);
  const transitPathRef = useRef<SVGPathElement>(null);
  const transitVideoRef = useRef<HTMLVideoElement>(null);
  const transitTlRef = useRef<gsap.core.Timeline | null>(null);
  const jobVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    onLevelChange?.(level);
  }, [level, onLevelChange]);

  // Master GSAP Stage Entrance, Levitation, Mascot Wave & quickTo Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (phoneTiltRef.current) {
        gsap.set(phoneTiltRef.current, {
          rotateY: -6,
          rotateX: 3,
          scale: 1,
        });
        quickTiltX.current = gsap.quickTo(phoneTiltRef.current, "rotateX", {
          duration: 0.45,
          ease: "power3.out",
        });
        quickTiltY.current = gsap.quickTo(phoneTiltRef.current, "rotateY", {
          duration: 0.45,
          ease: "power3.out",
        });
      }

      if (sheenRef.current) {
        quickSheenX.current = gsap.quickTo(sheenRef.current, "xPercent", {
          duration: 0.5,
          ease: "power3.out",
        });
      }

      if (prefersReducedMotion) return;

      // 1. Phone Entrance (0.0s - 0.8s)
      if (phoneEntranceRef.current) {
        gsap.fromTo(
          phoneEntranceRef.current,
          { y: 36, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
            clearProps: "transform",
          }
        );
      }

      // 2. Stagger-reveal inner phone cards with 0.06s cascade
      const innerCards = stageRef.current?.querySelectorAll("[data-phone-card]");
      if (innerCards && innerCards.length > 0) {
        gsap.fromTo(
          innerCards,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            delay: 0.35,
            ease: "power3.out",
            clearProps: "transform",
          }
        );
      }

      // 3. Continuous Idle Levitation on separate inner wrapper
      if (phoneLevitationRef.current) {
        gsap.to(phoneLevitationRef.current, {
          y: -6,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // 4. Mascot friendly 8deg wave on mount
      if (mascotRef.current) {
        gsap.fromTo(
          mascotRef.current,
          { rotate: -8 },
          {
            rotate: 8,
            duration: 0.35,
            ease: "power3.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              if (mascotRef.current) {
                gsap.to(mascotRef.current, {
                  rotate: 0,
                  duration: 0.25,
                  ease: "power3.out",
                });
              }
            },
          }
        );
      }
    }, stageRef);

    return () => {
      quickTiltX.current = null;
      quickTiltY.current = null;
      quickSheenX.current = null;
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // Cross-Component Magnetic CTA Coupling: straighten phone on Start CTA hover
  useEffect(() => {
    if (prefersReducedMotion || !phoneTiltRef.current) return;
    if (ctaHovered) {
      gsap.to(phoneTiltRef.current, {
        rotateY: 0,
        rotateX: 0,
        scale: 1.025,
        duration: 0.45,
        ease: "power3.out",
      });
    } else {
      gsap.to(phoneTiltRef.current, {
        rotateY: -6,
        rotateX: 3,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [ctaHovered, prefersReducedMotion]);

  // Hardware Haptic Micro-Recoil on level completion / transition
  const triggerHapticAndReward = useCallback(() => {
    setRewardPulseKey((k) => k + 1);
    if (prefersReducedMotion || !phoneRecoilRef.current) return;
    gsap.fromTo(
      phoneRecoilRef.current,
      { y: -3, rotateZ: 0.6 },
      {
        y: 0,
        rotateZ: 0,
        duration: 0.35,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [prefersReducedMotion]);

  const resetGame = useCallback(() => {
    setDemoStarted(false);
    setLevel(1);
    setTappedService(null);
    setRadarMatched(false);
    setTransitStageIdx(0);
    setTransitProgress(0);
    setTransitArrived(false);
    setDoubleSpeed(false);
    setJobProgress(0);
    setJobFinished(false);
    setPaymentPhase("ready");
  }, []);

  useEffect(() => {
    if (resetSignal > 0) {
      resetGame();
    }
  }, [resetSignal, resetGame]);

  // Pointer-reactive 3D tilt (±4.5deg around resting angle) + diagonal glass sheen
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (
        e.pointerType !== "mouse" ||
        prefersReducedMotion ||
        ctaHovered ||
        !stageRef.current
      )
        return;
      const rect = stageRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      quickTiltX.current?.(3 + Math.max(-4.5, Math.min(4.5, -ny * 9)));
      quickTiltY.current?.(-6 + Math.max(-4.5, Math.min(4.5, nx * 9)));
      quickSheenX.current?.(nx * 32);
    },
    [ctaHovered, prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (prefersReducedMotion || ctaHovered) return;
    quickTiltX.current?.(3);
    quickTiltY.current?.(-6);
    quickSheenX.current?.(0);
  }, [ctaHovered, prefersReducedMotion]);

  // Start Demo trigger
  const handleStartDemo = useCallback(() => {
    setDemoStarted(true);
    setLevel(1);
    setCtaHovered(false);
    triggerHapticAndReward();
    if (!prefersReducedMotion && phoneScreenRef.current) {
      gsap.fromTo(
        phoneScreenRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.45, ease: "expo.out", clearProps: "transform" }
      );
    }
  }, [prefersReducedMotion, triggerHapticAndReward]);

  const jumpToLevel = useCallback(
    (target: GameLevel) => {
      setDemoStarted(true);
      setLevel(target);
      triggerHapticAndReward();
      if (target === 2) {
        setRadarMatched(false);
      } else if (target === 3) {
        setRadarMatched(true);
      } else if (target === 6) {
        setPaymentPhase("ready");
      }
    },
    [triggerHapticAndReward]
  );

  // Tactile tap ripple on service selection inside phone -> Level 2
  const handleSelectService = useCallback(
    (service: ServiceOption) => {
      if (tappedService) return;
      setSelectedService(service);
      setTappedService(service.key);
      setTimeout(() => {
        setTappedService(null);
        setDemoStarted(true);
        setRadarMatched(false);
        setLevel(2);
        triggerHapticAndReward();
      }, 160);
    },
    [tappedService, triggerHapticAndReward]
  );

  // Level 2 -> Level 3: 1.6s live radar matching -> ID & NBI Check
  useEffect(() => {
    if (!demoStarted || level !== 2) return;
    setRadarMatched(false);
    const timer = setTimeout(() => {
      setRadarMatched(true);
      setLevel(3);
      triggerHapticAndReward();
    }, 1600);
    return () => clearTimeout(timer);
  }, [demoStarted, level, triggerHapticAndReward]);

  // Level 4: 12s (6 x 2s) Zigzag Highway Transit with GSAP MotionPathPlugin
  useEffect(() => {
    if (level !== 4) return;
    setTransitStageIdx(0);
    setTransitProgress(0);
    setTransitArrived(false);

    const ctx = gsap.context(() => {
      const marker = transitVehicleRef.current;
      const path = transitPathRef.current;
      if (!marker || !path) return;

      const tl = gsap.timeline({
        onUpdate: () => {
          const p = tl.progress();
          setTransitProgress(p);
          const stage = Math.min(5, Math.floor(p * 6));
          setTransitStageIdx(stage);
        },
        onComplete: () => {
          setTransitProgress(1);
          setTransitStageIdx(5);
          setTransitArrived(true);
          triggerHapticAndReward();
        },
      });

      tl.to(marker, {
        duration: 12,
        ease: "none",
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
      });

      tl.timeScale(doubleSpeed ? 2 : 1);
      transitTlRef.current = tl;
    }, stageRef);

    return () => {
      transitTlRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    if (transitTlRef.current) {
      transitTlRef.current.timeScale(doubleSpeed ? 2 : 1);
    }
    if (transitVideoRef.current) {
      transitVideoRef.current.playbackRate = doubleSpeed ? 2 : 1;
    }
  }, [doubleSpeed]);

  // Level 5: 3D job video playback (Electrician starts at 1.0s)
  useEffect(() => {
    if (level !== 5) return;
    setJobProgress(0);
    setJobFinished(false);

    const video = jobVideoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (selectedService.key === "electrician" && video.duration > 1.2) {
        video.currentTime = 1.0;
      }
      video.play().catch(() => {});
    };

    const handleTimeUpdate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const startOffset = selectedService.key === "electrician" ? 1.0 : 0;
      const effectiveDuration = Math.max(0.5, video.duration - startOffset);
      const elapsed = Math.max(0, video.currentTime - startOffset);
      setJobProgress(Math.min(1, elapsed / effectiveDuration));
    };

    const handleEnded = () => {
      setJobProgress(1);
      setJobFinished(true);
      triggerHapticAndReward();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    const fallbackTimer = setTimeout(() => {
      setJobProgress(1);
      setJobFinished(true);
    }, 9500);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      clearTimeout(fallbackTimer);
    };
  }, [level, selectedService, triggerHapticAndReward]);

  const handleSendPayment = useCallback(() => {
    if (paymentPhase !== "ready") return;
    setPaymentPhase("sending");
    setTimeout(() => {
      setPaymentPhase("sent");
      triggerHapticAndReward();
    }, 1250);
  }, [paymentPhase, triggerHapticAndReward]);

  // Advance / Step Back logic (for Space / ArrowRight / ArrowLeft)
  const advanceLevel = useCallback(() => {
    if (!demoStarted) {
      handleStartDemo();
      return;
    }
    if (level === 1) {
      handleSelectService(selectedService);
    } else if (level === 2) {
      setRadarMatched(true);
      jumpToLevel(3);
    } else if (level === 3) {
      jumpToLevel(4);
    } else if (level === 4) {
      jumpToLevel(5);
    } else if (level === 5) {
      jumpToLevel(6);
    } else if (level === 6) {
      if (paymentPhase === "ready") {
        handleSendPayment();
      } else if (paymentPhase === "sent") {
        onSkipToSite();
      }
    }
  }, [
    demoStarted,
    handleStartDemo,
    handleSelectService,
    handleSendPayment,
    jumpToLevel,
    level,
    onSkipToSite,
    paymentPhase,
    selectedService,
  ]);

  // Keyboard navigation: Space / ArrowRight / ArrowLeft
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (drawerOpen || previewModal) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.code === "Space" && tag === "BUTTON") return;

      if (e.code === "Space" || e.key === "ArrowRight") {
        e.preventDefault();
        advanceLevel();
      } else if (e.key === "ArrowLeft" && demoStarted && level > 1) {
        e.preventDefault();
        jumpToLevel((level - 1) as GameLevel);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advanceLevel, demoStarted, drawerOpen, jumpToLevel, level, previewModal]);

  const scrollToSection = useCallback(
    (selector: string) => {
      setDrawerOpen(false);
      const target = document.querySelector(selector);
      if (target instanceof HTMLElement) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -20 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        onSkipToSite();
      }
    },
    [lenis, onSkipToSite]
  );

  const currentStep = useMemo(
    () => STORY_STEPS.find((s) => s.level === level) ?? STORY_STEPS[0],
    [level]
  );

  const ActiveServiceIcon = selectedService.Icon;
  const activeTransit = TRANSIT_STAGES[transitStageIdx] ?? TRANSIT_STAGES[0];
  const ActiveTransitIcon = activeTransit.Icon;

  return (
    <section
      id="game-stage"
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        backgroundColor: "#F7F5F0",
        backgroundImage: `
          radial-gradient(60% 55% at 52% 48%, rgba(229, 152, 36, 0.12) 0%, rgba(229, 152, 36, 0) 68%),
          radial-gradient(50% 45% at 20% 25%, rgba(6, 96, 228, 0.04) 0%, rgba(6, 96, 228, 0) 70%),
          radial-gradient(65% 60% at 85% 75%, #EFECE6 0%, rgba(239, 236, 230, 0) 75%)
        `,
      }}
      className="relative w-full min-h-[100dvh] lg:h-[100dvh] overflow-x-clip overflow-y-visible lg:overflow-hidden text-[#121726] flex flex-col justify-between"
    >
      {/* SPLIT FLOATING HEADER: Left Brand Pill • Center Glass Scrubber • Right Actions */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-5">
        <div
          className={`w-full flex items-center justify-between gap-3 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
            headerCondensed ? "scale-[0.985]" : "scale-100"
          }`}
        >
          {/* 1. Left: Compact Serbify + Puppy Mascot Pill */}
          <button
            type="button"
            onClick={resetGame}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderColor: "rgba(18, 23, 38, 0.09)",
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border hover:border-[#0660E4]/35 transition-all cursor-pointer shrink-0 ${
              headerCondensed
                ? "shadow-[0_8px_22px_rgba(18,23,38,0.08)]"
                : "shadow-[0_4px_16px_rgba(18,23,38,0.05)]"
            }`}
            title="Restart interactive demo"
          >
            <img
              src="/assets/serbify-mascot.png"
              alt="Serbify"
              className="w-6 h-6 object-contain"
            />
            <span className="font-bold text-sm tracking-[-0.02em] text-[#121726]">
              Serbify
            </span>
          </button>

          {/* 2. Center: Sleek Compact Floating Glass Scrubber Pill */}
          <nav
            aria-label="Interactive walkthrough steps"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              borderColor: "rgba(18, 23, 38, 0.09)",
            }}
            className={`hidden md:flex items-center gap-1.5 w-full max-w-sm px-3.5 py-1.5 rounded-full border transition-shadow duration-300 ${
              headerCondensed
                ? "shadow-[0_10px_28px_rgba(18,23,38,0.09)]"
                : "shadow-[0_6px_22px_rgba(18,23,38,0.05)]"
            }`}
          >
            {STORY_STEPS.map((step) => {
              const isCompleted = demoStarted && step.level < level;
              const isActive = demoStarted && step.level === level;
              const isHovered = hoveredStep === step.level;

              return (
                <div key={step.level} className="relative flex-1 group">
                  <button
                    type="button"
                    onClick={() => jumpToLevel(step.level)}
                    onMouseEnter={() => setHoveredStep(step.level)}
                    onMouseLeave={() => setHoveredStep(null)}
                    onFocus={() => setHoveredStep(step.level)}
                    onBlur={() => setHoveredStep(null)}
                    aria-label={step.shortLabel}
                    aria-current={isActive ? "step" : undefined}
                    className="w-full py-2 px-0.5 flex items-center cursor-pointer focus-visible:outline-none"
                  >
                    <span
                      className={`relative block w-full h-1.5 rounded-full overflow-hidden transition-colors duration-300 ${
                        isActive
                          ? "bg-[#0660E4]"
                          : isCompleted
                            ? "bg-[#117A58]"
                            : "bg-[#121726]/12 group-hover:bg-[#121726]/28"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          key={`ripple-${level}-${rewardPulseKey}`}
                          initial={{ scaleX: 0, opacity: 0.95 }}
                          animate={{ scaleX: 1, opacity: 0.35 }}
                          transition={{ duration: 0.65, ease: SMOOTH_EASE }}
                          style={{ originX: 0 }}
                          className="absolute inset-0 bg-[#117A58]"
                        />
                      )}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 2 }}
                        transition={{ duration: 0.14 }}
                        className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-[#121726] text-[#F7F6F2] text-[11px] font-semibold whitespace-nowrap shadow-md z-40"
                      >
                        {step.shortLabel}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* 3. Right: Borderless Skip Link + 40px Menu Circle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSkipToSite}
              className="group relative inline-flex items-center gap-1 px-1.5 py-1.5 text-xs font-semibold text-[#4B5565] hover:text-[#121726] transition-colors cursor-pointer"
            >
              <span>Skip to Full Site</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
              <span className="pointer-events-none absolute left-1.5 right-1.5 bottom-1 h-[1.5px] bg-[#0660E4] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="w-10 h-10 rounded-full bg-white/85 border border-[#121726]/10 shadow-[0_4px_14px_rgba(18,23,38,0.06)] flex flex-col items-center justify-center gap-[5px] text-[#121726] hover:border-[#0660E4]/40 hover:text-[#0660E4] active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span
                className={`block w-4 h-[1.75px] rounded-full bg-current transition-transform duration-200 ${
                  drawerOpen ? "translate-y-[3.3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block w-4 h-[1.75px] rounded-full bg-current transition-transform duration-200 ${
                  drawerOpen ? "-translate-y-[3.3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Compact Mobile Scrubber (< md) */}
        <div className="mt-2.5 flex md:hidden items-center gap-1.5 px-1">
          {STORY_STEPS.map((step) => {
            const isCompleted = demoStarted && step.level < level;
            const isActive = demoStarted && step.level === level;
            return (
              <button
                key={step.level}
                type="button"
                onClick={() => jumpToLevel(step.level)}
                aria-label={step.shortLabel}
                className="flex-1 py-2 cursor-pointer"
              >
                <span
                  className={`block h-1.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#0660E4]"
                      : isCompleted
                        ? "bg-[#117A58]"
                        : "bg-[#121726]/15"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </header>

      {/* 12-COLUMN ASYMMETRICAL EDITORIAL STAGE */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-4 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* LEFT STAGE (Cols 1-5): Step Eyebrow + Editorial Narrative / Coachmark */}
          <div className="lg:col-span-5 flex flex-col items-start text-left order-2 lg:order-1">
            {/* Golden Puppy Mascot + Clean Step Eyebrow Pill (Badgey Tactile Token) */}
            <div className="relative mb-5">
              <motion.div
                key={`glow-${rewardPulseKey}`}
                initial={{ opacity: 0.4, scale: 0.9 }}
                animate={{
                  opacity: [0.45, 0.95, 0.5],
                  scale: [0.92, 1.24, 1],
                }}
                transition={{ duration: 0.85, ease: SMOOTH_EASE }}
                aria-hidden="true"
                className="absolute -inset-3.5 rounded-full bg-[#FDF4E3] ring-1 ring-[#E59824]/30 blur-md pointer-events-none"
              />
              <div ref={mascotRef}>
                <TactileTokenBadge
                  onClick={() => triggerHapticAndReward()}
                  pulseOnScroll={false}
                  className="relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FDF4E3] border border-[#E59824]/35 shadow-[0_6px_18px_rgba(229,152,36,0.14)] cursor-pointer select-none"
                >
                  <img
                    src="/assets/serbify-mascot.png"
                    alt="Serbify mascot"
                    className="w-6 h-6 object-contain"
                  />
                  <span
                    style={{ fontFamily: "var(--font-ui)" }}
                    className="text-[11px] font-bold tracking-[0.06em] uppercase text-[#8A5609] tabular-nums"
                  >
                    0{level} / 06 • 30-SEC INTERACTIVE DEMO
                  </span>
                </TactileTokenBadge>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!demoStarted ? (
                <motion.div
                  key="editorial-intro"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                  className="flex flex-col items-start gap-5 max-w-lg"
                >
                  <KineticHeadline
                    as="h1"
                    immediate
                    className="text-[40px] sm:text-[50px] lg:text-[56px] font-bold tracking-[-0.035em] leading-[1.05] text-[#121726]"
                    lines={[
                      { text: "Try Serbify" },
                      { text: "in 30 Seconds" },
                    ]}
                  />

                  <p className="text-base sm:text-[17px] text-[#4B5565] leading-[1.6] max-w-md">
                    Pick a service, match with a verified local pro, watch them
                    arrive, and send payment safely.
                  </p>

                  <div
                    onMouseEnter={() => setCtaHovered(true)}
                    onMouseLeave={() => setCtaHovered(false)}
                    className="pt-1"
                  >
                    <MagneticButton
                      onClick={handleStartDemo}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm sm:text-base font-bold shadow-[0_14px_30px_rgba(6,96,228,0.24)] transition-colors cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Interactive Demo</span>
                    </MagneticButton>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`coachmark-${level}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: SMOOTH_EASE }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.78)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderColor: "rgba(18, 23, 38, 0.08)",
                  }}
                  className="w-full max-w-md rounded-[24px] border p-6 shadow-[0_18px_44px_rgba(18,23,38,0.07)] flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      style={{ fontFamily: "var(--font-ui)" }}
                      className="text-xs font-bold text-[#0660E4] tabular-nums tracking-wide"
                    >
                      Step 0{level}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#E6F4EF] text-[#117A58] text-[11px] font-bold">
                      {currentStep.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-[28px] font-bold tracking-[-0.03em] leading-[1.15] text-[#121726]">
                      {currentStep.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#4B5565] leading-relaxed">
                      {currentStep.instruction}
                    </p>
                  </div>

                  {level === 1 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SERVICES.map((svc) => {
                        const Icon = svc.Icon;
                        return (
                          <button
                            key={svc.key}
                            type="button"
                            onClick={() => handleSelectService(svc)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F7F6F2] hover:bg-[#0660E4] hover:text-white border border-[#121726]/10 text-xs font-bold text-[#121726] transition-colors cursor-pointer"
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{svc.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#121726]/8">
                    <button
                      type="button"
                      onClick={resetGame}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5565] hover:text-[#121726] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restart</span>
                    </button>

                    <button
                      type="button"
                      onClick={advanceLevel}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0660E4] hover:bg-[#044BB5] text-white text-xs font-bold shadow-[0_8px_20px_rgba(6,96,228,0.22)] transition-colors cursor-pointer"
                    >
                      <span>
                        {level === 6 && paymentPhase === "sent"
                          ? "Explore Full Site"
                          : level === 6 && paymentPhase === "ready"
                            ? `Pay ${selectedService.samplePrice}`
                            : "Next Step"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CENTER STAGE (Cols 6-9): 3D Perspective + Levitation + Tilt + Recoil Phone Chassis */}
          <div
            style={{ perspective: "1200px" }}
            className="lg:col-span-4 flex items-center justify-center order-1 lg:order-2"
          >
            <div ref={phoneEntranceRef}>
              <div ref={phoneLevitationRef}>
                <div
                  ref={phoneTiltRef}
                  style={{
                    boxShadow: "0 32px 64px -16px rgba(18, 23, 38, 0.16)",
                  }}
                  className="rounded-[46px]"
                >
                  <div
                    ref={phoneRecoilRef}
                    className="relative w-[294px] sm:w-[318px] h-[565px] sm:h-[595px] rounded-[46px] bg-[#181C26] p-[11px] border border-white/15"
                  >
                    {/* 1px inner specular rim */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[2px] rounded-[44px] border border-white/[0.18]"
                    />

                    {/* Diagonal soft glass specular sheen */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[46px] overflow-hidden z-30"
                    >
                      <div
                        ref={sheenRef}
                        style={{
                          background:
                            "linear-gradient(125deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 42%, transparent 62%)",
                        }}
                        className="absolute -inset-8"
                      />
                    </div>

                    {/* Hardware Side Buttons */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-[3px] top-28 w-[3px] h-10 rounded-l bg-[#272D3D]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -left-[3px] top-42 w-[3px] h-10 rounded-l bg-[#272D3D]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -right-[3px] top-32 w-[3px] h-14 rounded-r bg-[#272D3D]"
                    />

                    {/* Inner Screen */}
                    <div
                      ref={phoneScreenRef}
                      className="relative z-10 w-full h-full rounded-[35px] bg-[#F7F6F2] overflow-hidden flex flex-col"
                    >
                      {/* Dynamic Island + Status Bar */}
                      <div className="relative z-20 px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold text-[#121726] bg-white/90 backdrop-blur-md border-b border-[#121726]/8">
                        <span
                          style={{ fontFamily: "var(--font-ui)" }}
                          className="tabular-nums"
                        >
                          9:41
                        </span>
                        <div className="w-22 h-5 rounded-full bg-[#121726] shadow-inner flex items-center justify-between px-2">
                          <span className="w-2 h-2 rounded-full bg-[#242B3D]" />
                          <span className="relative flex h-2 w-2 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#117A58] opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#117A58]" />
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#4B5565]">
                          5G
                        </span>
                      </div>

                      {/* SCREEN BODY BY LEVEL */}
                      <div className="relative flex-1 flex flex-col justify-between p-4 overflow-hidden">
                        {/* LEVEL 1: IMMEDIATELY INTERACTIVE SERVICE PICKER */}
                        {level === 1 && (
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[11px] font-semibold text-[#4B5565]">
                                    Metro Manila
                                  </p>
                                  <h2 className="text-base font-bold text-[#121726] tracking-[-0.02em]">
                                    Home Help, Ready
                                  </h2>
                                </div>
                                <span className="w-9 h-9 rounded-full bg-[#FDF4E3] border border-[#E59824]/30 flex items-center justify-center">
                                  <img
                                    src="/assets/serbify-mascot.png"
                                    alt="Serbify"
                                    className="w-6 h-6 object-contain"
                                  />
                                </span>
                              </div>

                              <div
                                data-phone-card
                                className="rounded-[18px] bg-white border border-[#121726]/8 p-3.5 shadow-[0_6px_18px_rgba(18,23,38,0.04)]"
                              >
                                <div className="flex items-center gap-2 text-xs font-bold text-[#0660E4]">
                                  <ShieldCheck className="w-4 h-4 text-[#117A58]" />
                                  <span>ID &amp; NBI-Verified Local Pros</span>
                                </div>
                                <p className="mt-1.5 text-xs text-[#4B5565] leading-relaxed">
                                  Upfront prices, live arrival map, and safe
                                  in-app payments.
                                </p>
                              </div>

                              {/* Interactive Service Rows (No Duplicate Bottom Button) */}
                              <div className="space-y-2.5 pt-0.5">
                                {SERVICES.map((item, idx) => {
                                  const Icon = item.Icon;
                                  const isTapped = tappedService === item.key;
                                  const isCoupledHighlight =
                                    ctaHovered && idx === 0;
                                  const showAutoRipple =
                                    idx === 0 &&
                                    !demoStarted &&
                                    autoPreviewPulse > 0 &&
                                    !isTapped;
                                  return (
                                    <button
                                      key={item.key}
                                      data-phone-card
                                      type="button"
                                      onClick={() => handleSelectService(item)}
                                      style={{
                                        transform: isTapped
                                          ? "scale(0.96)"
                                          : isCoupledHighlight
                                            ? "translateY(-1px) scale(1)"
                                            : "scale(1)",
                                      }}
                                      className={`relative w-full overflow-hidden flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white border transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer text-left ${
                                        isCoupledHighlight
                                          ? "border-[#0660E4] shadow-[0_8px_22px_rgba(6,96,228,0.16)] ring-2 ring-[#0660E4]/15"
                                          : "border-[#121726]/8 hover:border-[#0660E4]/50 hover:shadow-[0_6px_16px_rgba(6,96,228,0.08)] active:scale-[0.96]"
                                      }`}
                                    >
                                      {showAutoRipple && (
                                        <motion.span
                                          key={`auto-ripple-${autoPreviewPulse}`}
                                          initial={{ scale: 0.4, opacity: 0.5 }}
                                          animate={{ scale: 1.8, opacity: 0 }}
                                          transition={{
                                            duration: 0.9,
                                            ease: SMOOTH_EASE,
                                          }}
                                          className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0660E4]/25 ring-2 ring-[#0660E4]/35"
                                        />
                                      )}
                                      {isTapped && (
                                        <motion.span
                                          initial={{ scale: 0.4, opacity: 0.5 }}
                                          animate={{ scale: 1.8, opacity: 0 }}
                                          transition={{
                                            duration: 0.3,
                                            ease: SMOOTH_EASE,
                                          }}
                                          className="pointer-events-none absolute inset-0 rounded-2xl bg-[#0660E4]/20"
                                        />
                                      )}
                                      <div className="flex items-center gap-2.5">
                                        <span
                                          style={{
                                            backgroundColor: item.softBg,
                                            color: item.accent,
                                          }}
                                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                        >
                                          <Icon className="w-4 h-4" />
                                        </span>
                                        <div>
                                          <div className="text-xs font-bold text-[#121726]">
                                            {item.label}
                                          </div>
                                          <div className="text-[11px] text-[#4B5565]">
                                            {item.taskSummary}
                                          </div>
                                        </div>
                                      </div>
                                      <span
                                        style={{ fontFamily: "var(--font-ui)" }}
                                        className="text-[11px] font-bold text-[#121726] tabular-nums"
                                      >
                                        {item.price}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="text-center text-[11px] font-medium text-[#4B5565] pb-1">
                              Tap any trade above to book
                            </div>
                          </div>
                        )}

                        {/* LEVEL 2: AI PRO MATCHING (CONCENTRIC SVG RADAR PULSE WAVES) */}
                        {level === 2 && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                            className="flex-1 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-bold text-[#121726]">
                                  Finding {selectedService.label}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF1FD] text-[#0660E4] text-[11px] font-bold">
                                  Scanning
                                </span>
                              </div>

                              <div className="relative h-64 rounded-[22px] bg-[#ECEEF5] border border-[#121726]/8 overflow-hidden flex items-center justify-center">
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 opacity-45"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)",
                                    backgroundSize: "26px 26px",
                                  }}
                                />
                                {/* Concentric SVG radar pulse waves */}
                                <svg
                                  viewBox="0 0 220 220"
                                  className="absolute inset-0 w-full h-full pointer-events-none"
                                  aria-hidden="true"
                                >
                                  {[0, 1, 2].map((ring) => (
                                    <motion.circle
                                      key={ring}
                                      cx="110"
                                      cy="110"
                                      r="54"
                                      fill="rgba(6, 96, 228, 0.08)"
                                      stroke="rgba(6, 96, 228, 0.45)"
                                      strokeWidth="1.5"
                                      initial={{ scale: 0.35, opacity: 0.8 }}
                                      animate={{ scale: 1.65, opacity: 0 }}
                                      transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        delay: ring * 0.55,
                                        ease: "easeOut",
                                      }}
                                      style={{ transformOrigin: "110px 110px" }}
                                    />
                                  ))}
                                </svg>
                                <div className="relative z-10 flex flex-col items-center gap-1.5">
                                  <div className="w-10 h-10 rounded-full bg-[#0660E4] text-white shadow-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5" />
                                  </div>
                                  <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-[#121726]/10 text-[10px] font-bold text-[#121726] shadow-xs">
                                    Brgy. Kapitolyo / San Antonio, Pasig
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-[#121726]/8 px-3.5 py-3 text-center text-xs font-semibold text-[#4B5565]">
                              Checking nearby verified{" "}
                              {selectedService.label.toLowerCase()}s...
                            </div>
                          </motion.div>
                        )}

                        {/* LEVEL 3: 3D BADGE FLIP FOR NBI & GOV ID VERIFICATION */}
                        {level === 3 && (
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-bold text-[#121726]">
                                  Matched {selectedService.label}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EF] text-[#117A58] text-[11px] font-bold">
                                  Verified
                                </span>
                              </div>

                              <div className="relative h-48 rounded-[22px] bg-[#ECEEF5] border border-[#121726]/8 overflow-hidden flex items-center justify-center">
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 opacity-45"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)",
                                    backgroundSize: "26px 26px",
                                  }}
                                />
                                <div className="relative z-10 w-10 h-10 rounded-full bg-[#0660E4] text-white shadow-md flex items-center justify-center">
                                  <MapPin className="w-5 h-5" />
                                </div>
                                <motion.div
                                  initial={{ scale: 0.75, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.35,
                                    ease: SMOOTH_EASE,
                                  }}
                                  className="absolute top-6 right-6 z-10 px-2.5 py-1 rounded-full bg-[#117A58] text-white text-[11px] font-bold shadow-md flex items-center gap-1"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Kuya Arnel</span>
                                </motion.div>
                              </div>
                            </div>

                            <div className="space-y-2.5">
                              <motion.div
                                initial={{ rotateY: -90, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                transition={{
                                  duration: 0.48,
                                  ease: SMOOTH_EASE,
                                }}
                                style={{ transformPerspective: 800 }}
                                className="rounded-[20px] bg-white border border-[#117A58]/30 p-3.5 shadow-[0_8px_22px_rgba(17,122,88,0.1)]"
                              >
                                <div className="flex items-center justify-between gap-2.5">
                                  <div className="flex items-start gap-2.5 min-w-0">
                                    <div className="w-10 h-10 rounded-2xl bg-[#E6F4EF] text-[#117A58] flex items-center justify-center shrink-0">
                                      <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-[#121726] leading-snug">
                                        Kuya Arnel • {selectedService.label} • 4.9★
                                      </div>
                                      <div className="mt-1 text-[11px] text-[#4B5565] tabular-nums">
                                        Gov&apos;t ID &amp; NBI checked •{" "}
                                        {selectedService.samplePrice}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Botanical Jade verified stamp + animated SVG checkmark path draw */}
                                  <div
                                    aria-label="ID & NBI Verified Stamp"
                                    className="w-8 h-8 rounded-full bg-[#E6F4EF] border border-[#117A58]/40 flex items-center justify-center shrink-0"
                                  >
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="w-4 h-4 text-[#117A58]"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.6"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <motion.path
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{
                                          duration: 0.5,
                                          delay: 0.25,
                                          ease: SMOOTH_EASE,
                                        }}
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </motion.div>

                              <button
                                type="button"
                                onClick={() => jumpToLevel(4)}
                                className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.24)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Track Arrival</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* LEVEL 4: LIVE ARRIVAL (ANIMATED ROUTE PATH + PIN + LIVE ETA) */}
                        {level === 4 && (
                          <div className="flex-1 flex flex-col justify-between gap-2.5">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-[#121726]">
                                  Kuya Arnel is on the way
                                </div>
                                <div className="text-[11px] text-[#4B5565] tabular-nums">
                                  {transitArrived
                                    ? "Arrived at your gate"
                                    : `ETA ${Math.max(1, Math.round(14 * (1 - transitProgress)))} mins • Brgy. Kapitolyo`}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setDoubleSpeed((s) => !s)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                                  doubleSpeed
                                    ? "bg-[#0660E4] text-white border-[#0660E4]"
                                    : "bg-white text-[#4B5565] border-[#121726]/12 hover:border-[#0660E4]"
                                }`}
                              >
                                2x Speed
                              </button>
                            </div>

                            <div className="relative rounded-[20px] bg-[#121726] border border-[#121726]/15 overflow-hidden shadow-inner">
                              <video
                                ref={transitVideoRef}
                                src="/animations/transit-zigzag.mp4"
                                muted
                                playsInline
                                autoPlay
                                loop
                                className="w-full h-24 object-cover opacity-55"
                              />

                              <div className="relative h-30 bg-[#181C26] border-t border-white/10 px-2 py-1">
                                <svg
                                  viewBox="0 0 260 110"
                                  className="w-full h-full overflow-visible"
                                  aria-label="Zigzag highway route from Point A to your house"
                                >
                                  <path
                                    d="M 22 92 L 90 92 L 70 55 L 185 55 L 155 20 L 236 20"
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth="18"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    ref={transitPathRef}
                                    d="M 22 92 L 90 92 L 70 55 L 185 55 L 155 20 L 236 20"
                                    fill="none"
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  {/* Animated glowing route progress draw */}
                                  <motion.path
                                    d="M 22 92 L 90 92 L 70 55 L 185 55 L 155 20 L 236 20"
                                    fill="none"
                                    stroke="#0660E4"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: transitProgress }}
                                    transition={{ duration: 0.12, ease: "linear" }}
                                  />
                                  <circle cx="22" cy="92" r="7" fill="#0660E4" />
                                  <text
                                    x="22"
                                    y="108"
                                    textAnchor="middle"
                                    fill="#CBD5E1"
                                    fontSize="8"
                                    fontWeight="700"
                                  >
                                    Kuya Arnel
                                  </text>
                                  <circle cx="236" cy="20" r="8" fill="#117A58" />
                                  <text
                                    x="236"
                                    y="37"
                                    textAnchor="middle"
                                    fill="#A7F3D0"
                                    fontSize="8"
                                    fontWeight="700"
                                  >
                                    Pinned Gate
                                  </text>
                                </svg>

                                <div
                                  ref={transitVehicleRef}
                                  className="absolute top-0 left-0 w-8 h-8 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] border-2 border-[#0660E4] flex items-center justify-center pointer-events-none"
                                >
                                  {activeTransit.isJeepney ? (
                                    <JeepneyBadge className="w-5 h-4" />
                                  ) : (
                                    <ActiveTransitIcon className="w-4 h-4 text-[#0660E4]" />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-[#121726]/8 p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-8 h-8 rounded-xl bg-[#EAF1FD] flex items-center justify-center shrink-0">
                                    {activeTransit.isJeepney ? (
                                      <JeepneyBadge className="w-5 h-4" />
                                    ) : (
                                      <ActiveTransitIcon className="w-4 h-4 text-[#0660E4]" />
                                    )}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-[#121726] truncate">
                                      {activeTransit.label}
                                    </div>
                                    <div className="text-[10px] font-semibold text-[#4B5565] tabular-nums">
                                      Stage {transitStageIdx + 1} of 6 •{" "}
                                      {activeTransit.mode}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[11px] font-bold text-[#0660E4] tabular-nums">
                                  {transitArrived
                                    ? "Arrived"
                                    : `${Math.max(1, Math.round(14 * (1 - transitProgress)))} mins`}
                                </span>
                              </div>
                              <div className="mt-2 h-1.5 w-full rounded-full bg-[#ECEEF5] overflow-hidden">
                                <div
                                  style={{
                                    transform: `scaleX(${transitProgress})`,
                                    transformOrigin: "left",
                                  }}
                                  className="h-full w-full rounded-full bg-[#0660E4] transition-transform duration-100 will-change-transform"
                                />
                              </div>
                            </div>

                            {transitArrived ? (
                              <button
                                type="button"
                                onClick={() => jumpToLevel(5)}
                                className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.24)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Start Repair</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => jumpToLevel(5)}
                                className="w-full py-2.5 rounded-2xl bg-[#ECEEF5] hover:bg-[#E2E6F0] text-[#4B5565] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Skip to Job Complete →
                              </button>
                            )}
                          </div>
                        )}

                        {/* LEVEL 5: JOB COMPLETE (BOTTOM-SHEET SLIDE-UP + PROGRESS COMPLETION) */}
                        {level === 5 && (
                          <div className="flex-1 flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="text-xs font-bold text-[#121726]">
                                    {selectedService.label} at Work
                                  </div>
                                  <div className="text-[11px] text-[#4B5565]">
                                    {selectedService.taskSummary}
                                  </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#FDF4E3] text-[#8A5609] text-[11px] font-bold">
                                  {jobFinished ? "Done" : "In Progress"}
                                </span>
                              </div>

                              <div className="relative rounded-[20px] bg-[#F7F6F2] border border-[#121726]/8 overflow-hidden shadow-[0_8px_22px_rgba(18,23,38,0.05)]">
                                <video
                                  ref={jobVideoRef}
                                  key={selectedService.videoSrc}
                                  src={selectedService.videoSrc}
                                  muted
                                  playsInline
                                  autoPlay
                                  className="w-full h-52 object-cover bg-[#F7F6F2]"
                                />
                                {jobFinished && (
                                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#E6F4EF] border border-[#117A58]/30 flex items-center justify-center shadow-sm">
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="w-5 h-5 text-[#117A58]"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <motion.path
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{
                                          duration: 0.45,
                                          ease: SMOOTH_EASE,
                                        }}
                                      />
                                    </svg>
                                  </div>
                                )}
                                <motion.div
                                  initial={{ y: 20, opacity: 0.6 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.4, ease: SMOOTH_EASE }}
                                  className="px-3.5 py-2.5 bg-white border-t border-[#121726]/8"
                                >
                                  <div className="flex items-center justify-between text-[11px] font-bold text-[#4B5565] mb-1.5">
                                    <span>Repair Progress</span>
                                    <span className="tabular-nums text-[#0660E4]">
                                      {Math.round(jobProgress * 100)}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-[#ECEEF5] overflow-hidden">
                                    <div
                                      style={{
                                        transform: `scaleX(${jobProgress})`,
                                        transformOrigin: "left",
                                      }}
                                      className="h-full w-full rounded-full bg-[#117A58] transition-transform duration-150 will-change-transform"
                                    />
                                  </div>
                                </motion.div>
                              </div>
                            </div>

                            {jobFinished ? (
                              <motion.button
                                initial={{ y: 18, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                                type="button"
                                onClick={() => jumpToLevel(6)}
                                className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.24)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Pay the {selectedService.label}</span>
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => jumpToLevel(6)}
                                className="w-full py-2.5 rounded-2xl bg-white border border-[#121726]/10 text-[#4B5565] hover:text-[#121726] text-xs font-bold transition-colors cursor-pointer"
                              >
                                Proceed to Safe Payment →
                              </button>
                            )}
                          </div>
                        )}

                        {/* LEVEL 6: SAFE PAYMENT (BOTTOM-SHEET SLIDE-UP + MASCOT GOLD SHIMMER) */}
                        {level === 6 && (
                          <motion.div
                            initial={{ y: 28, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.38, ease: SMOOTH_EASE }}
                            className="flex-1 flex flex-col justify-between gap-3"
                          >
                            <div>
                              <div className="text-xs font-bold text-[#121726]">
                                Safe In-App Payment
                              </div>
                              <div className="text-[11px] text-[#4B5565]">
                                Release funds now that you&apos;ve checked the
                                work
                              </div>

                              <div className="relative overflow-hidden mt-3 rounded-[22px] bg-white border border-[#121726]/8 p-4 shadow-[0_8px_22px_rgba(18,23,38,0.05)] space-y-4">
                                {paymentPhase === "sent" && (
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#E59824]/25 to-transparent animate-gold-shimmer"
                                  />
                                )}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-9 h-9 rounded-xl bg-[#EAF1FD] text-[#0660E4] flex items-center justify-center">
                                      <CreditCard className="w-4 h-4" />
                                    </span>
                                    <div>
                                      <div className="text-xs font-bold text-[#121726]">
                                        GCash / Maya / Cash
                                      </div>
                                      <div className="text-[10px] text-[#4B5565]">
                                        Your Account
                                      </div>
                                    </div>
                                  </div>
                                  <span className="text-sm font-bold text-[#121726] tabular-nums">
                                    {selectedService.samplePrice}
                                  </span>
                                </div>

                                <div className="relative h-8 flex items-center justify-center">
                                  <div className="w-full h-0.5 bg-[#ECEEF5] rounded-full" />
                                  {paymentPhase === "sending" && (
                                    <motion.div
                                      initial={{
                                        x: -85,
                                        opacity: 0,
                                        scale: 0.85,
                                      }}
                                      animate={{
                                        x: 85,
                                        opacity: [0, 1, 1, 0],
                                        scale: 1.08,
                                      }}
                                      transition={{
                                        duration: 1.1,
                                        ease: "easeInOut",
                                      }}
                                      className="absolute px-2.5 py-1 rounded-full bg-[#0660E4] text-white text-[10px] font-bold shadow-md tabular-nums"
                                    >
                                      Sending {selectedService.samplePrice}
                                    </motion.div>
                                  )}
                                  {paymentPhase === "sent" && (
                                    <motion.div
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{
                                        duration: 0.28,
                                        ease: SMOOTH_EASE,
                                      }}
                                      className="absolute px-2.5 py-1 rounded-full bg-[#117A58] text-white text-[10px] font-bold shadow-sm flex items-center gap-1"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Transferred</span>
                                    </motion.div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="w-9 h-9 rounded-xl bg-[#E6F4EF] text-[#117A58] flex items-center justify-center">
                                      <Wallet className="w-4 h-4" />
                                    </span>
                                    <div>
                                      <div className="text-xs font-bold text-[#121726]">
                                        Kuya Arnel&apos;s Wallet
                                      </div>
                                      <div className="text-[10px] text-[#4B5565]">
                                        Verified {selectedService.label}
                                      </div>
                                    </div>
                                  </div>
                                  <ActiveServiceIcon className="w-4 h-4 text-[#4B5565]" />
                                </div>
                              </div>
                            </div>

                            {paymentPhase === "ready" && (
                              <button
                                type="button"
                                onClick={handleSendPayment}
                                className="w-full py-3.5 rounded-2xl bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.24)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <span>Pay the {selectedService.label}</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}

                            {paymentPhase === "sending" && (
                              <div className="w-full py-3.5 rounded-2xl bg-[#EAF1FD] text-[#0660E4] text-sm font-bold text-center">
                                Sending payment safely...
                              </div>
                            )}

                            {paymentPhase === "sent" && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.35,
                                  ease: SMOOTH_EASE,
                                }}
                                className="space-y-2.5"
                              >
                                <div className="rounded-[20px] bg-[#E6F4EF] border border-[#117A58]/30 p-3 text-center">
                                  <div className="text-xs font-bold text-[#117A58]">
                                    Payment Sent to Your {selectedService.label}
                                    !
                                  </div>
                                  <div className="mt-1.5 flex items-center justify-center gap-1">
                                    {[0, 1, 2, 3, 4].map((starIdx) => (
                                      <Star
                                        key={starIdx}
                                        className="w-4 h-4 fill-[#E59824] text-[#E59824]"
                                      />
                                    ))}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={onSkipToSite}
                                  className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_10px_24px_rgba(6,96,228,0.28)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Home className="w-4 h-4" />
                                  <span>Explore Full Site</span>
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT STAGE (Cols 10-12): Calm Initial State; Contextual Telemetry Only in Levels 2-6 */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4 lg:h-[480px] order-3">
            <div className="min-h-[72px]">
              <AnimatePresence mode="wait">
                {demoStarted && level >= 2 && (
                  <motion.div
                    key={`telemetry-${level}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: SMOOTH_EASE }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.72)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      borderColor: "rgba(18, 23, 38, 0.06)",
                    }}
                    className="rounded-2xl border p-4 shadow-[0_12px_32px_rgba(18,23,38,0.06)] flex items-start gap-3"
                  >
                    <span className="relative flex h-2.5 w-2.5 mt-1 shrink-0">
                      {(level === 2 || level === 3) && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#117A58] opacity-75" />
                      )}
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#117A58]" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#121726] leading-snug">
                        {currentStep.telemetryTitle}
                      </p>
                      <p
                        style={{ fontFamily: "var(--font-ui)" }}
                        className="mt-0.5 text-[11px] font-semibold text-[#117A58] tabular-nums"
                      >
                        {currentStep.telemetryValue}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Minimal Borderless Keyboard Shortcut Cue */}
            <button
              type="button"
              onClick={advanceLevel}
              className="group self-start lg:self-end inline-flex items-center gap-2 py-1.5 text-xs font-medium text-[#4B5565] hover:text-[#121726] transition-colors cursor-pointer"
            >
              <span>
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/80 border border-[#121726]/12 text-[11px] font-bold text-[#121726] shadow-[0_1px_0_rgba(18,23,38,0.08)]">
                  Space
                </kbd>{" "}
                to advance
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0660E4] transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Spacer */}
      <div className="h-3 lg:h-4" aria-hidden="true" />

      {/* SLIDE-OVER GLASS NAVIGATION DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-[#121726]/25 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              aria-label="Site navigation"
              className="fixed top-3 right-3 bottom-3 z-50 w-[min(340px,calc(100vw-24px))] rounded-[24px] bg-[#F7F6F2]/95 backdrop-blur-2xl border border-[#121726]/10 shadow-[0_24px_60px_rgba(18,23,38,0.18)] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#121726]/10">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/serbify-mascot.png"
                      alt="Serbify"
                      className="w-7 h-7 object-contain"
                    />
                    <span className="font-bold text-base text-[#121726]">
                      Serbify
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-10 h-10 rounded-full bg-white border border-[#121726]/10 flex items-center justify-center text-[#121726] hover:border-[#0660E4]/40 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection("#landing-experience")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#121726] hover:bg-white hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Serbify</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("#verified-pros")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#121726] hover:bg-white hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Features</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setPreviewModal("blog");
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#121726] hover:bg-white hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Blog</span>
                    <FileText className="w-4 h-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("#services")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#121726] hover:bg-white hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Pricing</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setPreviewModal("guide");
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#121726] hover:bg-white hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Guide</span>
                    <BookOpen className="w-4 h-4 opacity-50" />
                  </button>
                </nav>
              </div>

              <div className="pt-4 border-t border-[#121726]/10">
                <button
                  type="button"
                  onClick={() => scrollToSection("#download-app")}
                  className="w-full py-3.5 px-5 rounded-full bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold shadow-[0_10px_24px_rgba(6,96,228,0.24)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Serbify</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* PREVIEW MODAL FOR BLOG & GUIDE */}
      <AnimatePresence>
        {previewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121726]/30 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPreviewModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: SMOOTH_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[24px] bg-[#F7F6F2] border border-[#121726]/10 p-6 shadow-[0_24px_64px_rgba(18,23,38,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FD] text-[#0660E4] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {previewModal === "blog"
                      ? "Serbify Stories"
                      : "Homeowner Guide"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-full bg-white border border-[#121726]/10 flex items-center justify-center text-[#121726] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {previewModal === "blog" ? (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-bold text-[#121726]">
                    How Upfront Pricing Ends Home Repair Guessing
                  </h3>
                  <p className="text-sm text-[#4B5565] leading-relaxed">
                    Read how Metro Manila homeowners compare standard inspection
                    rates before booking—and why paying only after checking the
                    finished work gives everyone peace of mind.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-bold text-[#121726]">
                    Quick Homeowner Booking Guide
                  </h3>
                  <ul className="space-y-2 text-sm text-[#4B5565]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#117A58] mt-0.5 shrink-0" />
                      <span>
                        Pin your exact address and pick the trade you need.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#117A58] mt-0.5 shrink-0" />
                      <span>
                        Check your pro&apos;s verified ID badge before they
                        arrive.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#117A58] mt-0.5 shrink-0" />
                      <span>
                        Pay safely with GCash, Maya, card, or cash once done.
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setPreviewModal(null);
                  onSkipToSite();
                }}
                className="mt-5 w-full py-3 rounded-full bg-[#0660E4] hover:bg-[#044BB5] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Explore Full Site
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
