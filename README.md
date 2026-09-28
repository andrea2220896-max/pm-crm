# Mentoría WIF

## 0. VISIÓN GENERAL

 

Build a complete internal CRM Portal for the non-profit organization "Women In Finance (WIF)" to manage their Mentorship Program application and selection process. The application must act as a visual frontend interface that reads and writes data directly to a Google Sheets database, using **DNI** (or Pasaporte, as fallback unique ID) as the Primary Key. The entire interface must be localized in Spanish.

 

The application has two access levels: **Coordinadora** (staff evaluating assigned applicants) and **Directora** (executive oversight, analytics, and final resolution).

 

---

 

## 1. BRAND IDENTITY & DESIGN SYSTEM

 

- **Primary Color:** HEX `#1C999C` (Teal/Turquoise). Use for prominent action buttons, navigation highlights, sliders, selection indicators, and primary titles.

- **Secondary Color:** HEX `#FFFFFF` (Pure White). Use for backgrounds, card bodies, and input elements to keep a clean, spacious, elegant look.

- **Typography:** "Avenir Next LT Pro Light" (or fallbacks: 'Avenir Next', 'Avenir', 'sans-serif' with light font-weight) as the global font for headings, labels, and text.

- **Contrast & UX:** Buttons with a `#1C999C` background must use white (`#FFFFFF`) text. Dark text over white backgrounds. Use soft opacity variations of `#1C999C` for subtle section headers, borders, or dividers.

- **Design language:** Professional, modern, and empowering — reflecting women's leadership in finance. Intuitive UX that eliminates spreadsheet row-scrolling exhaustion. Do not use navy blue or gold/purple accents — the palette is strictly teal + white as defined above.

---

 

## 2. DATABASE & READ/WRITE RELATIONSHIP

 

- **DNI** is the unique Primary Key for every read/write action.

