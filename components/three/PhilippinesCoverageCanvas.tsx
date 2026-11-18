"use client";

import dynamic from "next/dynamic";

function CoverageMapFallback() {
  return (
    <div className="relative w-full h-[270px] flex flex-col items-center justify-center rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
      <svg
        className="w-full h-full text-[#DCE9FF]"
        fill="none"
        viewBox="0 0 400 300"
      >
        <path
          d="M170 30 C190 20, 220 50, 230 80 C240 110, 220 130, 200 140 C180 150, 160 120, 150 90 Z"
          fill="currentColor"
        />
        <circle cx="230" cy="180" fill="currentColor" r="18" />
        <path
          d="M220 220 C260 210, 280 240, 270 270 C240 290, 200 270, 210 240 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export const PhilippinesCoverageMap3D = dynamic(
  () => import("./PhilippinesCoverageScene"),
  {
    ssr: false,
    loading: () => <CoverageMapFallback />,
  }
);
