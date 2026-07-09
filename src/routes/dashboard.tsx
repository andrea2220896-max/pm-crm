import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { listApplicants } from "@/lib/sheets.functions";
import { useSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Filter = "todas" | "fase1" | "fase2" | "hechas";

function Dashboard() {
  const { session, isDirectora, hydrated } = useSession();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("todas");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (hydrated && !session) navigate({ to: "/" });
  }, [session, navigate]);

  const applicants = useQuery({
    queryKey: ["applicants"],
    queryFn: () => listApplicants(),
    enabled: !!session,
  });

  const mine = useMemo(() => {
    if (!applicants.data || !session) return [];
    if (isDirectora) return applicants.data;
    const key = session.nombreCorto.trim().toLowerCase();
    return applicants.data.filter(
      (a) => (a.data["Encargada de la revisión:"] ?? "").trim().toLowerCase() === key,
    );
  }, [applicants.data, session, isDirectora]);

  const metrics = useMemo(() => {
    const pendientesF1 = mine.filter((a) => !a.data["¿Pasa a la fase 2 (Entrevistas)?"]).length;
    const pendientesF2 = mine.filter(
      (a) =>
        a.data["¿Pasa a la fase 2 (Entrevistas)?"] === "Preseleccionada" &&
        !a.data["Resultados Fase 2"],
    ).length;
    const hechas = mine.filter((a) => !!a.data["Resultados Fase 2"]).length;
    return { total: mine.length, pendientesF1, pendientesF2, hechas };
  }, [mine]);

  const filtered = useMemo(() => {
    let list = mine;
    if (filter === "fase1") list = list.filter((a) => !a.data["¿Pasa a la fase 2 (Entrevistas)?"]);
    if (filter === "fase2")
      list = list.filter(
        (a) =>
          a.data["¿Pasa a la fase 2 (Entrevistas)?"] === "Preseleccionada" &&
          !a.data["Resultados Fase 2"],
      );
    if (filter === "hechas") list = list.filter((a) => !!a.data["Resultados Fase 2"]);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((a) => {
        const nombre = `${a.data["Nombres"]} ${a.data["Apellidos"]}`.toLowerCase();
        return (
          nombre.includes(s) ||
          (a.data["DNI"] ?? "").includes(s) ||
          (a.data["¿Dónde estudiaste?"] ?? "").toLowerCase().includes(s)
        );
      });
    }
    return list;
  }, [mine, filter, q]);

  if (!session) return null;

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="wif-section-title">Panel de control</p>
          <h1 className="mt-1 text-3xl font-light">Bienvenida, {session.nombreCompleto.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDirectora ? "Vista de todas las postulantes" : "Vista de tus postulantes asignadas"}
          </p>
        </div>
        {isDirectora && (
          <Link
            to="/directora"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Ir a Vista Directora
          </Link>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Postulantes asignadas" value={metrics.total} onClick={() => setFilter("todas")} active={filter === "todas"} />
        <MetricCard label="Pendientes Fase 1 (CV)" value={metrics.pendientesF1} onClick={() => setFilter("fase1")} active={filter === "fase1"} />
        <MetricCard label="Pendientes Fase 2 (Entrevista)" value={metrics.pendientesF2} onClick={() => setFilter("fase2")} active={filter === "fase2"} />
        <MetricCard label="Revisiones completadas" value={metrics.hechas} onClick={() => setFilter("hechas")} active={filter === "hechas"} />
      </div>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="wif-section-title">Lista de postulantes</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} resultado(s)</p>
          </div>
          <Input
            placeholder="Buscar por nombre, DNI o universidad…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {applicants.isLoading && <p className="p-6 text-sm text-muted-foreground">Cargando…</p>}
        {applicants.error && (
          <p className="p-6 text-sm text-destructive">
            Error al cargar: {(applicants.error as Error).message}
          </p>
        )}

        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[var(--teal-softer)] text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nombre completo</th>
                <th className="px-4 py-3">DNI</th>
                <th className="px-4 py-3">Universidad</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const estado = statusOf(a.data);
                return (
                  <tr
                    key={a.data["DNI"]}
                    className="border-t border-border transition-colors hover:bg-[var(--teal-softer)]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to="/postulantes/$dni"
                        params={{ dni: a.data["DNI"] }}
                        className="hover:text-primary"
                      >
                        {a.data["Nombres"]} {a.data["Apellidos"]}
                      </Link>
                      {a.data["¿Candidata destacada?"]?.toLowerCase().includes("true") && (
                        <Badge className="ml-2 bg-[var(--teal-soft)] text-primary" variant="outline">
                          Destacada
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.data["DNI"]}</td>
                    <td className="px-4 py-3">{a.data["¿Dónde estudiaste?"] || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs"
                        style={{
                          background: estado.bg,
                          color: estado.fg,
                        }}
                      >
                        {estado.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!applicants.isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No hay postulantes para este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}

function MetricCard({
  label,
  value,
  onClick,
  active,
}: {
  label: string;
  value: number;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-5 text-left transition-all ${
        active
          ? "border-primary bg-[var(--teal-soft)]"
          : "border-border bg-card hover:border-primary hover:bg-[var(--teal-softer)]"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-light text-primary">{value}</div>
    </button>
  );
}

export function statusOf(d: Record<string, string>) {
  if (d["Resultados Fase 2"] === "Seleccionada")
    return { label: "Seleccionada", bg: "var(--teal-soft)", fg: "var(--primary)" };
  if (d["Resultados Fase 2"] === "No seleccionada")
    return { label: "No seleccionada", bg: "oklch(0.96 0.01 30)", fg: "oklch(0.5 0.15 27)" };
  if (d["¿Pasa a la fase 2 (Entrevistas)?"] === "Preseleccionada")
    return { label: "Fase 2 — Entrevista", bg: "var(--teal-softer)", fg: "var(--primary)" };
  if (d["¿Pasa a la fase 2 (Entrevistas)?"] === "No seleccionada")
    return { label: "No seleccionada (F1)", bg: "oklch(0.96 0.01 30)", fg: "oklch(0.5 0.15 27)" };
  return { label: "Fase 1 — Filtro CV", bg: "oklch(0.97 0.005 200)", fg: "oklch(0.4 0.02 200)" };
}
