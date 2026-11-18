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
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Footprints,
  Home,
  KeyRound,
  MapPin,
  Menu,
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
import { useLenis } from "./LenisProvider";
import { SPRING_NAV, SPRING_TACTILE } from "./serbifyTheme";

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
    softBg: "#EEF4FF",
    videoSrc: "/animations/job-plumber.mp4",
    taskSummary: "Under-sink leak & valve seal",
    samplePrice: "₱450",
    Icon: Wrench,
  },
  {
    key: "electrician",
    label: "Electrician",
    price: "from ₱150",
    accent: "#D97706",
    softBg: "#FEF3C7",
    videoSrc: "/animations/job-electrician.mp4",
    taskSummary: "Breaker check & outlet wiring",
    samplePrice: "₱480",
    Icon: Zap,
  },
  {
    key: "locksmith",
    label: "Locksmith",
    price: "from ₱80",
    accent: "#EE8B60",
    softBg: "#FFF4EE",
    videoSrc: "/animations/job-locksmith.mp4",
    taskSummary: "Door deadbolt & key cylinder",
    samplePrice: "₱350",
    Icon: KeyRound,
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

function JeepneyBadge({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="6" width="30" height="12" rx="3" fill="#F59E0B" />
      <rect x="4" y="4" width="24" height="3" rx="1.5" fill="#0660E4" />
      <rect x="5" y="8" width="6" height="5" rx="1" fill="#E0F2FE" />
      <rect x="13" y="8" width="6" height="5" rx="1" fill="#E0F2FE" />
      <rect x="21" y="8" width="6" height="5" rx="1" fill="#E0F2FE" />
      <path d="M2 14h30v2H2z" fill="#EF4444" />
      <path d="M2 16h30v1.5H2z" fill="#10B981" />
      <circle cx="9" cy="19" r="3" fill="#0F172A" />
      <circle cx="9" cy="19" r="1.2" fill="#E2E8F0" />
      <circle cx="25" cy="19" r="3" fill="#0F172A" />
      <circle cx="25" cy="19" r="1.2" fill="#E2E8F0" />
      <circle cx="31" cy="12" r="1.4" fill="#FEF08A" />
    </svg>
  );
}

interface ParticleBurst {
  id: number;
  x: number;
  y: number;
  color: string;
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
  const { lenis } = useLenis();
  const [level, setLevel] = useState<GameLevel>(1);
  const [selectedService, setSelectedService] = useState<ServiceOption>(
    SERVICES[0]
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState<"blog" | "guide" | null>(
    null
  );

  // Level 1 -> 2 portal state
  const [showStartPortal, setShowStartPortal] = useState(true);
  const [suctionInFlight, setSuctionInFlight] = useState(false);

  // Level 2 bubble pop + phone shake
  const [flyingBubble, setFlyingBubble] = useState<ServiceKey | null>(null);
  const [particles, setParticles] = useState<ParticleBurst[]>([]);
  const [phoneReactionKey, setPhoneReactionKey] = useState(0);

  // Level 3 radar state
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

  // 3D perspective tilt state
  const [tilt, setTilt] = useState({ rotateX: 4, rotateY: -6 });

  const stageRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const transitVehicleRef = useRef<HTMLDivElement>(null);
  const transitPathRef = useRef<SVGPathElement>(null);
  const transitVideoRef = useRef<HTMLVideoElement>(null);
  const transitTlRef = useRef<gsap.core.Timeline | null>(null);
  const jobVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    onLevelChange?.(level);
  }, [level, onLevelChange]);

  const resetGame = useCallback(() => {
    setLevel(1);
    setShowStartPortal(true);
    setSuctionInFlight(false);
    setFlyingBubble(null);
    setParticles([]);
    setRadarMatched(false);
    setTransitStageIdx(0);
    setTransitProgress(0);
    setTransitArrived(false);
    setDoubleSpeed(false);
    setJobProgress(0);
    setJobFinished(false);
    setPaymentPhase("ready");
    if (portalRef.current) {
      gsap.set(portalRef.current, {
        clearProps: "transform,opacity,clipPath,filter",
      });
    }
  }, []);

  useEffect(() => {
    if (resetSignal > 0) {
      resetGame();
    }
  }, [resetSignal, resetGame]);

  // Subtle 3D perspective tilt on pointer move
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse" || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({
        rotateX: Math.max(-8, Math.min(8, -ny * 10)),
        rotateY: Math.max(-10, Math.min(10, nx * 12)),
      });
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    setTilt({ rotateX: 4, rotateY: -6 });
  }, []);

  // Level 1 -> Level 2: GSAP spatial suction animation into smartphone center
  const handleStartGame = useCallback(() => {
    if (suctionInFlight || !portalRef.current) return;
    setSuctionInFlight(true);

    const ctx = gsap.context(() => {
      const portalEl = portalRef.current;
      const phoneEl = phoneRef.current;
      if (!portalEl) return;

      let deltaX = 0;
      let deltaY = 0;
      if (phoneEl) {
        const pRect = portalEl.getBoundingClientRect();
        const phRect = phoneEl.getBoundingClientRect();
        deltaX =
          phRect.left + phRect.width / 2 - (pRect.left + pRect.width / 2);
        deltaY =
          phRect.top + phRect.height / 2 - (pRect.top + pRect.height / 2);
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setShowStartPortal(false);
          setSuctionInFlight(false);
          setLevel(2);
        },
      });

      tl.to(portalEl, {
        x: deltaX,
        y: deltaY,
        scale: 0.08,
        rotation: -14,
        clipPath: "circle(12% at 50% 50%)",
        opacity: 0,
        duration: 0.72,
        ease: "power4.in",
      });
    }, stageRef);

    return () => ctx.revert();
  }, [suctionInFlight]);

  // Level 2 -> Level 3: Bubble pop + fly into phone + phone jump/shake
  const handleSelectService = useCallback(
    (service: ServiceOption, e: React.MouseEvent<HTMLButtonElement>) => {
      if (flyingBubble) return;
      setSelectedService(service);
      setFlyingBubble(service.key);

      // Particle burst around clicked bubble
      const rect = e.currentTarget.getBoundingClientRect();
      const stageRect = stageRef.current?.getBoundingClientRect();
      if (stageRect) {
        const cx = rect.left + rect.width / 2 - stageRect.left;
        const cy = rect.top + rect.height / 2 - stageRect.top;
        const burst: ParticleBurst[] = Array.from({ length: 10 }, (_, idx) => {
          const angle = (Math.PI * 2 * idx) / 10;
          const dist = 36 + (idx % 3) * 18;
          return {
            id: Date.now() + idx,
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            color: service.accent,
          };
        });
        setParticles(burst);
      }

      setTimeout(() => {
        setPhoneReactionKey((k) => k + 1);
      }, 180);

      setTimeout(() => {
        setParticles([]);
        setFlyingBubble(null);
        setRadarMatched(false);
        setLevel(3);
      }, 540);
    },
    [flyingBubble]
  );

  // Level 3: 2.0-second live radar matching
  useEffect(() => {
    if (level !== 3) return;
    setRadarMatched(false);
    const timer = setTimeout(() => {
      setRadarMatched(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [level]);

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

  // Update speed live without restarting timeline
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
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // Safety fallback if video cannot autoplay in headless/restricted environments
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
  }, [level, selectedService]);

  // Level 6: Payment send sequence
  const handleSendPayment = useCallback(() => {
    if (paymentPhase !== "ready") return;
    setPaymentPhase("sending");
    setTimeout(() => {
      setPaymentPhase("sent");
    }, 1350);
  }, [paymentPhase]);

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

  const ActiveServiceIcon = selectedService.Icon;
  const activeTransit = TRANSIT_STAGES[transitStageIdx] ?? TRANSIT_STAGES[0];
  const ActiveTransitIcon = activeTransit.Icon;

  const bubblePositions = useMemo(
    () => [
      {
        service: SERVICES[0],
        desktopClass:
          "md:top-[18%] md:left-[calc(50%-300px)] lg:left-[calc(50%-335px)]",
        floatDelay: 0,
      },
      {
        service: SERVICES[1],
        desktopClass:
          "md:top-[28%] md:right-[calc(50%-305px)] lg:right-[calc(50%-340px)]",
        floatDelay: 0.4,
      },
      {
        service: SERVICES[2],
        desktopClass:
          "md:bottom-[14%] md:left-[calc(50%-285px)] lg:left-[calc(50%-315px)]",
        floatDelay: 0.8,
      },
    ],
    []
  );

  return (
    <section
      id="game-stage"
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-[100dvh] md:h-[100dvh] overflow-hidden bg-gradient-to-br from-[#D4E1F5] via-[#DEE9FA] to-[#CEDCF2] text-[#0B1C30] flex flex-col justify-between select-none"
    >
      {/* Subtle studio ambient light & architectural dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "radial-gradient(#7A93B8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[780px] h-[420px] rounded-full bg-[#0660E4]/[0.11] blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[#D97706]/[0.08] blur-3xl" />
        <div className="absolute bottom-[-100px] left-[-80px] w-[380px] h-[380px] rounded-full bg-[#10B981]/[0.09] blur-3xl" />
      </div>

      {/* TOP GAME HUD */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-5 flex items-center justify-between gap-3">
        {/* Top-Left HUD: Logo + Level Pill + Skip to Full Site */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={resetGame}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#C5D4EA] shadow-[0_4px_14px_rgba(11,28,48,0.08)] hover:border-[#0660E4]/50 transition-colors cursor-pointer"
            title="Restart interactive demo"
          >
            <img
              src="/assets/serbify-mascot.png"
              alt="Serbify"
              className="w-6 h-6 object-contain"
            />
            <span className="font-bold text-sm sm:text-base tracking-[-0.02em] text-[#0B1C30]">
              Serbify
            </span>
          </button>

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C5D4EA] shadow-[0_4px_14px_rgba(11,28,48,0.08)] text-xs font-bold text-[#0B1C30] tabular-nums"
            aria-live="polite"
          >
            <span className="w-2 h-2 rounded-full bg-[#0660E4]" />
            <span>Level {level} of 6</span>
          </div>

          <button
            type="button"
            onClick={onSkipToSite}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#1E3A5F] bg-white/55 hover:bg-white hover:text-[#0660E4] border border-[#C5D4EA]/80 transition-colors cursor-pointer"
          >
            <span>Skip to Full Site</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top-Right: 48px Circular Hamburger Button */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          className="w-12 h-12 rounded-full bg-white border border-[#C5D4EA] shadow-[0_8px_22px_rgba(11,28,48,0.12)] flex items-center justify-center text-[#0B1C30] hover:border-[#0660E4]/50 hover:text-[#0660E4] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* CENTER INTERACTIVE STAGE */}
      <div className="relative z-20 flex-1 w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center py-3 sm:py-4">
        {/* Level 2 Particle Burst Layer */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 0.2,
              x: p.x + (Math.random() - 0.5) * 32,
              y: p.y + (Math.random() - 0.5) * 32,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ backgroundColor: p.color }}
            className="pointer-events-none absolute top-0 left-0 w-2.5 h-2.5 rounded-full z-40"
          />
        ))}

        {/* Level 2 Floating Service Bubbles (Desktop Orbit) */}
        <AnimatePresence>
          {level === 2 && (
            <div className="hidden md:block">
              {bubblePositions.map(({ service, desktopClass, floatDelay }) => {
                const Icon = service.Icon;
                const isFlying = flyingBubble === service.key;
                return (
                  <motion.button
                    key={service.key}
                    type="button"
                    initial={{ opacity: 0, scale: 0.6, y: 18 }}
                    animate={
                      isFlying
                        ? {
                            opacity: 0,
                            scale: 0.2,
                            x: 0,
                            y: 0,
                            transition: { duration: 0.42, ease: "easeIn" },
                          }
                        : {
                            opacity: 1,
                            scale: 1,
                            y: [0, -8, 0],
                            transition: {
                              opacity: { duration: 0.35, delay: floatDelay * 0.2 },
                              scale: { ...SPRING_TACTILE, delay: floatDelay * 0.2 },
                              y: {
                                duration: 3.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: floatDelay,
                              },
                            },
                          }
                    }
                    exit={{ opacity: 0, scale: 0.4 }}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => handleSelectService(service, e)}
                    className={`absolute ${desktopClass} z-30 flex items-center gap-3 px-4 py-3 rounded-[24px] bg-white border border-[#C5D4EA] shadow-[0_16px_38px_rgba(11,28,48,0.14)] hover:border-[#0660E4]/60 transition-colors cursor-pointer`}
                  >
                    <span
                      style={{
                        backgroundColor: service.softBg,
                        color: service.accent,
                      }}
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#0B1C30]">
                        {service.label}
                      </div>
                      <div className="text-xs font-semibold text-[#475569] tabular-nums">
                        {service.price}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* CENTERED 3D-TILTED SMARTPHONE CHASSIS */}
        <div
          style={{ perspective: "1200px" }}
          className="relative flex flex-col items-center justify-center"
        >
          <motion.div
            ref={phoneRef}
            key={phoneReactionKey}
            initial={
              phoneReactionKey > 0
                ? { y: 0, rotate: 0 }
                : false
            }
            animate={
              phoneReactionKey > 0
                ? {
                    y: [0, -22, 0],
                    rotate: [0, -3.5, 3.5, -2.5, 2, 0],
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                  }
                : {
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                  }
            }
            transition={
              phoneReactionKey > 0
                ? { duration: 0.55, ease: "easeOut" }
                : { type: "spring", stiffness: 180, damping: 22 }
            }
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-[292px] sm:w-[322px] h-[560px] sm:h-[600px] rounded-[44px] bg-[#0B1C30] p-[10px] shadow-[0_32px_70px_rgba(11,28,48,0.22),0_4px_16px_rgba(6,96,228,0.12)] border border-[#1E293B]"
          >
            {/* Side hardware buttons */}
            <div
              aria-hidden="true"
              className="absolute -left-[3px] top-28 w-[3px] h-10 rounded-l bg-[#1E293B]"
            />
            <div
              aria-hidden="true"
              className="absolute -left-[3px] top-42 w-[3px] h-10 rounded-l bg-[#1E293B]"
            />
            <div
              aria-hidden="true"
              className="absolute -right-[3px] top-32 w-[3px] h-14 rounded-r bg-[#1E293B]"
            />

            {/* Inner Screen */}
            <div className="relative w-full h-full rounded-[34px] bg-[#E7EEF8] overflow-hidden flex flex-col">
              {/* Dynamic Island + Status Bar */}
              <div className="relative z-20 px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold text-[#0B1C30] bg-white/95 backdrop-blur-md border-b border-[#C5D4EA]">
                <span className="tabular-nums">9:41</span>
                <div className="w-20 h-5 rounded-full bg-[#0B1C30] flex items-center justify-end pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-[10px] font-bold text-[#475569]">5G</span>
              </div>

              {/* SCREEN BODY BY LEVEL */}
              <div className="relative flex-1 flex flex-col justify-between p-4 overflow-hidden">
                {/* LEVEL 1 / 2 IDLE SCREEN */}
                {(level === 1 || level === 2) && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-[#64748B]">
                            Metro Manila
                          </p>
                          <h2 className="text-base font-extrabold text-[#0B1C30] tracking-[-0.02em]">
                            {level === 1
                              ? "Home Help, Ready"
                              : "Pick a Service"}
                          </h2>
                        </div>
                        <span className="w-9 h-9 rounded-full bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center">
                          <img
                            src="/assets/serbify-mascot.png"
                            alt="Serbify"
                            className="w-6 h-6 object-contain"
                          />
                        </span>
                      </div>

                      <div className="rounded-[20px] bg-white border border-[#E2E8F0] p-3.5 shadow-[0_6px_18px_rgba(11,28,48,0.04)]">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#0660E4]">
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                          <span>ID & NBI-Verified Local Pros</span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#475569] leading-relaxed">
                          {level === 1
                            ? "Upfront prices, live arrival map, and safe in-app payments."
                            : "Tap any floating service bubble around this phone to start your booking."}
                        </p>
                      </div>

                      {/* Preview cards inside phone */}
                      <div className="space-y-2 pt-1">
                        {SERVICES.map((item) => {
                          const Icon = item.Icon;
                          return (
                            <div
                              key={item.key}
                              className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white border border-[#E2E8F0]"
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  style={{
                                    backgroundColor: item.softBg,
                                    color: item.accent,
                                  }}
                                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                                >
                                  <Icon className="w-4 h-4" />
                                </span>
                                <div>
                                  <div className="text-xs font-bold text-[#0B1C30]">
                                    {item.label}
                                  </div>
                                  <div className="text-[11px] text-[#64748B]">
                                    {item.taskSummary}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-[#0B1C30] tabular-nums">
                                {item.price}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#EEF4FF] border border-[#0660E4]/20 px-3 py-2.5 text-center text-xs font-semibold text-[#0660E4]">
                      {level === 2
                        ? "Tap a floating bubble to drop it in"
                        : "Press Start to play"}
                    </div>
                  </div>
                )}

                {/* LEVEL 3: 2-SECOND LIVE RADAR MATCHING */}
                {level === 3 && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-[#0B1C30]">
                          Finding {selectedService.label}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            radarMatched
                              ? "bg-[#ECFDF5] text-[#065F46]"
                              : "bg-[#EEF4FF] text-[#0660E4]"
                          }`}
                        >
                          {radarMatched ? "Matched" : "Scanning"}
                        </span>
                      </div>

                      {/* Concentric Radar Map */}
                      <div className="relative h-56 rounded-[24px] bg-[#EEF4FF] border border-[#E2E8F0] overflow-hidden flex items-center justify-center">
                        {/* Neighborhood grid lines */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-50"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                          }}
                        />

                        {/* Concentric radar rings */}
                        {[1, 2, 3].map((ring) => (
                          <motion.div
                            key={ring}
                            initial={{ scale: 0.35, opacity: 0.7 }}
                            animate={{ scale: 1.45, opacity: 0 }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              delay: ring * 0.45,
                              ease: "easeOut",
                            }}
                            className="absolute w-36 h-36 rounded-full border-2 border-[#0660E4]/50 bg-[#0660E4]/10"
                          />
                        ))}

                        {/* Center customer pin */}
                        <div className="relative z-10 w-10 h-10 rounded-full bg-[#0660E4] text-white shadow-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>

                        {/* Matched Pro Pin */}
                        <AnimatePresence>
                          {radarMatched && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={SPRING_TACTILE}
                              className="absolute top-6 right-7 z-10 px-2.5 py-1 rounded-full bg-[#10B981] text-white text-[11px] font-bold shadow-md flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Kuya Marco</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Matched Pro Card + Next Button */}
                    <AnimatePresence mode="wait">
                      {radarMatched ? (
                        <motion.div
                          key="matched-card"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={SPRING_TACTILE}
                          className="space-y-3"
                        >
                          <div className="rounded-[24px] bg-white border border-[#10B981]/40 p-3.5 shadow-[0_10px_24px_rgba(16,185,129,0.12)]">
                            <div className="flex items-start gap-2.5">
                              <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-extrabold text-[#0B1C30] leading-snug">
                                  Kuya Marco • Verified {selectedService.label}{" "}
                                  • 4.9★
                                </div>
                                <div className="mt-1 text-[11px] text-[#475569]">
                                  Gov&apos;t ID &amp; NBI checked • Upfront{" "}
                                  {selectedService.samplePrice}
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setLevel(4)}
                            className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.28)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="scanning-hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl bg-white border border-[#E2E8F0] px-3.5 py-3 text-center text-xs font-semibold text-[#475569]"
                        >
                          Checking nearby verified{" "}
                          {selectedService.label.toLowerCase()}s...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* LEVEL 4: MULTI-MODAL ZIGZAG HIGHWAY TRANSIT */}
                {level === 4 && (
                  <div className="flex-1 flex flex-col justify-between gap-2.5">
                    {/* Top Row + 2x Speed Pill */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-[#0B1C30]">
                          Kuya Marco is on the way
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          Point A → Your House
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDoubleSpeed((s) => !s)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          doubleSpeed
                            ? "bg-[#0660E4] text-white border-[#0660E4]"
                            : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#0660E4]"
                        }`}
                      >
                        2x Speed
                      </button>
                    </div>

                    {/* Video Viewport + Zigzag Asphalt Highway Overlay */}
                    <div className="relative rounded-[20px] bg-[#0F172A] border border-[#E2E8F0] overflow-hidden shadow-inner">
                      <video
                        ref={transitVideoRef}
                        src="/animations/transit-zigzag.mp4"
                        muted
                        playsInline
                        autoPlay
                        loop
                        className="w-full h-28 object-cover opacity-55"
                      />

                      {/* Vector Zigzag Asphalt Highway with GSAP MotionPath */}
                      <div className="relative h-32 bg-[#1E293B] border-t border-white/10 px-2 py-1">
                        <svg
                          viewBox="0 0 260 110"
                          className="w-full h-full overflow-visible"
                          aria-label="Zigzag highway route from Point A to your house"
                        >
                          {/* Asphalt Road Base */}
                          <path
                            d="M 22 92 L 90 92 L 70 55 L 185 55 L 155 20 L 236 20"
                            fill="none"
                            stroke="#334155"
                            strokeWidth="18"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Crisp White Dashed Center Line */}
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

                          {/* Point A */}
                          <circle cx="22" cy="92" r="7" fill="#0660E4" />
                          <text
                            x="22"
                            y="108"
                            textAnchor="middle"
                            fill="#CBD5E1"
                            fontSize="8"
                            fontWeight="700"
                          >
                            Point A
                          </text>

                          {/* Point B (House) */}
                          <circle cx="236" cy="20" r="8" fill="#10B981" />
                          <text
                            x="236"
                            y="37"
                            textAnchor="middle"
                            fill="#A7F3D0"
                            fontSize="8"
                            fontWeight="700"
                          >
                            House
                          </text>
                        </svg>

                        {/* Moving GSAP MotionPath Vehicle Marker */}
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

                    {/* Live Transport Stage & Progress Bar */}
                    <div className="rounded-2xl bg-white border border-[#E2E8F0] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">
                            {activeTransit.isJeepney ? (
                              <JeepneyBadge className="w-5 h-4" />
                            ) : (
                              <ActiveTransitIcon className="w-4 h-4 text-[#0660E4]" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#0B1C30] truncate">
                              {activeTransit.label}
                            </div>
                            <div className="text-[10px] font-semibold text-[#64748B] tabular-nums">
                              Stage {transitStageIdx + 1} of 6 •{" "}
                              {activeTransit.mode}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#0660E4] tabular-nums">
                          {Math.round(transitProgress * 100)}%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          style={{ width: `${transitProgress * 100}%` }}
                          className="h-full rounded-full bg-[#0660E4] transition-all duration-100"
                        />
                      </div>
                    </div>

                    {/* Arrived Status + Next */}
                    <AnimatePresence>
                      {transitArrived && (
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={SPRING_TACTILE}
                          className="space-y-2.5"
                        >
                          <div className="rounded-2xl bg-[#ECFDF5] border border-[#10B981]/40 px-3 py-2.5 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                            <span className="text-xs font-bold text-[#065F46]">
                              Your {selectedService.label} Has Arrived!
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLevel(5)}
                            className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.28)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* LEVEL 5: DOING THE JOB (3D VIDEO PLAYBACK) */}
                {level === 5 && (
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-xs font-extrabold text-[#0B1C30]">
                            {selectedService.label} at Work
                          </div>
                          <div className="text-[11px] text-[#64748B]">
                            {selectedService.taskSummary}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold">
                          {jobFinished ? "Done" : "In Progress"}
                        </span>
                      </div>

                      {/* #F8FAFC-blended 3D Video Frame */}
                      <div className="relative rounded-[24px] bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden shadow-[0_8px_22px_rgba(11,28,48,0.06)]">
                        <video
                          ref={jobVideoRef}
                          key={selectedService.videoSrc}
                          src={selectedService.videoSrc}
                          muted
                          playsInline
                          autoPlay
                          className="w-full h-56 object-cover bg-[#F8FAFC]"
                        />
                        <div className="px-3.5 py-2.5 bg-white border-t border-[#E2E8F0]">
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#475569] mb-1.5">
                            <span>Repair Progress</span>
                            <span className="tabular-nums text-[#0660E4]">
                              {Math.round(jobProgress * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                            <div
                              style={{ width: `${jobProgress * 100}%` }}
                              className="h-full rounded-full bg-[#10B981] transition-all duration-150"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {jobFinished ? (
                        <motion.div
                          key="job-done"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={SPRING_TACTILE}
                          className="space-y-2.5"
                        >
                          <div className="rounded-2xl bg-[#ECFDF5] border border-[#10B981]/40 px-3.5 py-3 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                            <span className="text-xs font-bold text-[#065F46] leading-snug">
                              Job Finished! Everything is fixed and tested.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentPhase("ready");
                              setLevel(6);
                            }}
                            className="w-full py-3 rounded-2xl bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.28)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Pay the {selectedService.label}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="job-working"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl bg-white border border-[#E2E8F0] px-3.5 py-3 text-center text-xs font-semibold text-[#475569]"
                        >
                          Kuya Marco is completing the repair...
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* LEVEL 6: SENDING PAYMENT -> HOME */}
                {level === 6 && (
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="text-xs font-extrabold text-[#0B1C30]">
                        Safe In-App Payment
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Release funds now that you&apos;ve checked the work
                      </div>

                      {/* Payment Transfer Visual */}
                      <div className="mt-3 rounded-[24px] bg-white border border-[#E2E8F0] p-4 shadow-[0_8px_22px_rgba(11,28,48,0.05)] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#0660E4] flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="text-xs font-bold text-[#0B1C30]">
                                GCash / Maya / Cash
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Your Account
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-extrabold text-[#0B1C30] tabular-nums">
                            {selectedService.samplePrice}
                          </span>
                        </div>

                        {/* Animated Pulse Track */}
                        <div className="relative h-8 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-[#E2E8F0] rounded-full" />
                          {paymentPhase === "sending" && (
                            <motion.div
                              initial={{ x: -85, opacity: 0, scale: 0.8 }}
                              animate={{ x: 85, opacity: [0, 1, 1, 0], scale: 1.15 }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                              className="absolute px-2.5 py-1 rounded-full bg-[#0660E4] text-white text-[10px] font-bold shadow-md"
                            >
                              Sending {selectedService.samplePrice}
                            </motion.div>
                          )}
                          {paymentPhase === "sent" && (
                            <motion.div
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={SPRING_TACTILE}
                              className="absolute px-2.5 py-1 rounded-full bg-[#10B981] text-white text-[10px] font-bold shadow-sm flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Transferred</span>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                              <Wallet className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="text-xs font-bold text-[#0B1C30]">
                                Kuya Marco&apos;s Wallet
                              </div>
                              <div className="text-[10px] text-[#64748B]">
                                Verified {selectedService.label}
                              </div>
                            </div>
                          </div>
                          <ActiveServiceIcon className="w-4 h-4 text-[#64748B]" />
                        </div>
                      </div>
                    </div>

                    {paymentPhase === "ready" && (
                      <button
                        type="button"
                        onClick={handleSendPayment}
                        className="w-full py-3.5 rounded-2xl bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_8px_20px_rgba(6,96,228,0.28)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Pay the {selectedService.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {paymentPhase === "sending" && (
                      <div className="w-full py-3.5 rounded-2xl bg-[#EEF4FF] text-[#0660E4] text-sm font-bold text-center">
                        Sending payment safely...
                      </div>
                    )}

                    {paymentPhase === "sent" && (
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={SPRING_TACTILE}
                        className="space-y-3"
                      >
                        <div className="rounded-[24px] bg-[#ECFDF5] border border-[#10B981]/40 p-3.5 text-center">
                          <div className="text-xs font-extrabold text-[#065F46]">
                            Payment Sent to Your {selectedService.label}!
                          </div>
                          {/* 5 Twinkling Amber Stars */}
                          <div className="mt-2 flex items-center justify-center gap-1.5">
                            {[0, 1, 2, 3, 4].map((starIdx) => (
                              <motion.span
                                key={starIdx}
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{
                                  scale: [1, 1.22, 1],
                                  rotate: 0,
                                }}
                                transition={{
                                  scale: {
                                    duration: 1.4,
                                    repeat: Infinity,
                                    delay: starIdx * 0.16,
                                  },
                                  rotate: { duration: 0.3, delay: starIdx * 0.08 },
                                }}
                              >
                                <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={onSkipToSite}
                          className="w-full py-3.5 rounded-2xl bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_10px_28px_rgba(6,96,228,0.42)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Home className="w-4 h-4" />
                          <span>Home</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Level 2 Mobile Service Bubbles (cleanly below/around phone on < md) */}
        <AnimatePresence>
          {level === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 grid grid-cols-3 gap-2 w-full max-w-[340px] md:hidden"
            >
              {SERVICES.map((service) => {
                const Icon = service.Icon;
                return (
                  <button
                    key={service.key}
                    type="button"
                    onClick={(e) => handleSelectService(service, e)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-white border border-[#C5D4EA] shadow-[0_8px_20px_rgba(11,28,48,0.10)] active:scale-95 transition-transform cursor-pointer"
                  >
                    <span
                      style={{
                        backgroundColor: service.softBg,
                        color: service.accent,
                      }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-[#0B1C30]">
                      {service.label}
                    </span>
                    <span className="text-[10px] font-semibold text-[#475569] tabular-nums">
                      {service.price}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEVEL 1 PORTAL OVERLAY (GSAP Spatial Suction into Phone) */}
        {showStartPortal && (
          <div
            ref={portalRef}
            className="absolute inset-0 z-30 flex items-center justify-center px-4 pointer-events-auto"
          >
            <div className="w-full max-w-md rounded-[24px] bg-white border border-[#C5D4EA] p-6 sm:p-8 text-center shadow-[0_24px_64px_rgba(11,28,48,0.18)]">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#EEF4FF] border border-[#E2E8F0] flex items-center justify-center mb-4">
                <img
                  src="/assets/serbify-mascot.png"
                  alt="Serbify mascot"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0B1C30] leading-tight">
                Try Serbify in 30 Seconds
              </h1>
              <p className="mt-2.5 text-sm text-[#475569] leading-relaxed">
                Pick a service, match with a verified local pro, watch them
                arrive, and send payment safely.
              </p>
              <button
                type="button"
                onClick={handleStartGame}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-base font-bold shadow-[0_12px_28px_rgba(6,96,228,0.32)] hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM STAGE FOOTER HINT */}
      <div className="relative z-20 pb-3 sm:pb-4 px-4 flex items-center justify-center gap-3 text-xs text-[#334155]">
        {level > 1 && (
          <button
            type="button"
            onClick={resetGame}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C5D4EA] text-[#1E3A5F] hover:text-[#0B1C30] shadow-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Demo</span>
          </button>
        )}
        <span className="hidden sm:inline font-medium">
          Interactive 6-level walkthrough
        </span>
      </div>

      {/* TOP-RIGHT GLASSMORPHIC SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-[#0B1C30]/25 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={SPRING_NAV}
              aria-label="Site navigation"
              className="fixed top-3 right-3 bottom-3 z-50 w-[min(340px,calc(100vw-24px))] rounded-[24px] bg-white/92 backdrop-blur-2xl border border-[#E2E8F0] shadow-[0_24px_60px_rgba(11,28,48,0.18)] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/serbify-mascot.png"
                      alt="Serbify"
                      className="w-7 h-7 object-contain"
                    />
                    <span className="font-bold text-base text-[#0B1C30]">
                      Serbify
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B1C30] hover:border-[#0660E4]/40 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection("#landing-experience")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#0B1C30] hover:bg-[#EEF4FF] hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Serbify</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("#verified-pros")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#0B1C30] hover:bg-[#EEF4FF] hover:text-[#0660E4] transition-colors cursor-pointer"
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
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#0B1C30] hover:bg-[#EEF4FF] hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>Blog</span>
                    </span>
                    <FileText className="w-4 h-4 opacity-50" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("#services")}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#0B1C30] hover:bg-[#EEF4FF] hover:text-[#0660E4] transition-colors cursor-pointer"
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
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left text-sm font-bold text-[#0B1C30] hover:bg-[#EEF4FF] hover:text-[#0660E4] transition-colors cursor-pointer"
                  >
                    <span>Guide</span>
                    <BookOpen className="w-4 h-4 opacity-50" />
                  </button>
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
                <button
                  type="button"
                  onClick={() => scrollToSection("#download-app")}
                  className="w-full py-3.5 px-5 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold shadow-[0_10px_24px_rgba(6,96,228,0.28)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Serbify</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CLEAN PREVIEW MODAL FOR BLOG & GUIDE */}
      <AnimatePresence>
        {previewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B1C30]/30 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPreviewModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={SPRING_TACTILE}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[24px] bg-white border border-[#E2E8F0] p-6 shadow-[0_24px_64px_rgba(11,28,48,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4FF] text-[#0660E4] text-xs font-bold">
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
                  className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0B1C30] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {previewModal === "blog" ? (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-extrabold text-[#0B1C30]">
                    How Upfront Pricing Ends Home Repair Guessing
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    Read how Metro Manila homeowners compare standard inspection
                    rates before booking—and why paying only after checking the
                    finished work gives everyone peace of mind.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-extrabold text-[#0B1C30]">
                    Quick Homeowner Booking Guide
                  </h3>
                  <ul className="space-y-2 text-sm text-[#475569]">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                      <span>
                        Pin your exact address and pick the trade you need.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                      <span>
                        Check your pro&apos;s verified ID badge before they
                        arrive.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
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
                className="mt-5 w-full py-3 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-sm font-bold transition-colors cursor-pointer"
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
