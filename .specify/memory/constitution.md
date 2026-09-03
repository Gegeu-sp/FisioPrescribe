# FisioPrescribe Constitution

## Core Principles

### I. Zero-Build, Single-File Delivery
FisioPrescribe ships as a single static `index.html` with no build step, bundler,
or server-side runtime. Any new dependency MUST be loadable via a `<script>`/`<link>`
tag; if a feature genuinely requires a build pipeline, that is a breaking change to
this principle and MUST be proposed and justified explicitly before implementation.

### II. Conteúdo Clínico Rastreável (NON-NEGOTIABLE)
Every pathology entry in the local `DB` (name, CID-10, prevalence, medications,
exercise protocol, contraindications) MUST be attributable to a recognized source
(NIH Clinical Tables, RxNorm/NLM, ACSM, WHO/OMS, or an equivalent clinical
guideline). No entry may claim a prescriptive medical action — this is decision
support content for exercise professionals, not medical advice. Every generated
report MUST keep the legal disclaimer stating the tool does not replace medical
evaluation.

### III. Segurança do Usuário Final
User-controlled and third-party-API-controlled strings (search terms, NIH API
results) MUST be HTML-escaped before being interpolated into `innerHTML`. Outbound
requests to third-party APIs MUST use a timeout and fail gracefully into a visible
error state — the UI must never hang on `loading`.

### IV. Acessível e Bilíngue-Ready por Padrão
UI text is Portuguese (pt-BR) first. Interactive elements MUST remain keyboard-
and screen-reader-usable (semantic buttons, `alt` text, sufficient color contrast
in both light and dark themes). Dark mode MUST be applied before first paint
(no flash of unstyled/wrong theme) and persisted via `localStorage`.

### V. Simplicidade sobre Abstração
Prefer small, direct functions over frameworks or premature abstractions. Shared
logic (e.g. report text generation) MUST be factored into a single helper instead
of duplicated across call sites, but new abstractions are only added when at least
two call sites already need them — not speculatively.

## Padrões Técnicos

- Stack: HTML5 + Tailwind (CDN) + vanilla JS (ES2017-safe, no transpiler) + Lucide
  icons (CDN). No npm install / build required to run the app — opening
  `index.html` in a browser (or serving the folder statically) must always work.
  Additional CDN scripts (Tailwind, Lucide, Fontsource) MUST come from the
  currently-approved list in the `<head>`; do not silently swap CDNs.
- External integrations: NIH Clinical Table Search Service (condition lookup) and
  RxNorm REST (medication verification) are called client-side, are optional
  (the app must remain usable from the local `DB` when offline), and MUST use the
  existing `fT()` timeout wrapper.
- Assets: the project icon lives at `assets/icon.svg` (source) with a rendered
  `assets/icon-512.png` fallback for favicons/social previews. Regenerate the PNG
  from the SVG rather than hand-editing it.

## Fluxo de Desenvolvimento

- This repository uses Spec Kit (`.specify/`) for spec-driven development. Any
  non-trivial feature (new pathology category, new report format, new
  integration) should go through `/speckit-specify` → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement` rather than being coded ad hoc directly
  in `index.html`.
- Before adding or editing a pathology entry in `DB`, verify the clinical claim
  against a cited source (Principle II) and keep entries structurally consistent
  with existing ones (`keys`, `nome`, `cid`, `prev`, `risco`, `rLabel`, `rCor`,
  `rNota`, `desc`, `sint`, `tratGeral`, `meds`, `proto`, `exer`, `contra`).
- Manual verification checklist for UI changes: search works from the local DB,
  fallback to the NIH API works, all four report tabs render, print/copy/download
  actions work, and dark mode toggles without a flash on reload.

## Governance

This constitution supersedes ad hoc conventions for FisioPrescribe. Amendments
require a clear rationale recorded in the PR/commit description and a version
bump below. Pull requests that touch clinical content or user-input handling
must explicitly confirm compliance with Principles II and III.

**Version**: 1.0.0 | **Ratified**: 2026-09-03 | **Last Amended**: 2026-09-03
