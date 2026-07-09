import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, FileText, Linkedin } from "lucide-react";
import { toast } from "sonner";

function copy(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copiado`);
}

const GROUPS: Array<{ title: string; fields: string[] }> = [
  {
    title: "Información General",
    fields: [
      "Marca temporal",
      "País de residencia",
      "Nombres",
      "Apellidos",
      "Año de Programa",
    ],
  },
  {
    title: "Trayectoria Académica y Profesional",
    fields: [
      "¿Qué estudiaste?",
      "¿Dónde estudiaste?",
      "Fecha de Egreso de la Universidad:",
      "Sector de Finanzas en el que trabajas:",
      "Lugar de Trabajo Actual:",
      "Puesto de Trabajo:",
      "Principales responsabilidades de tu puesto de trabajo:",
      "¿Tienes personas a tu cargo? ",
      "Años de experiencia profesional en la industria financiera:",
    ],
  },
  {
    title: "Perfil y Ensayos",
    fields: [
      "¿Cómo te describirías en 4 lineas?:",
      "Lista tus hobbies / intereses fuera del trabajo:",
      "¿Quién es tu modelo a seguir en el mundo profesional? ¿Por qué? :",
      "¿Cuáles son tus metas profesionales?:",
      "¿Qué te interesa trabajar durante el programa de mentorias? (ej. Metas de carrera, networking, analysis de habilidades, revisión de CV):",
      "¿Cómo crees que tener una Mentora y formar parte de la red de Women in Finance ayudaría a impulsar tu carrera?:",
      "¿Cuáles consideras que son los 2 valores que te caracterizan? ¿Por qué?",
    ],
  },
  {
    title: "Referencias",
    fields: [
      "Por favor, bríndanos una referencia laboral de tu actual trabajo (Nombre y celular/correo)",
      "OPCIONAL: Aquí puedes dejar la referencia de alguna ex mentee o mentora de programas anteriores (nombre y celular) que podamos contactar para preguntar por ti",
    ],
  },
];

export function ProfileLeft({ data }: { data: Record<string, string> }) {
  const email = data["Dirección de correo electrónico"];
  const cel = data["Número de celular"];
  const linkedin = data["LinkedIn"];
  const cv = data["Sube tu CV"];
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <p className="wif-section-title mb-3">Contacto</p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <button
            onClick={() => copy(email, "Correo")}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-[var(--teal-softer)]"
          >
            <span className="truncate">{email || "—"}</span>
            <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
          <button
            onClick={() => copy(cel, "Celular")}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-[var(--teal-softer)]"
          >
            <span className="truncate">{cel || "—"}</span>
            <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Linkedin className="h-4 w-4" /> LinkedIn <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          {cv && (
            <a href={cv} target="_blank" rel="noreferrer">
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:opacity-90">
                <FileText className="h-4 w-4" /> Sube tu CV <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </Card>

      {GROUPS.map((g) => (
        <Card key={g.title} className="p-5">
          <p className="wif-section-title mb-3">{g.title}</p>
          <dl className="grid grid-cols-1 gap-4">
            {g.fields.map((f) => (
              <div key={f}>
                <dt className="text-xs text-muted-foreground">{f.replace(/:$/, "").trim()}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm">{data[f] || "—"}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
