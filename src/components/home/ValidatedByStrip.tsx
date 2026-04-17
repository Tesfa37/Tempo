import Link from "next/link";

interface BadgeConfig {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  icon: React.ReactNode;
}

// ─── Badge SVG Icons ──────────────────────────────────────────────────────────

function WcagIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <path
        d="M20 4 L34 10 V22 C34 30.5 27.5 36.5 20 39 C12.5 36.5 6 30.5 6 22 V10 Z"
        fill="#005A9C"
        fillOpacity="0.15"
        stroke="#005A9C"
        strokeWidth="1.5"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill="#005A9C"
        fontWeight="700"
        fontSize="13"
        fontFamily="Arial, sans-serif"
      >
        AA
      </text>
    </svg>
  );
}

function GotsIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="6" fill="#00A850" fillOpacity="0.15" stroke="#00A850" strokeWidth="1.5" />
      {/* Leaf shape */}
      <path
        d="M20 28 C20 28 12 22 12 15 C12 11 16 8 20 8 C24 8 28 11 28 15 C28 22 20 28 20 28 Z"
        fill="#00A850"
        fillOpacity="0.85"
      />
      <line x1="20" y1="28" x2="20" y2="32" stroke="#00A850" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FairTradeIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#00A878" fillOpacity="0.15" stroke="#00A878" strokeWidth="1.5" />
      {/* Balance beam */}
      <line x1="12" y1="17" x2="28" y2="17" stroke="#00A878" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="13" x2="20" y2="17" stroke="#00A878" strokeWidth="1.5" strokeLinecap="round" />
      {/* Left pan */}
      <circle cx="12" cy="22" r="3.5" fill="none" stroke="#00A878" strokeWidth="1.5" />
      <line x1="12" y1="17" x2="12" y2="18.5" stroke="#00A878" strokeWidth="1.2" />
      {/* Right pan */}
      <circle cx="28" cy="22" r="3.5" fill="none" stroke="#00A878" strokeWidth="1.5" />
      <line x1="28" y1="17" x2="28" y2="18.5" stroke="#00A878" strokeWidth="1.2" />
      {/* Stand */}
      <line x1="20" y1="17" x2="20" y2="28" stroke="#00A878" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function OekotexIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#C4372A" fillOpacity="0.12" stroke="#C4372A" strokeWidth="1.5" />
      {/* Checkmark */}
      <polyline
        points="12,20 17,25 28,14"
        fill="none"
        stroke="#C4372A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* "100" label at bottom */}
      <text
        x="20"
        y="33"
        textAnchor="middle"
        fill="#C4372A"
        fontWeight="700"
        fontSize="7"
        fontFamily="Arial, sans-serif"
      >
        100
      </text>
    </svg>
  );
}

function Gs1Icon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <rect x="4" y="4" width="32" height="32" rx="6" fill="#00A651" fillOpacity="0.12" stroke="#00A651" strokeWidth="1.5" />
      {/* Link chain */}
      <path
        d="M15 20 C15 17.2 17.2 15 20 15 L24 15 C26.8 15 29 17.2 29 20 C29 22.8 26.8 25 24 25 L20 25"
        fill="none"
        stroke="#00A651"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 20 C25 22.8 22.8 25 20 25 L16 25 C13.2 25 11 22.8 11 20 C11 17.2 13.2 15 16 15 L20 15"
        fill="none"
        stroke="#00A651"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EsprIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      {/* EU-blue document */}
      <rect x="8" y="5" width="22" height="28" rx="3" fill="#003399" fillOpacity="0.12" stroke="#003399" strokeWidth="1.5" />
      {/* Document lines */}
      <line x1="12" y1="14" x2="26" y2="14" stroke="#003399" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="26" y2="18" stroke="#003399" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="22" x2="22" y2="22" stroke="#003399" strokeWidth="1" strokeLinecap="round" />
      {/* "2027" */}
      <text
        x="19"
        y="30"
        textAnchor="middle"
        fill="#003399"
        fontWeight="700"
        fontSize="6.5"
        fontFamily="Arial, sans-serif"
      >
        2027
      </text>
      {/* Star badge top-right */}
      <circle cx="30" cy="10" r="6" fill="#003399" />
      <text x="30" y="13" textAnchor="middle" fill="#FFD700" fontSize="9" fontFamily="Arial, sans-serif">&#9733;</text>
    </svg>
  );
}

function ControlUnionIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#003366" fillOpacity="0.12" stroke="#003366" strokeWidth="1.5" />
      <text
        x="20"
        y="17"
        textAnchor="middle"
        fill="#003366"
        fontWeight="700"
        fontSize="10"
        fontFamily="Arial, sans-serif"
      >
        CU
      </text>
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fill="#003366"
        fontWeight="400"
        fontSize="6"
        fontFamily="Arial, sans-serif"
      >
        CERTIFIED
      </text>
    </svg>
  );
}

function AdvisoryBoardIcon() {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="#C4725A" fillOpacity="0.12" stroke="#C4725A" strokeWidth="1.5" />
      {/* Three people silhouettes */}
      {/* Center person */}
      <circle cx="20" cy="15" r="4" fill="#C4725A" fillOpacity="0.8" />
      <path d="M14 28 C14 23 16.5 21 20 21 C23.5 21 26 23 26 28" fill="#C4725A" fillOpacity="0.8" />
      {/* Left person (partial) */}
      <circle cx="12" cy="17" r="3" fill="#C4725A" fillOpacity="0.55" />
      <path d="M8 28 C8 24 10 22 13 22" fill="#C4725A" fillOpacity="0.55" />
      {/* Right person (partial) */}
      <circle cx="28" cy="17" r="3" fill="#C4725A" fillOpacity="0.55" />
      <path d="M27 22 C30 22 32 24 32 28" fill="#C4725A" fillOpacity="0.55" />
    </svg>
  );
}

// ─── Badge Data ───────────────────────────────────────────────────────────────

const badges: BadgeConfig[] = [
  {
    id: "wcag",
    label: "WCAG 2.1 AA",
    sublabel: "WCAG 2.1 AA accessibility standard",
    href: "/accessibility",
    icon: <WcagIcon />,
  },
  {
    id: "gots",
    label: "GOTS Certified",
    sublabel: "Global Organic Textile Standard",
    href: "/passport",
    icon: <GotsIcon />,
  },
  {
    id: "fairtrade",
    label: "Fair Trade",
    sublabel: "Fair Trade Certified",
    href: "/passport",
    icon: <FairTradeIcon />,
  },
  {
    id: "oekotex",
    label: "OEKO-TEX 100",
    sublabel: "OEKO-TEX Standard 100",
    href: "/passport",
    icon: <OekotexIcon />,
  },
  {
    id: "gs1",
    label: "GS1 Digital Link",
    sublabel: "GS1 Digital Link compatible",
    href: "/passport",
    icon: <Gs1Icon />,
  },
  {
    id: "espr",
    label: "ESPR-ready 2027",
    sublabel: "EU Ecodesign for Sustainable Products Regulation, ready for 2027 compliance",
    href: "/passport",
    icon: <EsprIcon />,
  },
  {
    id: "controlunion",
    label: "Control Union",
    sublabel: "Control Union Certifications",
    href: "/passport",
    icon: <ControlUnionIcon />,
  },
  {
    id: "advisors",
    label: "Disabled-led Advisors",
    sublabel: "Disabled-led advisory board, link to advisory board section",
    href: "/about#advisors",
    icon: <AdvisoryBoardIcon />,
  },
];

// ─── Badge Component ──────────────────────────────────────────────────────────

function Badge({ badge }: { badge: BadgeConfig }) {
  return (
    <Link
      href={badge.href}
      aria-label={badge.sublabel}
      className="group flex flex-col items-center gap-2 px-3 py-4 rounded-xl border border-[#D4C9BA] bg-white grayscale hover:grayscale-0 focus:grayscale-0 motion-safe:transition-[filter,box-shadow] motion-safe:duration-200 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C29E5F]"
    >
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        {badge.icon}
      </div>
      <span
        className="text-[10px] font-semibold text-[#9A9A9A] text-center leading-tight group-hover:text-[#1A1A1A] group-focus:text-[#1A1A1A] motion-safe:transition-colors"
        aria-hidden="true"
      >
        {badge.label}
      </span>
    </Link>
  );
}

// ─── Strip ────────────────────────────────────────────────────────────────────

export function ValidatedByStrip() {
  return (
    <section
      className="bg-[#FAFAF7] py-14 px-4 sm:px-6 lg:px-8 border-t border-[#D4C9BA]"
      aria-labelledby="validated-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2
            id="validated-heading"
            className="font-playfair text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3"
          >
            Verified, certified, and accountable.
          </h2>
          <p className="text-[#5A5A5A] text-sm sm:text-base max-w-xl mx-auto">
            Every Tempo claim is third-party verified or advisor-reviewed. No greenwashing. No abledwashing.
          </p>
        </div>

        <ul
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          role="list"
          aria-label="Certifications and standards"
        >
          {badges.map((badge) => (
            <li key={badge.id} role="listitem">
              <Badge badge={badge} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
