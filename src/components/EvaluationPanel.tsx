import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCORECARD_COLS } from "@/lib/constants";
import { Save } from "lucide-react";

type Props = {
  data: Record<string, string>;
  draft: Record<string, string | number>;
  setDraft: (u: Record<string, string | number>) => void;
  isDirectora: boolean;
  mentoras: Array<{ nombre: string }>;
  staffList: string[];
  totalScorecard: number;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
};

export function EvaluationPanel({
  data,
  draft,
  setDraft,
  isDirectora,
  mentoras,
  staffList,
  totalScorecard,
  onSave,
  saving,
  dirty,
}: Props) {
  const set = (k: string, v: string | number) => setDraft({ ...draft, [k]: v });
  const val = (k: string) => (k in draft ? String(draft[k]) : data[k] ?? "");

  const isTruthy = (s: string) =>
    ["true", "sí", "si", "1", "yes"].includes(s.trim().toLowerCase());

  const resultadosF1 = computeResultadosF1(val("¿Pasa a la fase 2 (Entrevistas)?"));

  return (
    <Card className="flex max-h-[calc(100vh-160px)] flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5">
        {/* SECCIÓN A */}
        <Section title="Sección A · Evaluación Fase 1 (Filtro de CV)">
          {isDirectora && (
            <Field label="Encargada de la revisión">
              <Select value={val("Encargada de la revisión:")} onValueChange={(v) => set("Encargada de la revisión:", v)}>
                <SelectTrigger><SelectValue placeholder="Asignar…" /></SelectTrigger>
                <SelectContent>
                  {staffList.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field label="¿Pasa a la fase 2 (Entrevistas)?">
            <Select value={val("¿Pasa a la fase 2 (Entrevistas)?")} onValueChange={(v) => set("¿Pasa a la fase 2 (Entrevistas)?", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Preseleccionada">Preseleccionada</SelectItem>
                <SelectItem value="No seleccionada">No seleccionada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="¿Candidata destacada?" inline>
            <Switch
              checked={isTruthy(val("¿Candidata destacada?"))}
              onCheckedChange={(v) => set("¿Candidata destacada?", v ? "TRUE" : "FALSE")}
            />
          </Field>
          <Field label="Comentarios (Opcional)">
            <Textarea rows={2} value={val("Comentarios (Opcional)")} onChange={(e) => set("Comentarios (Opcional)", e.target.value)} />
          </Field>
          {isDirectora && (
            <Field label="Comentarios Directora">
              <Textarea rows={2} value={val("Check Nicole")} onChange={(e) => set("Check Nicole", e.target.value)} />
            </Field>
          )}
          <Field label="Resultados Fase 1">
            <Input readOnly value={val("Resultados Fase 1") || resultadosF1} className="bg-muted" />
          </Field>
        </Section>

        {/* SECCIÓN B */}
        <Section title="Sección B · Evaluación Fase 2 (Scorecard de Entrevista)">
          <Field label="Status Entrevista">
            <Select value={val("Status Entrevista")} onValueChange={(v) => set("Status Entrevista", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
              <SelectContent>
                {["Por agendar", "Agendada", "Entrevistada", "Sin respuesta"].map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {SCORECARD_COLS.map((c) => (
            <RatingField
              key={c}
              label={c.replace("Scorecard de entrevista: ", "").replace(/\n/g, " ").trim()}
              value={Number(val(c) || 0)}
              onChange={(n) => set(c, n)}
            />
          ))}
          <Field label="Total Scorecard de entrevista">
            <Input readOnly value={totalScorecard} className="bg-[var(--teal-softer)] font-medium text-primary" />
          </Field>
          <Field label="Comentar feedback de Entrevista">
            <Textarea rows={2} value={val("Comentar feedback de Entrevista")} onChange={(e) => set("Comentar feedback de Entrevista", e.target.value)} />
          </Field>
          <Field label="Referencias">
            <Textarea rows={2} value={val("Referencias")} onChange={(e) => set("Referencias", e.target.value)} />
          </Field>
        </Section>

        {/* SECCIÓN C */}
        <Section title="Sección C · Resolución y Matching Final">
          <Field label="Resultados Fase 2">
            <Select value={val("Resultados Fase 2")} onValueChange={(v) => set("Resultados Fase 2", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Seleccionada">Seleccionada</SelectItem>
                <SelectItem value="No seleccionada">No seleccionada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nombre Mentee">
            <Input value={val("Nombre Mentee")} onChange={(e) => set("Nombre Mentee", e.target.value)} />
          </Field>
          <Field label="Mentora asignada">
            <Select value={val("Mentora asignada")} onValueChange={(v) => set("Mentora asignada", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar mentora…" /></SelectTrigger>
              <SelectContent>
                {mentoras.map((m) => (
                  <SelectItem key={m.nombre} value={m.nombre}>{m.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Section>
      </div>

      <div className="border-t border-border bg-[var(--teal-softer)] p-4">
        <Button
          onClick={onSave}
          disabled={!dirty || saving}
          className="w-full gap-2 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando…" : dirty ? "Guardar y Actualizar" : "Sin cambios"}
        </Button>
      </div>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <p className="wif-section-title mb-3 border-b border-border pb-2">{title}</p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children, inline }: { label: string; children: React.ReactNode; inline?: boolean }) {
  return (
    <div className={inline ? "flex items-center justify-between gap-3" : ""}>
      <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RatingField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 flex-1 rounded-md border text-sm transition-all ${
              value >= n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function computeResultadosF1(fase2: string): string {
  const v = fase2.trim().toLowerCase();
  if (v === "preseleccionada") return "Preseleccionada — pasa a Fase 2";
  if (v === "no seleccionada") return "No pasa";
  return "Pendiente de revisión";
}
