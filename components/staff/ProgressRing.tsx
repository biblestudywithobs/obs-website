// SVG progress ring used on the dashboard hero. Circumference for r=38 is
// ~238.76; dashoffset is computed from the percent, matching the prototype's
// hardcoded 70% ring (dashoffset 71.6).
export function ProgressRing({ percent }: { percent: number }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} stroke="rgba(249,236,201,.2)" strokeWidth="8" fill="none" />
        <circle
          cx="44"
          cy="44"
          r={r}
          stroke="#FEBE52"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <span className="font-display text-[22px] font-semibold">{percent}%</span>
      <span className="text-cream/60 text-[11.5px]">complete</span>
    </div>
  );
}
