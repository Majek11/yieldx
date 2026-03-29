/**
 * YieldX Logo Loader
 * Animates the logo as a loading spinner for full-page and inline loading states
 */

interface LogoLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
  fullScreen?: boolean;
  inline?: boolean;
}

const LogoLoader = ({
  size = 'md',
  showText = true,
  text = 'Loading YieldX…',
  fullScreen = false,
  inline = false,
}: LogoLoaderProps) => {
  const sizeMap = {
    sm: { width: 24, height: 24 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  };

  const { width, height } = sizeMap[size];

  const spinnerSvg = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-spinner"
    >
      {/* Purple Circle Ring */}
      <circle
        cx="120"
        cy="120"
        r="95"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
        strokeLinecap="round"
        className="text-primary"
      />

      {/* S-Curve Arrow Path */}
      <g transform="translate(120, 120)">
        {/* Smooth S-curve line */}
        <path
          d="M -50 30 Q -30 0 0 -15 Q 30 -25 50 -35"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </g>

      {/* Emerald Green Dot at curve endpoint */}
      <circle cx="170" cy="85" r="12" fill="currentColor" className="text-emerald-500" />
    </svg>
  );

  // Inline mode: just return the spinner for use in buttons
  if (inline) {
    return (
      <>
        <style>{`
          @keyframes floating-spin {
            0% {
              transform: rotate(0deg) scale(1);
              opacity: 1;
            }
            50% {
              transform: rotate(180deg) scale(1.05);
            }
            100% {
              transform: rotate(360deg) scale(1);
              opacity: 1;
            }
          }
          .logo-spinner {
            animation: floating-spin 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }
        `}</style>
        {spinnerSvg}
      </>
    );
  }

  const loaderContent = (
    <div className="flex flex-col items-center gap-4">
      <style>{`
        @keyframes floating-spin {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) scale(1.05);
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(124, 58, 237, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(124, 58, 237, 0.5));
          }
        }
        .logo-spinner {
          animation: floating-spin 3s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .logo-spinner-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="logo-spinner-glow">
        {spinnerSvg}
      </div>

      {showText && (
        <p className="text-muted-foreground text-sm font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default LogoLoader;
