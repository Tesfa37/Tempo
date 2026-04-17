"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PointsBadge } from "@/components/points/PointsBadge";

const SHOW_NEW_BADGE = Date.now() < 1750000000000;

const navLinks = [
  { href: "/shop", label: "Shop" },
  {
    href: "/passport",
    label: "Passport",
    ariaLabel: "View Digital Product Passport gallery",
    badge: SHOW_NEW_BADGE ? "NEW" : undefined,
  },
  { href: "/about", label: "About" },
  { href: "/accessibility", label: "Accessibility" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#E8DFD2]/95 backdrop-blur border-b border-[#D4C9BA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-playfair text-2xl font-bold text-[#1A1A1A] tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded"
            aria-label="Tempo — home"
          >
            Tempo
          </Link>

          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A] hover:text-[#C29E5F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F] rounded px-1"
              >
                {link.label}
                {link.badge && (
                  <span className="text-xs bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <PointsBadge />
            <Link
              href="/shop"
              className="bg-[#7A8B75] text-[#FAFAF7] text-sm font-medium px-4 py-2 rounded hover:bg-[#6a7a65] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            >
              Shop the collection
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-[#E8DFD2] border-t border-[#D4C9BA] px-4 pb-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.ariaLabel}
                  className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-[#1A1A1A] hover:text-[#C29E5F] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-xs bg-amber-100 text-amber-900 rounded-full px-2 py-0.5">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                className="block mt-2 bg-[#7A8B75] text-[#FAFAF7] text-sm font-medium px-4 py-2 rounded text-center hover:bg-[#6a7a65] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Shop the collection
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
