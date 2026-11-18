"use client";

import dynamic from "next/dynamic";

function HeroRadarFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-45"
    >
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 65% 45%, black 15%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 65% 45%, black 15%, transparent 80%)",
        }}
      />
    </div>
  );
}

export const HeroRadarBackground = dynamic(() => import("./HeroRadarScene"), {
  ssr: false,
  loading: () => <HeroRadarFallback />,
});
