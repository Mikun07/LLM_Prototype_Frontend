interface ReqSmellLogoProps {
  readonly className?: string
}

export function ReqSmellLogo({ className = '' }: ReqSmellLogoProps) {
  return (
    <div className={['flex items-center gap-3', className].join(' ')}>
      {/* SVG icon: magnifying glass with wavy smell lines */}
      <svg
        aria-hidden="true"
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow backdrop circle */}
        <circle cx="19" cy="19" fill="white" opacity="0.15" r="16" />

        {/* Magnifying glass circle */}
        <circle
          cx="19"
          cy="19"
          r="12"
          stroke="white"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        />

        {/* Inner lens highlight */}
        <circle
          cx="15"
          cy="15"
          r="3"
          fill="white"
          opacity="0.25"
        />

        {/* Magnifying glass handle */}
        <line
          x1="28"
          y1="28"
          x2="43"
          y2="43"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Wavy "smell" lines inside the lens */}
        <path
          d="M13 17 Q15 15 17 17 Q19 19 21 17"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M13 21 Q15 19 17 21 Q19 23 21 21"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M14 25 Q16 23 18 25 Q20 27 22 25"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">
          v2.8.0
        </span>
        <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          ReqSmell
        </span>
        <span className="mt-0.5 text-xs font-medium text-indigo-200">
          Requirements smell analysis
        </span>
      </div>
    </div>
  )
}
