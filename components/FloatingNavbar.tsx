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
      <div className="h-14 md:h-20 w-full max-w-7xl mx-auto flex items-center justify-between px-3.5 md:px-6 bg-white/86 backdrop-blur-xl rounded-full border border-[#18181B]/[0.07] shadow-[0_20px_44px_-12px_rgba(28,25,23,0.07)] pointer-events-auto gap-2">
        {/* Left: Brand + Segmented Persona Pill */}
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
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

          {/* For Clients / For Pros Segmented Pill (Desktop/Tablet) */}
          <div
            role="tablist"
            aria-label="Audience mode"
            className="hidden md:flex items-center p-1 bg-[#EFECE6] rounded-full border border-[#18181B]/[0.07]"
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
                      ? "text-[#121726]"
                      : "text-[#4B5565] hover:text-[#121726]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-persona-pill"
                      transition={SPRING_NAV}
                      className="absolute inset-0 bg-white rounded-full shadow-xs border border-[#18181B]/[0.08]"
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

      {/* Compact Mobile Persona Toggle (< md) */}
      <div className="md:hidden flex items-center p-1 bg-white/88 backdrop-blur-xl rounded-full border border-[#18181B]/[0.07] shadow-xs pointer-events-auto">
        {(["client", "pro"] as const).map((item) => {
          const active = persona === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setPersona(item)}
              className={`relative px-3 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                active ? "text-[#121726]" : "text-[#4B5565]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-persona-pill-mobile"
                  transition={SPRING_NAV}
                  className="absolute inset-0 bg-[#EFECE6] rounded-full border border-[#18181B]/[0.07]"
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
