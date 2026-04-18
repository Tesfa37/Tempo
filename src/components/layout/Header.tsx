"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PointsBadge } from "@/components/points/PointsBadge";
import { CartIcon } from "@/components/cart/CartIcon";

interface NavLink {
  href: string;
  label: string;
  ariaLabel?: string;
  matchGender?: string;
}

const PRIMARY_NAV: NavLink[] = [
  { href: "/shop?gender=women", label: "Women", matchGender: "women" },
  { href: "/shop?gender=men", label: "Men", matchGender: "men" },
  { href: "/shop?gender=adaptive", label: "Adaptive", matchGender: "adaptive" },
  { href: "/fit", label: "Virtual Fitting" },
  {
    href: "/passport",
    label: "Passports",
    ariaLabel: "View Digital Product Passports",
  },
];

interface HeaderProps {
  isAuthed?: boolean;
}

export function Header({ isAuthed = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(link: NavLink): boolean {
    if (link.matchGender) {
      return pathname === "/shop" && searchParams.get("gender") === link.matchGender;
    }
    return pathname === link.href || pathname.startsWith(link.href + "/");
  }

  const linkClass = (link: NavLink) =>
    `inline-flex items-center gap-1.5 text-sm tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-1 ${
      isActive(link)
        ? "text-[var(--accent)] font-medium"
        : "text-[var(--ink-primary)] hover:text-[var(--accent)]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-canvas)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-playfair text-2xl font-bold text-[var(--ink-primary)] tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
            aria-label="Tempo, home"
          >
            Tempo
          </Link>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Primary navigation"
          >
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                aria-current={isActive(link) ? "page" : undefined}
                className={linkClass(link)}
              >
                {link.label}
              </Link>
            ))}
            <PointsBadge />
            <CartIcon />
            {isAuthed ? (
              <Link
                href="/account"
                className="hidden md:inline-flex items-center text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-2 py-1"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded px-2 py-1"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/shop"
              className="bg-[var(--accent)] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[var(--accent-hover)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Shop the collection
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
          className="md:hidden bg-[var(--bg-canvas)] border-t border-[var(--border)] px-4 pb-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.ariaLabel}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={`${linkClass(link)} py-2`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <CartIcon />
            </li>
            <li>
              {isAuthed ? (
                <Link
                  href="/account"
                  className="inline-flex items-center py-2 text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center py-2 text-sm font-medium text-[var(--ink-primary)] hover:text-[var(--accent)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </li>
            <li>
              <Link
                href="/shop"
                className="block mt-2 bg-[var(--accent)] text-white text-sm font-medium px-4 py-2 rounded text-center hover:bg-[var(--accent-hover)] tempo-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
