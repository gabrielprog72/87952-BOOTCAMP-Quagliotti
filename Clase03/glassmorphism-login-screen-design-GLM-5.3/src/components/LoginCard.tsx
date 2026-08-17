import { useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Zap,
  Fingerprint,
  Apple,
} from "lucide-react";
import { cn } from "../utils/cn";

/* ---------------- Brand icons ---------------- */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5.04c1.68 0 3.19.58 4.38 1.71l3.26-3.26C17.64 1.64 15.04.6 12 .6 7.39.6 3.42 3.25 1.5 7.12l3.8 2.95C6.22 7.17 8.87 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.44c-.28 1.5-1.12 2.77-2.4 3.62l3.71 2.88c2.17-2 3.75-4.96 3.75-8.69z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.12a7.06 7.06 0 0 1 0-4.05L1.5 7.12a11.98 11.98 0 0 0 0 9.9l3.8-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23.4c3.04 0 5.6-1 7.46-2.72l-3.71-2.88c-1.03.7-2.36 1.1-3.75 1.1-3.13 0-5.78-2.1-6.7-4.98l-3.8 2.93C3.42 20.75 7.39 23.4 12 23.4z"
      />
    </svg>
  );
}

/* ---------------- Floating decorative chip ---------------- */
function FloatChip({ className, delay = 0, rotate = 0, children }: { className?: string; delay?: number; rotate?: number; children: ReactNode }) {
  return (
    <div
      className={cn("glass-chip anim-float absolute hidden items-center gap-2.5 rounded-2xl px-4 py-3 lg:flex", className)}
      style={{ animationDelay: `${delay}s`, ["--fl-rotate" as string]: `${rotate}deg` }}
    >
      {children}
    </div>
  );
}

