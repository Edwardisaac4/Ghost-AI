# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation — Data layer and infrastructure

## Current Goal

- Design system setup and styling complete. Next: Editor chrome base setup.

## Completed

- [x] Project scaffolding (Next.js 16, Tailwind 4, TypeScript)
- [x] Boilerplate cleanup (globals.css cleared, public assets pruned)
- [x] Design system setup (feature-spec `01-design-system`)
  - shadcn/ui initialized (base-nova preset, Geist fonts, Lucide icons)
  - shadcn components added: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - `lucide-react` installed
  - `lib/utils.ts` created with `cn()` helper (clsx + tailwind-merge)
  - `globals.css` rewritten: dark-only theme, project color tokens from `ui-context.md`, shadcn CSS variable mappings
  - Layout updated: `dark` class on `<html>`, metadata set to Ghost AI
  - TypeScript strict check passes

## In Progress

- None.

## Next Up

- [ ] Editor chrome base setup (feature-spec `02-editor-chrome`)
- [ ] User authentication and route protection using Clerk (feature-spec `03-auth`)
- [ ] Project dialogs and Editor Home screen (feature-spec `04-project-dialogs`)
- [ ] Prisma schema and data layer (feature-spec `05-prisma`)
- [ ] Project REST APIs (feature-spec `06-project-apis`)
- [ ] Wired Editor Home and Project CRUD APIs (feature-spec `07-wire-editor-home`)
- [ ] Editor Workspace Shell (feature-spec `08-editor-workspace-shell`)
- [ ] Share Dialog and Collaborator Management (feature-spec `09-share-dialog`)
- [ ] Liveblocks setup and authentication (feature-spec `10-liveblocks-setup`)
- [ ] Collaborative React Flow canvas (feature-spec `11-base-canvas`)
- [ ] Shape panel and node creation (feature-spec `12-shape-panel`)

## Open Questions

- None.

## Architecture Decisions

- Dark-only theme: shadcn's light `:root` and `.dark` blocks replaced with a single `:root` using project dark palette values. The `dark` class is set on `<html>` to satisfy any internal `dark:` variant usage in shadcn components.
- shadcn components live in `components/ui/` and must not be modified per `ai-workflow-rules.md`.

## Session Notes

- shadcn Nova preset was used for initialization.
- Project custom CSS variables (e.g., `--bg-base`, `--accent-primary`, `--accent-ai`) are mapped to Tailwind utilities via `@theme inline` (e.g., `bg-base`, text-brand, text-ai).
