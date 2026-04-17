type PatternId = 1 | 2 | 3 | 4 | 5;

interface AdvisorAvatarProps {
  initials: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  size?: "sm" | "md" | "lg";
  pattern?: PatternId;
  categoryColor?: string;
}

function PatternDefs({ id, patternId, textColor }: { id: string; patternId: PatternId; textColor: string }) {
  const fill = textColor;
  const opacity = 0.18;
  const pid = `pat-${id}`;
  const cid = `clip-${id}`;

  const shapes: Record<PatternId, React.ReactNode> = {
    1: (
      <pattern id={pid} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill={fill} opacity={opacity} />
        <circle cx="6" cy="6" r="1.2" fill={fill} opacity={opacity} />
      </pattern>
    ),
    2: (
      <pattern id={pid} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="8" x2="8" y2="0" stroke={fill} strokeWidth="1.2" opacity={opacity} />
      </pattern>
    ),
    3: (
      <pattern id={pid} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="8" x2="8" y2="0" stroke={fill} strokeWidth="1" opacity={opacity} />
        <line x1="0" y1="0" x2="8" y2="8" stroke={fill} strokeWidth="1" opacity={opacity} />
      </pattern>
    ),
    4: (
      <pattern id={pid} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="6" r="4" fill="none" stroke={fill} strokeWidth="1" opacity={opacity} />
      </pattern>
    ),
    5: (
      <pattern id={pid} x="0" y="0" width="10" height="6" patternUnits="userSpaceOnUse">
        <polyline points="0,6 5,0 10,6" fill="none" stroke={fill} strokeWidth="1.2" opacity={opacity} />
      </pattern>
    ),
  };

  return (
    <defs>
      <clipPath id={cid}>
        <circle cx="50%" cy="50%" r="50%" />
      </clipPath>
      {shapes[patternId]}
    </defs>
  );
}

export function AdvisorAvatar({
  initials,
  name,
  avatarBg,
  avatarText,
  size = "md",
  pattern,
  categoryColor,
}: AdvisorAvatarProps) {
  const dim = size === "sm" ? 48 : size === "lg" ? 96 : 64;
  const fontSize = size === "sm" ? 13 : size === "lg" ? 28 : 18;
  const dotR = size === "sm" ? 5 : size === "lg" ? 8 : 6;
  const dotOffset = dotR + 1;

  const safeId = initials.replace(/\./g, "").replace(/\s/g, "");
  const patternId: PatternId = pattern ?? 1;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
      className="shrink-0 rounded-full"
      style={{ overflow: "visible" }}
    >
      {pattern && (
        <PatternDefs id={safeId} patternId={patternId} textColor={avatarText} />
      )}

      {/* Base circle */}
      <circle cx={dim / 2} cy={dim / 2} r={dim / 2} fill={avatarBg} />

      {/* Geometric pattern overlay */}
      {pattern && (
        <rect
          x="0"
          y="0"
          width={dim}
          height={dim}
          fill={`url(#pat-${safeId})`}
          clipPath={`url(#clip-${safeId})`}
        />
      )}

      {/* Initials */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={avatarText}
        fontFamily="Georgia, 'Playfair Display', serif"
        fontWeight="bold"
        fontSize={fontSize}
      >
        {initials}
      </text>

      {/* Category dot */}
      {categoryColor && (
        <>
          <circle
            cx={dim - dotOffset}
            cy={dim - dotOffset}
            r={dotR + 1.5}
            fill="#FAFAF7"
          />
          <circle
            cx={dim - dotOffset}
            cy={dim - dotOffset}
            r={dotR}
            fill={categoryColor}
          />
        </>
      )}
    </svg>
  );
}
