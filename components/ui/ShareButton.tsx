// Circular "share" icon button used on reading-plan cards and the featured
// plan. Purely presentational in the prototype (no share handler wired).
export function ShareButton({ label = "Share" }: { label?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="border-line hover:border-gold-deep flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border transition-colors"
    >
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
        <path
          d="M6 10a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM14 3a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM14 12a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
          stroke="#2B2420"
          strokeWidth="1.3"
        />
        <path d="M8.2 11.4l5.6-3.4M8.2 13.6l5.6 3.4" stroke="#2B2420" strokeWidth="1.3" />
      </svg>
    </button>
  );
}
