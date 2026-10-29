interface WaveDividerProps {
  /** Color class for the wave fill — use bg color tokens like 'fill-muted' */
  fillClass?: string;
  /** Flip vertically to point waves upward */
  flip?: boolean;
  className?: string;
}

export function WaveDivider({ fillClass = 'fill-muted', flip = false, className = '' }: WaveDividerProps) {
  return (
    <div className={`w-full leading-[0] overflow-hidden ${className}`} aria-hidden="true">
      <svg
        className={`wave-divider ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          className={fillClass}
          d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}
