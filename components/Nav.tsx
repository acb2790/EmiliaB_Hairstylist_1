"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Availability", href: "#availability" },
  { label: "Contact", href: "#quote" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-near-black)] border-b border-[var(--color-border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <button
          onClick={() => handleNav("#hero")}
          className="font-[var(--font-playfair)] text-[var(--color-cream)] text-xl tracking-widest uppercase"
        >
          Emilia B.
        </button>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className="text-sm tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors duration-300"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleNav("#quote")}
              className="text-sm tracking-widest uppercase px-5 py-2 border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-near-black)] transition-all duration-300"
            >
              Get a Quote
            </button>
          </li>
        </ul>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px bg-[var(--color-cream)] transition-all duration-300 ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-[var(--color-cream)] transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-[var(--color-cream)] transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--color-near-black)] border-t border-[var(--color-border)] px-6 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNav(l.href)}
              className="text-left text-sm tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#quote")}
            className="text-sm tracking-widest uppercase px-5 py-3 border border-[var(--color-gold)] text-[var(--color-gold)] text-center"
          >
            Get a Quote
          </button>
        </div>
      )}
    </nav>
  );
}
