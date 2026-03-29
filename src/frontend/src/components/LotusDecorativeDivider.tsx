export function LotusDecorativeDivider({
  className = "",
}: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-6 ${className}`}>
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #D4870A, transparent)",
        }}
      />
      <div className="mx-4 flex items-center gap-2">
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="20,4 22,18 20,20 18,18"
            fill="#D4870A"
            opacity="0.8"
          />
          <polygon
            points="20,36 22,22 20,20 18,22"
            fill="#D4870A"
            opacity="0.8"
          />
          <polygon
            points="4,20 18,22 20,20 18,18"
            fill="#D4870A"
            opacity="0.8"
          />
          <polygon
            points="36,20 22,18 20,20 22,22"
            fill="#D4870A"
            opacity="0.8"
          />
          <circle cx="20" cy="20" r="4" fill="#D4870A" opacity="0.6" />
          <circle
            cx="20"
            cy="20"
            r="8"
            fill="none"
            stroke="#D4870A"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </svg>
        <svg
          aria-hidden="true"
          width="28"
          height="28"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 50 C30 50 18 38 18 28 C18 20 24 14 30 14 C36 14 42 20 42 28 C42 38 30 50 30 50Z"
            fill="#D4870A"
            opacity="0.3"
          />
          <path
            d="M30 50 C30 50 14 35 10 25 C8 18 14 10 20 12 C24 13 28 20 30 28 C28 38 30 50 30 50Z"
            fill="#D4870A"
            opacity="0.25"
          />
          <path
            d="M30 50 C30 50 46 35 50 25 C52 18 46 10 40 12 C36 13 32 20 30 28 C32 38 30 50 30 50Z"
            fill="#D4870A"
            opacity="0.25"
          />
          <circle cx="30" cy="28" r="4" fill="#D4870A" opacity="0.7" />
        </svg>
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="20,4 22,18 20,20 18,18"
            fill="#D4870A"
            opacity="0.8"
          />
          <polygon
            points="20,36 22,22 20,20 18,22"
            fill="#D4870A"
            opacity="0.8"
          />
          <polygon
            points="4,20 18,22 20,20 18,18"
            fill="#D4870A"
            opacity="0.8"
          />
          <polygon
            points="36,20 22,18 20,20 22,22"
            fill="#D4870A"
            opacity="0.8"
          />
          <circle cx="20" cy="20" r="4" fill="#D4870A" opacity="0.6" />
          <circle
            cx="20"
            cy="20"
            r="8"
            fill="none"
            stroke="#D4870A"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </svg>
      </div>
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #D4870A, transparent)",
        }}
      />
    </div>
  );
}
