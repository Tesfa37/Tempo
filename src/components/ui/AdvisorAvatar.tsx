interface AdvisorAvatarProps {
  initials: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  size?: "sm" | "md";
}

export function AdvisorAvatar({
  initials,
  name,
  avatarBg,
  avatarText,
  size = "md",
}: AdvisorAvatarProps) {
  const dim = size === "sm" ? 48 : 64;
  const fontSize = size === "sm" ? 14 : 18;

  return (
    <svg
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
      className="shrink-0 rounded-full"
    >
      <circle cx={dim / 2} cy={dim / 2} r={dim / 2} fill={avatarBg} />
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
    </svg>
  );
}