- Any update (from the evaluation workspace or the director's table) must overwrite the exact row corresponding to the applicant's DNI when clicking "Guardar y Actualizar" or on inline edit.

- Fields hidden from a specific role or UI section must **never be wiped or overwritten** during a save/update transaction — their existing value in the Sheet must be preserved even if not visible/editable in that session.

---

 

## 3. STAFF DASHBOARD VIEW (Pantalla de Bienvenida — Coordinadora)

 

- Clean welcome screen: **"Bienvenida, [Nombre de la Coordinadora]"**.

- Quick scorecard blocks with key metrics (filtered to the logged-in coordinator's assigned applicants):

- Total de Postulantes Asignadas

- Pendientes de Revisión (Fase 1)

- Pendientes de Entrevista (Fase 2)

- Revisiones Completadas

- A status breakdown section: clicking on a specific phase filters the main applicant list below by that status.

- Include a button **"Vista Directora"** (protected/role-based) that navigates to the executive dashboard described in Section 8.

---

 

## 4. APPLICANT LIST VIEW

 

- Clean table or card layout listing applicants assigned to the logged-in coordinator (Directora sees all).

- Each row/card displays: **Nombre completo, Universidad, Estado actual de selección** (e.g., "Fase 1 - Filtro CV", "Fase 2 - Entrevista", "Seleccionada", "No seleccionada").

- Clicking an applicant opens the **360° Profile View** (Section 5–7).

---

 

## 5. 360° PROFILE VIEW — LAYOUT: STICKY EVALUATION WORKSPACE (SPLIT SCREEN)

 

- **Left Column (Applicant Data):** independent scrollable viewport containing the applicant's response fields (Section 6).

- **Right Column (Evaluation Sections A, B, C):** `position: sticky; top: [header_height]`, stays stationary while the user scrolls the left column. If content exceeds vertical space, it has its own internal scroll.

- The **"Guardar y Actualizar"** button remains permanently visible, anchored at the bottom of the sticky evaluation panel, styled in `#1C999C` with white text.

---

 

## 6. APPLICANT DATA PRESENTATION (LEFT COLUMN)

 

**Contact Section Block** (compact, at the top):

- Copiable text: "Dirección de correo electrónico", "Número de celular".

- Icon/button "LinkedIn" opening the profile link in a new tab (`target="_blank"`).

- Prominent button styled in `#1C999C`: "Sube tu CV" → opens the Google Drive PDF in a new tab.

**Hidden from UI:** do NOT render the column *"¿Cómo te enteraste de la convocatoria?"* in the profile view — it stays in the Sheet backend for later marketing use, just not shown here.

 

**Grouped Questionnaire Content** (clean white panels, in this order):

- **Información General:** Marca temporal, País de residencia, Nombres, Apellidos, Año de Programa.

- **Trayectoria Académica y Profesional:** ¿Qué estudiaste?, ¿Dónde estudiaste?, Fecha de Egreso de la Universidad:, Sector de Finanzas en el que trabajas:, Lugar de Trabajo Actual:, Puesto de Trabajo:, Principales responsabilidades de tu puesto de trabajo:, ¿Tienes personas a tu cargo?, Años de experiencia profesional en la industria financiera:.

- **Perfil y Ensayos:** ¿Cómo te describirías en 4 lineas?:, Lista tus hobbies / intereses fuera del trabajo:, ¿Quién es tu modelo a seguir del mundo profesional? ¿Por qué? :, ¿Cuáles son tus metas profesionales?:, ¿Qué te interesa trabajar durante el programa de mentorias? (ej. Metas de carrera, networking, analysis de habilidades, revisión de CV):, ¿Cómo crees que tener una Mentora y formar parte de la red de Women in Finance ayudaría a impulsar tu carrera?:, ¿Cuáles consideras que son los 2 valores que te caracterizan? ¿Por qué?.

- **Referencias:** Por favor, bríndanos una referencia laboral de tu actual trabajo (Nombre y celular/correo), OPCIONAL: Aquí puedes dejar la referencia de alguna ex mentee o mentora de programas anteriores (nombre y celular) que podamos contactar para preguntar por ti.

*(Nota: no incluir un placeholder de "AI-generated insights" en esta vista estándar — el resumen por IA solo aparece en el modal de la Vista Directora, ver Sección 9, para no duplicar el costo de esa función en cada perfil.)*

 

---

 

## 7. LOGICAL EVALUATION WORKSPACE (RIGHT COLUMN — CHRONOLOGY & ROLE CONTROLS)

 

Fields follow the WIF chronological sequence and render conditionally by role (Coordinadora vs. Directora).

 

**SECCIÓN A: EVALUACIÓN FASE 1 (FILTRO DE CV)**

- Dropdown: **"Encargada de la revisión:"** → *hide completely from Coordinadora view; visible/editable only for Directora.*

- Dropdown: **"¿Pasa a la fase 2 (Entrevistas)?"** (Preseleccionada / No seleccionada).

- Toggle: **"¿Candidata destacada?"**

- Text field: **"Comentarios (Opcional)"**

- Text field: **"Comentarios Directora"** → maps directly to the Sheet column `Check Nicole`. *Hide completely from Coordinadora view; visible/editable only for Directora.*

- Status label (calculated): **"Resultados Fase 1"**

**SECCIÓN B: EVALUACIÓN FASE 2 (SCORECARD DE ENTREVISTA)**

- Dropdown: **"Status Entrevista"** (Por agendar, Agendada, Entrevistada, Sin respuesta).

- Rating inputs (scale 1–5, `#1C999C` accents) for the seven criteria:

- Scorecard de entrevista: Motivación genuina

- Scorecard de entrevista: Disponibilidad y compromiso

- Scorecard de entrevista: Necesidad real de mentoría

- Scorecard de entrevista: Madurez profesional

- Scorecard de entrevista: Apertura al feedback y reflexión

- Scorecard de entrevista: Coherencia general

- Scorecard de entrevista: Encaje con Women in Finance y construcción de comunidad

- Calculated label: **"Total Scorecard de entrevista"** (real-time sum of the seven inputs above).

- Text areas: **"Comentar feedback de Entrevista"** and **"Referencias"**.

**SECCIÓN C: RESOLUCIÓN Y MATCHING FINAL**

- Dropdown: **"Resultados Fase 2"** (Seleccionada / No seleccionada).

- Text input: **"Nombre Mentee"**.

- Dropdown: **"Mentora asignada"** — dynamic lookup, showing only active mentors from the mentors sheet tab.

---

 

## 8. VISTA DIRECTORA — DASHBOARD & ANALYTICS

 

**Access:** protected "Vista Directora" button on the welcome page (Section 3), opening the executive layout.

 

**Analytics grid — 4 real-time charts**, styled with the `#1C999C` brand palette:

 

1. **Avance de registro:** bar/line chart counting entries grouped by week, using `Marca temporal`.

2. **Postulantes por región universitaria:** group `¿Dónde estudiaste?` using the lookup table below. Bar chart comparing Lima vs. Provincias vs. No especificado, expandable to see per-university detail.

3. **Postulantes por carrera:** bar chart, frequency of answers in `¿Qué estudiaste?`.

4. **Postulantes por sector de finanzas:** pie/donut chart, frequency of `Sector de Finanzas en el que trabajas:`.

**Tabla de mapeo Universidad → Región** (fixed lookup in code; any university not listed = "No especificado"):

 

| Universidad | Región |

|---|---|

| Universidad del Pacífico - UP | Lima |

| Universidad Nacional Mayor de San Marcos - UNMSM | Lima |

| Pontificia Universidad Católica del Perú - PUCP | Lima |

| Universidad de Piura - UDEP | Provincias |

| Universidad de Lima - ULIMA | Lima |

| Universidad Peruana de Ciencias Aplicadas - UPC | Lima |

| Universidad Esan - UESAN | Lima |

| Universidad Nacional de Ingeniería - UNI | Lima |

| Universidad Nacional Federico Villarreal - UNFV | Lima |

| Universidad Nacional de Trujillo - UNT | Provincias |

| Universidad Nacional Pedro Ruiz Gallo - UNPRG | Provincias |

| Universidad Nacional del Callao - UNAC | Lima |

| Universidad Tecnológica del Perú - UTP | Lima |

| Universidad Nacional de San Agustín de Arequipa - UNSA | Provincias |

| Universidad Católica San Pablo - UCSP | Provincias |

| Universidad Privada del Norte - UPN | Provincias |

| Universidad Nacional del Altiplano - UNA | Provincias |

| Universidad Católica de Santa María - UCSM | Provincias |

| Universidad Agraria de la Molina - UNALM | Lima |

| Universidad Científica del Sur - UCSUR | Lima |

| Universidad San Ignacio de Loyola - USIL | Lima |

| Universidad Privada Antenor Orrego - UPAO | Provincias |

| Universidad Andina de Cusco - UAC | Provincias |

| Universidad Privada San Juan Bautista - UPSJB | Lima |

| Universidad Continental - UC | Provincias |

| Universidad Católica Santo Toribio de Mogrovejo - USAT | Provincias |

| Universidad Ricardo Palma - URP | Lima |

| Universidad Nacional Santiago Antúnez de Mayolo - UNASAM | Provincias |

| Universidad Nacional San Cristóbal de Huamanga - UNSCH | Provincias |

| Universidad Nacional de Tumbes - UNTUMBES | Provincias |

| Universidad Nacional de San Antonio Abad del Cusco - UNSAAC | Provincias |

| Universidad Nacional de Piura - UNP | Provincias |

| Universidad Nacional de Frontera - UNF | Provincias |

| Universidad Nacional de Cajamarca - UNC | Provincias |

| Universidad Nacional Agraria de la Selva - UNAS | Provincias |

| Universidad Femenina del Sagrado Corazón - UNIFE | Lima |

| Universidad de San Martín de Porres - USMP | Lima |

| Universidad de Chiclayo - UDCH | Provincias |

| Universidad Autónoma del Perú - UA | Lima |

| *(cualquier otro valor)* | **No especificado** |

 

---

 

## 9. DIRECTOR ASSIGNMENTS TABLE & DETAILED AI MODAL

 

Under the analytics dashboard, an interactive grid listing all applicants with columns:

 

| Columna | Editable |

|---|---|

| Nombre Mentee | No |

| Nombre de coordinadora | **Sí** (dropdown) |

| Universidad | No |

| Puesto de Trabajo | No |

| Lugar de Trabajo Actual | No |

| Años de experiencia profesional | No |

| Comentarios de coordinadora | No |

| ¿Pasa a la fase 2 (Entrevistas)? | No |

| ¿Candidata destacada? | **Sí** (toggle) |

| Comentarios Directora *(maps to `Check Nicole`)* | **Sí** (text field) |

| Resultados Fase 1 | **Sí** (dropdown) |

 

- **Real-time save:** any inline edit to an editable column updates the corresponding Google Sheet row immediately, matched by DNI.

- **Detailed Modal:** clicking "Nombre Mentee" opens a modal/slide panel reusing the split-screen profile view (Sections 5–7), with an additional top card labeled **"Resumen Ejecutivo de Perfil por IA"**, summarizing CV, form answers, and LinkedIn profile (when accessible).

---

 

## 10. SYSTEM LANGUAGE

 

- Keep the entire interface text in Spanish: "Bienvenida", "Panel de Control", "Lista de Postulantes", "Guardar y Actualizar", "Comentarios Directora", "Vista Directora", etc.

- Mappings must strictly honor the Google Sheet's exact column names, casing, and accents during read/write operations.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pm-crm.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dfcdb57f-5fd8-499a-bbc7-2c7a66547943).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
