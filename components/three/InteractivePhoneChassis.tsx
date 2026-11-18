"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLenis } from "../LenisProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface InteractivePhoneChassisProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scrollTilt?: boolean;
  /** Optional floating satellite badges rendered inside the 3D space */
  badges?: ReactNode;
}

/**
 * 3D interactive phone chassis wrapper with pointer-driven rotateX/rotateY,
 * optional GSAP ScrollTrigger scrub tilt, layered glassmorphic rim highlights,
 * and preserve-3d depth support for floating satellite badges.
 */
export function InteractivePhoneChassis({
  children,
  className = "",
  maxTilt = 8,
  scrollTilt = true,
  badges,
}: InteractivePhoneChassisProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useLenis();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(20);

  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 24,
  });
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 24,
  });

  const rimHighlight = useMotionTemplate`radial-gradient(420px circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.28), transparent 65%)`;

  useEffect(() => {
    const el = scrollWrapperRef.current;
    if (!el || !scrollTilt || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotateX: 3, rotateY: -4 },
        {
          rotateX: -3,
          rotateY: 4,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, scrollWrapperRef);

    return () => ctx.revert();
  }, [scrollTilt, prefersReducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(Math.max(-1, Math.min(1, nx)));
    rawY.set(Math.max(-1, Math.min(1, ny)));
    sheenX.set(((e.clientX - rect.left) / rect.width) * 100);
    sheenY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
    sheenX.set(50);
    sheenY.set(20);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: "1200px" }}
      className={`relative flex items-center justify-center ${className}`}
    >
      <div
        ref={scrollWrapperRef}
        style={{ transformStyle: "preserve-3d" }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          style={{
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          {/* Phone Frame */}
          <div className="relative" style={{ transform: "translateZ(0px)" }}>
            {children}

            {/* Layered Glassmorphic Rim Highlight */}
            <motion.div
              aria-hidden="true"
              style={{ background: rimHighlight }}
              className="pointer-events-none absolute inset-0 rounded-[44px] z-40 mix-blend-overlay"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-inset ring-white/25 z-40"
            />
          </div>

          {/* Floating Z-Depth Satellite Badges */}
          {badges}
        </motion.div>
      </div>
    </div>
  );
}
