export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,#12102a_0%,#0a0918_42%,#06060d_100%)]" />

      {/* Aurora orbs */}
      <div className="anim-drift-a absolute -top-[18%] -left-[12%] h-[58vmax] w-[58vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.5)_0%,rgba(124,58,237,0.16)_42%,transparent_68%)] blur-3xl" />
      <div className="anim-drift-b absolute -bottom-[24%] -right-[10%] h-[62vmax] w-[62vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.34)_0%,rgba(34,211,238,0.1)_45%,transparent_70%)] blur-3xl" />
      <div className="anim-drift-c absolute top-[38%] left-[52%] h-[44vmax] w-[44vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.32)_0%,rgba(244,114,182,0.09)_48%,transparent_72%)] blur-3xl" />
      <div className="anim-drift-b absolute top-[6%] right-[24%] h-[26vmax] w-[26vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16)_0%,transparent_65%)] blur-3xl" />

      {/* Grid + noise + vignette */}
      <div className="grid-overlay absolute inset-0" />
      <div className="noise-overlay absolute inset-0 opacity-[0.05] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,transparent_55%,rgba(3,3,10,0.7)_100%)]" />
    </div>
  );
}
