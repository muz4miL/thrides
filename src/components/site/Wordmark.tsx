// Clean, responsive typographic wordmark for Thrides.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold tracking-[-0.04em] text-foreground ${className}`}
      aria-label="Thrides"
    >
      <span>thrides</span>
      <span className="text-blue-700">.</span>
    </span>
  );
}