/* ---------------- Field ---------------- */
interface FieldProps {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, icon, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium tracking-wide text-white/70">
        {label}
      </label>
      <div
        className={cn(
          "input-glass flex h-12 items-center gap-3 rounded-2xl px-4",
          error && "border-red-400/50 shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
        )}
      >
        <span className={cn("shrink-0 transition-colors duration-300", error ? "text-red-300" : "text-white/40")}>{icon}</span>
        {children}
      </div>
      <div className={cn("grid overflow-hidden transition-all duration-300", error ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <p className="flex items-center gap-1.5 text-xs text-red-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      </div>
    </div>
  );
}

/* ---------------- Login card ---------------- */
type Status = "idle" | "loading" | "success";
interface Errors {
  email?: string;
  password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [shakeKey, setShakeKey] = useState(0);

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!email.trim()) errs.email = "Introduce tu correo electrónico";
    else if (!EMAIL_RE.test(email.trim())) errs.email = "Ese correo no parece válido";
    if (!password) errs.password = "Introduce tu contraseña";
    else if (password.length < 8) errs.password = "Debe tener al menos 8 caracteres";
    return errs;
  };

  const checkField = (field: "email" | "password") => {
    if (!touched[field]) return;
    const errs = validate();
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const triggerShake = () => setShakeKey((k) => k + 1);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    const errs = validate();
    setTouched({ email: true, password: true });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      triggerShake();
      return;
    }
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 2100);
  };

  const fillDemo = () => {
    setEmail("demo@glass.es");
    setPassword("glassmorphism");
    setErrors({});
    setTouched({});
    emailRef.current?.focus();
  };

  const reset = () => {
    setStatus("idle");
    setPassword("");
    setShowPassword(false);
    setTouched({});
    setErrors({});
    window.setTimeout(() => emailRef.current?.focus(), 80);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const detectCapsLock = (e: KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  return (
    <div className="relative">
      {/* Glow behind the card */}
      <div className="absolute -inset-10 -z-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(139,92,246,0.22),transparent_70%)] blur-2xl" />

      {/* Floating chips */}
      <FloatChip className="-left-40 top-10 -rotate-3" delay={0.4} rotate={-3}>
        <ShieldCheck className="h-4.5 w-4.5 text-emerald-300/90" />
        <span className="text-xs font-medium text-white/75">Cifrado AES-256</span>
      </FloatChip>
      <FloatChip className="-right-36 top-24 rotate-2" delay={1.2} rotate={2}>
        <Zap className="h-4.5 w-4.5 text-amber-300/90" />
        <span className="text-xs font-medium text-white/75">Sesión instantánea</span>
      </FloatChip>
      <FloatChip className="-bottom-12 -left-32 rotate-2" delay={2} rotate={2}>
        <Fingerprint className="h-4.5 w-4.5 text-violet-300/90" />
        <span className="text-xs font-medium text-white/75">2FA disponible</span>
      </FloatChip>
      <FloatChip className="-right-28 -bottom-8 -rotate-2" delay={2.8} rotate={-2}>
        <Sparkles className="h-4.5 w-4.5 text-cyan-300/90" />
        <span className="text-xs font-medium text-white/75">Diseño premiado</span>
      </FloatChip>

      {/* Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="glass-card anim-fade-up w-full max-w-[430px] rounded-[28px] p-7 sm:p-9"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <span className="anim-ping-soft absolute inset-0 rounded-2xl bg-violet-500/40" />
            <div className="glass-chip relative flex h-14 w-14 items-center justify-center rounded-2xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-300 shadow-[0_8px_24px_-6px_rgba(167,139,250,0.7)]">
                <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
              </div>
            </div>
          </div>
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-white">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            Accede a tu <span className="text-aurora font-medium">panel Glass</span>
          </p>
        </div>

        {status === "success" ? (
          /* ---------------- Success ---------------- */
          <div className="anim-fade-up flex flex-col items-center py-6 text-center">
            <div className="relative mb-6">
              <svg width="88" height="88" viewBox="0 0 88 88" fill="none" className="drop-shadow-[0_0_24px_rgba(52,211,153,0.45)]">
                <circle cx="44" cy="44" r="40" stroke="rgba(52,211,153,0.9)" strokeWidth="3" strokeLinecap="round" className="anim-draw-ring" transform="rotate(-90 44 44)" />
                <path d="M28 45.5  L39 56  L60 33" stroke="#6ee7b7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="anim-draw-check" />
              </svg>
              <span className="anim-ping-soft absolute inset-0 -z-10 rounded-full bg-emerald-400/30" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-white">¡Hola de nuevo!</h2>
            <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-white/55">
              Sesión iniciada como <span className="font-medium text-white/85">{email}</span>. Te estamos redirigiendo a tu panel…
            </p>
            <button
              onClick={reset}
              className="input-glass mt-7 flex h-11 items-center gap-2 rounded-2xl px-6 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          /* ---------------- Form ---------------- */
          <form onSubmit={handleSubmit} noValidate>
            <div key={shakeKey} className={cn(shakeKey > 0 && "anim-shake")}>
              <div className="space-y-5">
                <Field
                  id="email"
                  label="Correo electrónico"
                  icon={<Mail className="h-[18px] w-[18px]" />}
                  error={touched.email ? errors.email : undefined}
                >
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    value={email}
                    autoFocus
                    onChange={(e) => {
                      setEmail(e.target.value);
                      checkField("email");
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className="h-full w-full bg-transparent text-sm text-white outline-none"
                  />
                </Field>

                <Field
                  id="password"
                  label="Contraseña"
                  icon={<Lock className="h-[18px] w-[18px]" />}
                  error={touched.password ? errors.password : undefined}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkField("password");
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    onKeyDown={detectCapsLock}
                    onKeyUp={detectCapsLock}
                    className="h-full w-full bg-transparent text-sm text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="shrink-0 rounded-lg p-1 text-white/40 transition-colors duration-200 hover:text-white/85"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </Field>
              </div>

              {/* Caps lock hint */}
              <div className={cn("grid overflow-hidden transition-all duration-300", capsLock ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <p className="flex items-center gap-1.5 text-xs text-amber-300/90">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Bloq Mayús está activado
                </p>
              </div>

              {/* Options row */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={remember}
                  onClick={() => setRemember((v) => !v)}
                  className="group flex items-center gap-2.5"
                >
                  <span
                    className={cn(
                      "relative flex h-5.5 w-10 items-center rounded-full px-0.75 transition-all duration-300",
                      remember ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_-4px_rgba(167,139,250,0.7)]" : "bg-white/10"
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-300",
                        remember ? "translate-x-4.5" : "translate-x-0"
                      )}
                    />
                  </span>
                  <span className="text-[13px] text-white/60 transition-colors group-hover:text-white/85">Mantener sesión</span>
                </button>
                <a href="#" className="text-[13px] font-medium text-violet-300/90 transition-colors hover:text-violet-200">
                  ¿Olvidaste tu clave?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "btn-shine group mt-7 flex h-12.5 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold tracking-wide text-white transition-all duration-300",
                  "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_auto] bg-left hover:bg-right",
                  "shadow-[0_18px_45px_-12px_rgba(167,139,250,0.65)] hover:shadow-[0_22px_55px_-10px_rgba(217,70,239,0.7)] hover:-translate-y-0.5 active:translate-y-0",
                  status === "loading" && "cursor-wait opacity-90 hover:-translate-y-0"
                )}
              >
                <span className="shine" />
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-[18px] w-[18px] animate-spin" />
                    Verificando credenciales…
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Demo hint */}
              <button
                type="button"
                onClick={fillDemo}
                className="mx-auto mt-4 block rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-medium text-white/45 transition-all duration-300 hover:border-violet-400/40 hover:text-violet-200"
              >
                Demo · pulsa para autocompletar
              </button>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">o continúa con</span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
              </div>

              {/* Social */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Google", icon: <GoogleIcon className="h-[18px] w-[18px]" /> },
                  { label: "GitHub", icon: <GithubIcon className="h-[18px] w-[18px] text-white/85" /> },
                  { label: "Apple", icon: <Apple className="h-[18px] w-[18px] text-white/85" /> },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={`Continuar con ${label}`}
                    className="input-glass flex h-11.5 items-center justify-center rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className={cn("mt-8 text-center text-[13px] text-white/40", status === "success" && "mt-0")}>
          ¿Aún no tienes cuenta?{" "}
          <a href="#" className="font-semibold text-white/80 underline decoration-violet-400/50 decoration-2 underline-offset-4 transition-colors hover:text-white hover:decoration-violet-300">
            Regístrate gratis
          </a>
        </p>
      </div>
    </div>
  );
}
