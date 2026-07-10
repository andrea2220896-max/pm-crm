// Sheet identifiers
export const SPREADSHEET_ID = "1_Z2DBHxSMdViKDHmU6W5TfKb9I0k4VqrI7EI7azEHfo";
export const SHEET_APPLICANTS = "Postulaciones_Prueba";
export const SHEET_MENTORAS = "Base_Mentoras";
export const SHEET_STAFF = "Config_Staff";

// Exact column headers as they appear in the sheet (row 1) — source of truth
export const COLS = [
  "Marca temporal",
  "Dirección de correo electrónico",
  "DNI",
  "País de residencia",
  "Nombres",
  "Apellidos",
  "Número de celular",
  "¿Qué estudiaste?",
  "¿Dónde estudiaste?",
  "Fecha de Egreso de la Universidad:",
  "Sector de Finanzas en el que trabajas:",
  "Lugar de Trabajo Actual:",
  "Puesto de Trabajo:",
  "Principales responsabilidades de tu puesto de trabajo:",
  "¿Tienes personas a tu cargo?",
  "Años de experiencia profesional en la industria financiera:",
  "¿Cómo te describirías en 4 lineas?:",
  "Lista tus hobbies / intereses fuera del trabajo:",
  "¿Quién es tu modelo a seguir en el mundo profesional? ¿Por qué? :",
  "¿Cuáles son tus metas profesionales?:",
  "¿Qué te interesa trabajar durante el programa de mentorias? (ej. Metas de carrera, networking, analysis de habilidades, revisión de CV):",
  "¿Cómo crees que tener una Mentora y formar parte de la red de Women in Finance ayudaría a impulsar tu carrera?:",
  "¿Cuáles consideras que son los 2 valores que te caracterizan? ¿Por qué?",
  "Por favor, bríndanos una referencia laboral de tu actual trabajo (Nombre y celular/correo)",
  "¿Cómo te enteraste de la convocatoria?",
  "Sube tu CV",
  "OPCIONAL: Aquí puedes dejar la referencia de alguna ex mentee o mentora de programas anteriores (nombre y celular) que podamos contactar para preguntar por ti",
  "LinkedIn",
  "Encargada de la revisión:",
  "¿Aprueba Fase 1?",
  "¿Candidata destacada?",
  "Comentarios generales del perfil",
  "Comentarios Nicole",
  "Resultados Fase 1",
  "Status Entrevista",
  "Feedback de Entrevista",
  "Scorecard de entrevista: Motivación genuina",
  "Scorecard de entrevista: Disponibilidad y compromiso",
  "Scorecard de entrevista: Necesidad real de mentoría",
  "Scorecard de entrevista: Madurez profesional",
  "Scorecard de entrevista: Apertura al feedback y reflexión",
  "Scorecard de entrevista: Coherencia general",
  "Scorecard de entrevista: Encaje con Women in Finance y construcción de comunidad",
  "Total Scorecard de entrevista",
  "Feedback referencias",
  "¿Aprueba Fase 2?",
  "Invitada prox año",
  "Resultados Fase 2",
  "Nombre Mentee",
  "Mentora asignada",
  "Año de Programa",
] as const;

export type ColName = (typeof COLS)[number];

export const SCORECARD_COLS: ColName[] = [
  "Scorecard de entrevista: Motivación genuina",
  "Scorecard de entrevista: Disponibilidad y compromiso",
  "Scorecard de entrevista: Necesidad real de mentoría",
  "Scorecard de entrevista: Madurez profesional",
  "Scorecard de entrevista: Apertura al feedback y reflexión",
  "Scorecard de entrevista: Coherencia general",
  "Scorecard de entrevista: Encaje con Women in Finance y construcción de comunidad",
];

export const DIRECTORA_NAME = "Nicole Vegas";

// Estado derivado — labels canónicos usados por statusOf + filtros
export const ESTADO = {
  COMPLETADO: "Completado",
  PENDIENTE_DUPLA: "Pendiente dupla",
  NO_SEL_F2: "No seleccionada (F2)",
  PENDIENTE_DIR: "Pendiente Directora",
  FASE2: "Fase 2 - Entrevista",
  NO_SEL_F1: "No seleccionada (F1)",
  FASE1: "Fase 1 — Filtro CV",
} as const;
export type EstadoLabel = (typeof ESTADO)[keyof typeof ESTADO];

