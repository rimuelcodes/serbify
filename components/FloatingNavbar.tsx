"use client";

import { motion } from "framer-motion";
import { useLenis } from "./LenisProvider";
import { MagneticButton } from "./KineticPrimitives";
import { COPY, type Persona } from "./SerbifyCopy";
import { SPRING_NAV } from "./serbifyTheme";

interface FloatingNavbarProps {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

export function FloatingNavbar({
  persona,
  setPersona,
}: FloatingNavbarProps) {
  const t = COPY.en.nav;
  const { lenis } = useLenis();

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
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col items-center justify-center px-3 py-3 md:px-6 md:py-4 pointer-events-none gap-2">
      <div className="h-14 md:h-20 w-full max-w-7xl mx-auto flex items-center justify-between px-3.5 md:px-6 bg-white/85 backdrop-blur-xl rounded-full border border-[#E2E8F0] shadow-[0_4px_24px_rgba(11,28,48,0.05)] pointer-events-auto gap-2">
        {/* Left: Brand + Segmented Persona Pill */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <a
            href="#"
            onClick={(e) => handleAnchorClick(e, "#")}
            className="flex items-center gap-2 text-[#0660E4] font-bold text-base md:text-xl tracking-[-0.02em] shrink-0"
          >
            <img
              src="/assets/serbify-mascot.png"
              alt="Serbify"
              className="w-8 h-8 md:w-9 md:h-9 object-contain shrink-0"
            />
            <span className="text-[#0B1C30]">Serbify</span>
          </a>

          {/* For Clients / For Pros Segmented Pill (Desktop/Tablet) */}
          <div
            role="tablist"
            aria-label="Audience mode"
            className="hidden md:flex items-center p-1 bg-[#F1F5F9] rounded-full border border-[#E2E8F0]"
          >
            {(["client", "pro"] as const).map((item) => {
              const active = persona === item;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPersona(item)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "text-[#0B1C30]"
                      : "text-[#64748B] hover:text-[#0B1C30]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-persona-pill"
                      transition={SPRING_NAV}
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-[#E2E8F0]/80"
                    />
                  )}
                  <span className="relative z-10">
                    {item === "client" ? t.clients : t.pros}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#475569]">
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
            className="inline-flex items-center justify-center px-3.5 md:px-5 py-2 md:py-2.5 rounded-full bg-[#0660E4] hover:bg-[#004AB4] text-white text-xs md:text-sm font-bold transition-colors shadow-[0_4px_14px_rgba(6,96,228,0.2)]"
          >
            {t.download}
          </MagneticButton>
        </div>
      </div>

      {/* Compact Mobile Persona Toggle (< md) */}
      <div className="md:hidden flex items-center p-1 bg-white/90 backdrop-blur-xl rounded-full border border-[#E2E8F0] shadow-xs pointer-events-auto">
        {(["client", "pro"] as const).map((item) => {
          const active = persona === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setPersona(item)}
              className={`relative px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                active ? "text-[#0B1C30]" : "text-[#64748B]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-persona-pill-mobile"
                  transition={SPRING_NAV}
                  className="absolute inset-0 bg-[#F1F5F9] rounded-full border border-[#E2E8F0]"
                />
              )}
              <span className="relative z-10">
                {item === "client" ? t.clients : t.pros}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
