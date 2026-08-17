import AuroraBackground from "./components/AuroraBackground";
import LoginCard from "./components/LoginCard";

export default function App() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-14 sm:px-8">
      <AuroraBackground />

      {/* Corner HUD details */}
      <header className="anim-fade-in absolute left-6 top-6 hidden items-center gap-2.5 sm:flex lg:left-10 lg:top-9">
        <div className="h-2 w-2 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
        <span className="font-display text-sm font-semibold tracking-[0.22em] text-white/60">GLASS·PANEL</span>
      </header>

      <div className="anim-fade-in absolute right-6 top-6 hidden items-center gap-2 sm:flex lg:right-10 lg:top-9">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        <span className="text-xs font-medium tracking-wide text-white/45">Todos los sistemas operativos</span>
      </div>

      {/* Centered login card */}
      <div className="relative z-10 flex w-full justify-center">
        <LoginCard />
      </div>

      <footer className="anim-fade-in absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 text-[11px] tracking-wide text-white/30 lg:bottom-9">
        <span>© 2025 Glass Panel</span>
        <span className="h-3 w-px bg-white/15" />
        <a href="#" className="transition-colors hover:text-white/70">Privacidad</a>
        <span className="h-3 w-px bg-white/15" />
        <a href="#" className="transition-colors hover:text-white/70">Términos</a>
      </footer>
    </main>
  );
}
