"use client";

import { useEffect, useState } from "react";
import { useLenis } from "./LenisProvider";
import { MagneticButton } from "./KineticPrimitives";
import { COPY } from "./SerbifyCopy";

export function FloatingNavbar() {
  const t = COPY.en.nav;
  const { lenis } = useLenis();
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setCondensed(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    if (href === "#") {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.querySelector(href);
    if (target instanceof HTMLElement && lenis) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -24 });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col items-center justify-center px-3 py-3 md:px-6 md:py-4 pointer-events-none">
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.84)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderColor: "rgba(18, 23, 38, 0.10)",
          boxShadow: "0 8px 24px -6px rgba(18, 23, 38, 0.08)",
        }}
        className={`h-14 md:h-16 w-full max-w-7xl mx-auto flex items-center justify-between px-3.5 md:px-6 rounded-full border pointer-events-auto gap-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
          condensed ? "scale-[0.985]" : "scale-100"
        }`}
      >
        {/* Left: Brand */}
        <div className="flex items-center min-w-0">
          <a
            href="#"
            onClick={(e) => handleAnchorClick(e, "#")}
            className="flex items-center gap-2 text-[#121726] font-bold text-base md:text-xl tracking-[-0.02em] shrink-0"
          >
            <img
              src="/assets/serbify-mascot.png"
              alt="Serbify"
              className="w-8 h-8 md:w-9 md:h-9 object-contain shrink-0"
            />
            <span className="text-[#121726]">Serbify</span>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#4B5565]">
          <a
            href="#services"
            onClick={(e) => handleAnchorClick(e, "#services")}
            className="hover:text-[#0660E4] transition-colors"
          >
            {t.services}
          </a>
          <a
            href="#verified-pros"
            onClick={(e) => handleAnchorClick(e, "#verified-pros")}
            className="hover:text-[#0660E4] transition-colors"
          >
            {t.verifiedPros}
          </a>
          <a
            href="#trust-safety"
            onClick={(e) => handleAnchorClick(e, "#trust-safety")}
            className="hover:text-[#0660E4] transition-colors"
          >
            {t.trust}
          </a>
          <a
            href="#coverage"
            onClick={(e) => handleAnchorClick(e, "#coverage")}
            className="hover:text-[#0660E4] transition-colors"
          >
            {t.coverage}
          </a>
        </nav>

        {/* Right: Download CTA */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <MagneticButton
            href="#download-app"
            onClick={(e) =>
              handleAnchorClick(
                e as React.MouseEvent<HTMLAnchorElement>,
                "#download-app"
              )
            }
            className="inline-flex items-center justify-center px-3.5 md:px-5 py-2 md:py-2.5 rounded-full bg-[#0660E4] hover:bg-[#044BB5] text-white text-xs md:text-sm font-bold transition-colors shadow-[0_6px_18px_rgba(6,96,228,0.22)]"
          >
            {t.download}
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}
