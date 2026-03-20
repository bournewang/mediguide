type LogoProps = {
  inverted?: boolean;
  className?: string;
};

function Logo({ inverted = false, className = "" }: LogoProps) {
  const secondary = inverted ? "rgba(255,255,255,0.72)" : "#475569";

  return (
    <div className={`leading-none ${className}`.trim()}>
      <div
        className="text-xl font-semibold tracking-tight md:text-2xl"
        style={{ color: inverted ? "#ffffff" : "#0f172a" }}
      >
        CareBridge
      </div>
      <div
        className="mt-1 text-[11px] font-medium uppercase tracking-[0.24em]"
        style={{ color: secondary }}
      >
        China
      </div>
    </div>
  );
}

export default Logo;
