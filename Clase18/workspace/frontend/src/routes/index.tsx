import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aula Client — Gestor de alumnos" },
      {
        name: "description",
        content:
          "Cliente web para tu API de alumnos: lista, consulta por ID y carga de nuevos alumnos con URL de API configurable.",
      },
      { property: "og:title", content: "Aula Client — Gestor de alumnos" },
      {
        property: "og:description",
        content:
          "Cliente web para tu API de alumnos: lista, consulta por ID y carga de nuevos alumnos con URL de API configurable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Alumno = {
  id?: number | string;
  nombre?: string;
  email?: string;
  carrera?: string;
  anio?: number | string;
  [key: string]: unknown;
};

const DEFAULT_URL = "https://9k3q92c7-5000.brs.devtunnels.ms";
const STORAGE_KEY = "aula-api-base-url";

const AVATAR_GRADIENTS = [
  "from-brand to-sky-400",
  "from-violet-500 to-fuchsia-400",
  "from-amber-400 to-orange-400",
  "from-emerald-400 to-teal-400",
];

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function getInitials(nombre?: string) {
  if (!nombre) return "??";
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function alumnoSubtitle(a: Alumno) {
  const parts: string[] = [];
  if (a.carrera) parts.push(String(a.carrera));
  if (a.anio !== undefined && a.anio !== null && a.anio !== "")
    parts.push(`${a.anio}° año`);
  if (a.email && parts.length === 0) parts.push(String(a.email));
  return parts.join(" · ") || "Sin datos adicionales";
}

function Index() {
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_URL;
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_URL;
  });
  const [connectedUrl, setConnectedUrl] = useState(() => normalizeBaseUrl(baseUrl));
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selected, setSelected] = useState<Alumno | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", carrera: "", anio: "1" });
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fetchAlumnos = useCallback(async (url: string) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${normalizeBaseUrl(url)}/alumnos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAlumnos(Array.isArray(data) ? data : (data.alumnos ?? []));
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setErrorMsg(
        "No se pudo conectar con la API. Verificá la URL y, si es un túnel de VS Code, abrila una vez en el navegador para aceptar el aviso."
      );
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchAlumnos(connectedUrl);
  }, [connectedUrl, fetchAlumnos]);

  const connect = () => {
    const url = normalizeBaseUrl(baseUrl);
    localStorage.setItem(STORAGE_KEY, url);
    setConnectedUrl(url);
  };

  const openDetail = async (a: Alumno) => {
    if (a.id === undefined) {
      setSelected(a);
      return;
    }
    setDetailLoading(true);
    try {
      const res = await fetch(`${connectedUrl}/alumnos/${a.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSelected(await res.json());
    } catch {
      setSelected(a);
    } finally {
      setDetailLoading(false);
    }
  };

  const submitAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormMsg(null);
    try {
      const res = await fetch(`${connectedUrl}/alumnos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          carrera: form.carrera,
          anio: Number(form.anio),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFormMsg({ ok: true, text: "Alumno agregado correctamente." });
      setForm({ nombre: "", email: "", carrera: "", anio: "1" });
      fetchAlumnos(connectedUrl);
    } catch {
      setFormMsg({ ok: false, text: "No se pudo agregar el alumno. Revisá la conexión." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-ink">
      <div className="glow-bg pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="glass flex flex-col gap-5 rounded-3xl p-6 lg:flex-row lg:items-center">
          <div className="flex shrink-0 items-center gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-400 text-lg font-extrabold text-white shadow-lg shadow-brand/30">
              A
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Aula Client</h1>
              <p className="text-xs font-medium text-slate-500">Gestor de alumnos · API local</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-slate-400">🔗</span>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && connect()}
                className="w-full rounded-2xl border border-white/70 bg-white/70 py-3 pr-4 pl-11 text-sm text-ink outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-brand/40"
                placeholder="https://tu-tunel.local/"
              />
            </div>
            <button
              onClick={connect}
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
            >
              Conectar
            </button>
          </div>
        </header>

        {/* Bento grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-5 lg:col-span-3 lg:grid-cols-1">
            <div className="glass flex min-h-[130px] animate-rise flex-col justify-between rounded-3xl p-6">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Alumnos
              </span>
              <span className="text-4xl font-extrabold text-brand">
                {status === "ok" ? alumnos.length : "—"}
              </span>
            </div>
            <div className="glass flex min-h-[110px] animate-rise items-center justify-between rounded-3xl p-6">
              <div>
                <span className="block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Estado API
                </span>
                <span
                  className={`text-sm font-bold ${
                    status === "ok"
                      ? "text-emerald-600"
                      : status === "error"
                        ? "text-destructive"
                        : "text-slate-500"
                  }`}
                >
                  {status === "ok"
                    ? "Conectada"
                    : status === "error"
                      ? "Sin conexión"
                      : status === "loading"
                        ? "Conectando…"
                        : "Sin conectar"}
                </span>
              </div>
              <span
                className={`size-3 rounded-full ${
                  status === "ok"
                    ? "bg-emerald-400 ring-4 ring-emerald-400/20"
                    : status === "error"
                      ? "bg-destructive ring-4 ring-destructive/20"
                      : "bg-slate-300 ring-4 ring-slate-300/30"
                }`}
              />
            </div>
          </div>

          {/* Directory */}
          <div className="glass animate-rise rounded-3xl p-6 lg:col-span-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Directorio de alumnos</h2>
              <span className="text-xs font-medium text-slate-400">GET /alumnos</span>
            </div>

            {status === "loading" && (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-[76px] animate-pulse rounded-2xl border border-white/70 bg-white/50"
                  />
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
                <p className="text-sm font-semibold text-destructive">Error de conexión</p>
                <p className="mt-1 text-xs text-slate-500">{errorMsg}</p>
                <button
                  onClick={() => fetchAlumnos(connectedUrl)}
                  className="mt-3 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand"
                >
                  Reintentar
                </button>
              </div>
            )}

            {status === "ok" && alumnos.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
                No hay alumnos cargados todavía.
              </div>
            )}

            {status === "ok" && alumnos.length > 0 && (
              <div className="space-y-3">
                {alumnos.map((a, i) => (
                  <button
                    key={a.id ?? i}
                    onClick={() => openDetail(a)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-white/70 bg-white/60 p-4 text-left transition-colors hover:bg-white/90"
                  >
                    <div
                      className={`grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}
                    >
                      {getInitials(a.nombre)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {a.nombre ?? `Alumno ${a.id ?? i + 1}`}
                      </p>
                      <p className="truncate text-xs text-slate-500">{alumnoSubtitle(a)}</p>
                    </div>
                    {a.id !== undefined && (
                      <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                        #{a.id}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add form */}
          <div className="glass-dark animate-rise rounded-3xl p-6 text-white lg:col-span-3">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo alumno</h2>
              <span className="text-xs font-medium text-sky-300">POST</span>
            </div>
            <p className="mb-5 text-xs text-slate-300">Envía los datos a /alumnos</p>
            <form onSubmit={submitAlumno} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400/50"
              />
              <input
                type="email"
                placeholder="correo@aula.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400/50"
              />
              <input
                type="text"
                placeholder="Carrera"
                value={form.carrera}
                onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400/50"
              />
              <select
                value={form.anio}
                onChange={(e) => setForm({ ...form, anio: e.target.value })}
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-sky-400/50"
              >
                {["1", "2", "3", "4", "5"].map((n) => (
                  <option key={n} value={n} className="text-ink">
                    {n}° año
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-brand to-sky-400 py-3 text-sm font-semibold shadow-lg shadow-brand/30 transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? "Enviando…" : "Agregar alumno"}
              </button>
              {formMsg && (
                <p
                  className={`text-center text-xs ${formMsg.ok ? "text-emerald-300" : "text-red-300"}`}
                >
                  {formMsg.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {(selected || detailLoading) && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-6 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass w-full max-w-md animate-rise rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading ? (
              <div className="h-32 animate-pulse rounded-2xl bg-white/50" />
            ) : (
              selected && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Detalle del alumno</h3>
                    <span className="text-xs font-medium text-slate-400">
                      GET /alumnos/{selected.id}
                    </span>
                  </div>
                  <div className="mb-5 flex items-center gap-4">
                    <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand to-sky-400 text-lg font-bold text-white">
                      {getInitials(selected.nombre)}
                    </div>
                    <div>
                      <p className="font-bold">{selected.nombre ?? "Sin nombre"}</p>
                      <p className="text-xs text-slate-500">{alumnoSubtitle(selected)}</p>
                    </div>
                  </div>
                  <dl className="space-y-2 text-sm">
                    {Object.entries(selected).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between gap-4 border-b border-slate-200/70 pb-2"
                      >
                        <dt className="font-medium text-slate-500">{k}</dt>
                        <dd className="text-right font-semibold break-all">{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    onClick={() => setSelected(null)}
                    className="mt-5 w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
                  >
                    Cerrar
                  </button>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
