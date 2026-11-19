"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLenis } from "./LenisProvider";
import { SPRING_TACTILE } from "./serbifyTheme";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface KineticHeadlineLine {
  text: string;
  className?: string;
}

interface KineticHeadlineProps {
  lines: KineticHeadlineLine[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  immediate?: boolean;
  delay?: number;
  triggerKey?: string;
}

/**
 * GSAP-powered masked line-by-line clip reveal (yPercent: 110 -> 0, rotate: 1.5deg -> 0deg, expo.out).
 */
export function KineticHeadline({
  lines,
  as: Tag = "h2",
  className = "",
  immediate = false,
  delay = 0,
  triggerKey,
}: KineticHeadlineProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { prefersReducedMotion } = useLenis();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const innerLines = el.querySelectorAll<HTMLElement>("[data-kinetic-line]");
      if (!innerLines.length) return;

      gsap.set(innerLines, {
        yPercent: 110,
        rotate: 1.5,
        transformOrigin: "0% 100%",
      });

      if (immediate) {
        gsap.to(innerLines, {
          yPercent: 0,
          rotate: 0,
          duration: 0.85,
          stagger: 0.08,
          delay,
          ease: "expo.out",
          clearProps: "transform",
        });
      } else {
        gsap.to(innerLines, {
          yPercent: 0,
          rotate: 0,
          duration: 0.85,
          stagger: 0.08,
          delay,
          ease: "expo.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [immediate, delay, prefersReducedMotion, triggerKey]);

  return (
    <Tag ref={containerRef} className={className}>
      {lines.map((line, idx) => (
        <span
          key={`${idx}-${line.text}`}
          className="block overflow-hidden pb-[0.06em]"
        >
          <span
            data-kinetic-line
            className={`block will-change-transform ${line.className ?? ""}`}
          >
            {line.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}

interface CounterRollUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  from?: number;
  duration?: number;
  immediate?: boolean;
  className?: string;
}

/**
 * GSAP ScrollTrigger tabular-nums counter roll-up for prices and ETAs.
 */
export function CounterRollUp({
  target,
  prefix = "",
  suffix = "",
  from = 0,
  duration = 1.1,
  immediate = false,
  className = "",
}: CounterRollUpProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const { prefersReducedMotion } = useLenis();

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = `${prefix}${Math.round(target).toLocaleString()}${suffix}`;
      return;
    }

    const proxy = { val: from };
    const ctx = gsap.context(() => {
      const animConfig: gsap.TweenVars = {
        val: target,
        duration,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(proxy.val).toLocaleString()}${suffix}`;
        },
      };

      if (!immediate) {
        animConfig.scrollTrigger = {
          trigger: el,
          start: "top 92%",
          once: true,
        };
      }

      gsap.to(proxy, animConfig);
    }, spanRef);

    return () => ctx.revert();
  }, [target, from, prefix, suffix, duration, immediate, prefersReducedMotion]);

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`}>
      {prefix}
      {Math.round(target).toLocaleString()}
      {suffix}
    </span>
  );
}

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  accent?: "cobalt" | "emerald" | "violet";
  dark?: boolean;
}

const ACCENT_RGBA: Record<"cobalt" | "emerald" | "violet", string> = {
  cobalt: "rgba(6, 96, 228, 0.42)",
  emerald: "rgba(16, 185, 129, 0.44)",
  violet: "rgba(124, 92, 252, 0.4)",
};

const SURFACE_RGBA: Record<"cobalt" | "emerald" | "violet", string> = {
  cobalt: "rgba(6, 96, 228, 0.045)",
  emerald: "rgba(16, 185, 129, 0.055)",
  violet: "rgba(124, 92, 252, 0.045)",
};

/**
 * Cursor-tracking radial border & surface spotlight card.
 * Updates CSS custom properties directly on pointermove for zero re-renders.
 */
export function SpotlightCard({
  children,
  className = "",
  accent = "cobalt",
  dark = false,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--spot-opacity", "0");
  };

  const borderGlowStyle: CSSProperties = {
    background: `radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${ACCENT_RGBA[accent]}, transparent 70%)`,
    opacity: "var(--spot-opacity, 0)" as unknown as number,
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    padding: "1.5px",
  };

  const surfaceGlowStyle: CSSProperties = {
    background: `radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${
      dark ? "rgba(6, 96, 228, 0.11)" : SURFACE_RGBA[accent]
    }, transparent 72%)`,
    opacity: "var(--spot-opacity, 0)" as unknown as number,
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Radial border illumination */}
      <div
        aria-hidden="true"
        style={borderGlowStyle}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
      />
      {/* Subtle surface sheen */}
      <div
        aria-hidden="true"
        style={surfaceGlowStyle}
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
      />
      <div className="relative z-10 h-full flex flex-col justify-between gap-inherit">
        {children}
      </div>
    </div>
  );
}

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  strength?: number;
}

/**
 * Tactile magnetic pull wrapper for primary #0660E4 CTAs.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 0.24,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useLenis();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 320, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 320, damping: 22, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-10, Math.min(10, dx)));
    y.set(Math.max(-8, Math.min(8, dy)));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_TACTILE}
      className="inline-flex"
    >
      {href ? (
        <a href={href} onClick={onClick} className={className}>
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={className}>
          {children}
        </button>
      )}
    </motion.div>
  );
}

interface TactileTokenBadgeProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  title?: string;
  maxTilt?: number;
  pulseOnScroll?: boolean;
}

/**
 * Badgey-inspired tactile physical token with 1px specular inner border,
 * ±6deg quickTo hover tilt, and crisp spring-snap scale pulse on click or scroll-in.
 */
export function TactileTokenBadge({
  children,
  className = "",
  style,
  onClick,
  title,
  maxTilt = 6,
  pulseOnScroll = true,
}: TactileTokenBadgeProps) {
  const tokenRef = useRef<HTMLDivElement>(null);
  const quickRX = useRef<gsap.QuickToFunc | null>(null);
  const quickRY = useRef<gsap.QuickToFunc | null>(null);
  const { prefersReducedMotion } = useLenis();

  useEffect(() => {
    const el = tokenRef.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { transformPerspective: 600 });
      quickRX.current = gsap.quickTo(el, "rotateX", {
        duration: 0.35,
        ease: "power3.out",
      });
      quickRY.current = gsap.quickTo(el, "rotateY", {
        duration: 0.35,
        ease: "power3.out",
      });

      if (pulseOnScroll) {
        gsap.fromTo(
          el,
          { scale: 0.96 },
          {
            scale: 1,
            duration: 0.55,
            ease: "expo.out",
            clearProps: "scale",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          }
        );
      }
    }, tokenRef);

    return () => {
      quickRX.current = null;
      quickRY.current = null;
      ctx.revert();
    };
  }, [prefersReducedMotion, pulseOnScroll]);

  const triggerSnapPulse = () => {
    if (prefersReducedMotion || !tokenRef.current) return;
    gsap.fromTo(
      tokenRef.current,
      { scale: 1 },
      {
        scale: 1.05,
        duration: 0.14,
        ease: "power3.out",
        yoyo: true,
        repeat: 1,
        clearProps: "scale",
      }
    );
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch" || !tokenRef.current)
      return;
    const rect = tokenRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    quickRX.current?.(-ny * maxTilt * 2);
    quickRY.current?.(nx * maxTilt * 2);
  };

  const handlePointerLeave = () => {
    if (prefersReducedMotion) return;
    quickRX.current?.(0);
    quickRY.current?.(0);
  };

  return (
    <div
      ref={tokenRef}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={title}
      onClick={() => {
        triggerSnapPulse();
        onClick?.();
      }}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerSnapPulse();
                onClick();
              }
            }
          : undefined
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * Tarsi-style architectural corner registration ticks (+) at the 4 outer corners of framed sections.
 */
export function SectionCornerTicks({ dark = false }: { dark?: boolean }) {
  const strokeColor = dark
    ? "rgba(255, 255, 255, 0.18)"
    : "rgba(18, 23, 38, 0.16)";
  const corners = [
    "top-3.5 left-3.5",
    "top-3.5 right-3.5",
    "bottom-3.5 left-3.5",
    "bottom-3.5 right-3.5",
  ];
  return (
    <>
      {corners.map((pos, idx) => (
        <svg
          key={idx}
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`pointer-events-none absolute ${pos} w-3 h-3 z-20`}
        >
          <path
            d="M6 1v10M1 6h10"
            stroke={strokeColor}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </>
  );
}