export function statusOf(d: Record<string, string>): {
  label: EstadoLabel;
  bg: string;
  fg: string;
} {
  const mentora = (d["Mentora asignada"] ?? "").trim();
  const r2 = (d["Resultados Fase 2"] ?? "").trim().toLowerCase();
  const ap2 = (d["¿Aprueba Fase 2?"] ?? "").trim();
  const r1 = (d["Resultados Fase 1"] ?? "").trim().toLowerCase();
  const ap1 = (d["¿Aprueba Fase 1?"] ?? "").trim();

  if (mentora) return { label: ESTADO.COMPLETADO, bg: "var(--teal-soft)", fg: "var(--primary)" };
  if (r2 === "seleccionada") return { label: ESTADO.PENDIENTE_DUPLA, bg: "oklch(0.95 0.05 90)", fg: "oklch(0.4 0.15 80)" };
  if (r2 === "no seleccionada") return { label: ESTADO.NO_SEL_F2, bg: "oklch(0.96 0.01 30)", fg: "oklch(0.5 0.15 27)" };
  if (ap2) return { label: ESTADO.PENDIENTE_DIR, bg: "oklch(0.95 0.03 300)", fg: "oklch(0.4 0.15 300)" };
  if (r1 === "pre seleccionada" || r1 === "preseleccionada")
    return { label: ESTADO.FASE2, bg: "var(--teal-softer)", fg: "var(--primary)" };
  if (r1 === "no seleccionada" || r1 === "no pasa")
    return { label: ESTADO.NO_SEL_F1, bg: "oklch(0.96 0.01 30)", fg: "oklch(0.5 0.15 27)" };
  if (ap1) return { label: ESTADO.PENDIENTE_DIR, bg: "oklch(0.95 0.03 300)", fg: "oklch(0.4 0.15 300)" };
  return { label: ESTADO.FASE1, bg: "oklch(0.97 0.005 200)", fg: "oklch(0.4 0.02 200)" };
}

// University → Region lookup
export const UNIVERSITY_REGION: Record<string, "Lima" | "Provincias"> = {
  "Universidad del Pacífico - UP": "Lima",
  "Universidad Nacional Mayor de San Marcos - UNMSM": "Lima",
  "Pontificia Universidad Católica del Perú - PUCP": "Lima",
  "Universidad de Piura - UDEP": "Provincias",
  "Universidad de Lima - ULIMA": "Lima",
  "Universidad Peruana de Ciencias Aplicadas - UPC": "Lima",
  "Universidad Esan - UESAN": "Lima",
  "Universidad Nacional de Ingeniería - UNI": "Lima",
  "Universidad Nacional Federico Villarreal - UNFV": "Lima",
  "Universidad Nacional de Trujillo - UNT": "Provincias",
  "Universidad Nacional Pedro Ruiz Gallo - UNPRG": "Provincias",
  "Universidad Nacional del Callao - UNAC": "Lima",
  "Universidad Tecnológica del Perú - UTP": "Lima",
  "Universidad Nacional de San Agustín de Arequipa - UNSA": "Provincias",
  "Universidad Católica San Pablo - UCSP": "Provincias",
  "Universidad Privada del Norte - UPN": "Provincias",
  "Universidad Nacional del Altiplano - UNA": "Provincias",
  "Universidad Católica de Santa María - UCSM": "Provincias",
  "Universidad Agraria de la Molina - UNALM": "Lima",
  "Universidad Científica del Sur - UCSUR": "Lima",
  "Universidad San Ignacio de Loyola - USIL": "Lima",
  "Universidad Privada Antenor Orrego - UPAO": "Provincias",
  "Universidad Andina de Cusco - UAC": "Provincias",
  "Universidad Privada San Juan Bautista - UPSJB": "Lima",
  "Universidad Continental - UC": "Provincias",
  "Universidad Católica Santo Toribio de Mogrovejo - USAT": "Provincias",
  "Universidad Ricardo Palma - URP": "Lima",
  "Universidad Nacional Santiago Antúnez de Mayolo - UNASAM": "Provincias",
  "Universidad Nacional San Cristóbal de Huamanga - UNSCH": "Provincias",
  "Universidad Nacional de Tumbes - UNTUMBES": "Provincias",
  "Universidad Nacional de San Antonio Abad del Cusco - UNSAAC": "Provincias",
  "Universidad Nacional de Piura - UNP": "Provincias",
  "Universidad Nacional de Frontera - UNF": "Provincias",
  "Universidad Nacional de Cajamarca - UNC": "Provincias",
  "Universidad Nacional Agraria de la Selva - UNAS": "Provincias",
  "Universidad Femenina del Sagrado Corazón - UNIFE": "Lima",
  "Universidad de San Martín de Porres - USMP": "Lima",
  "Universidad de Chiclayo - UDCH": "Provincias",
  "Universidad Autónoma del Perú - UA": "Lima",
};

export function regionForUniversity(u: string | undefined | null): "Lima" | "Provincias" | "No especificado" {
  if (!u) return "No especificado";
  return UNIVERSITY_REGION[u.trim()] ?? "No especificado";
}

export function colLetter(index0: number): string {
  let n = index0;
  let s = "";
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

export function colIndexOf(header: ColName): number {
  return COLS.indexOf(header);
}
