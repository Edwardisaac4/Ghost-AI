# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1: Foundation — Data layer and infrastructure

## Current Goal
 
- Wired Editor Home page and project CRUD APIs complete. Next: Editor Workspace Shell (feature-spec `08-editor-workspace-shell`).

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
- [x] Editor chrome base setup (feature-spec `02-editor-chrome`)
  - Create `EditorNavbar` component with sidebar toggle state support
  - Create floating overlay `ProjectSidebar` component with My Projects/Shared tabs and empty states
  - Update `Dialog` backdrop blur, container border radius to `rounded-3xl` and borders to match design guidelines
  - Integrate all components into `app/page.tsx` for interactive local testing
  - TypeScript compilation and ESLint checks pass with no warnings or errors
- [x] User authentication and route protection using Clerk (feature-spec `03-auth`)
  - Installed `@clerk/ui` theme package
  - Configured sign-in/sign-up redirect URL environment variables in `.env.local`
  - Integrated `ClerkProvider` inside body in `app/layout.tsx` using Clerk `dark` theme and Ghost AI CSS custom variables mapping (colorPrimary, colorBackground, colorBorder, etc.)
  - Created root-level Next.js 16 route protection middleware in `proxy.ts` (protecting all routes by default except sign-in/sign-up path patterns)
  - Split routes: moved local interactive mockup workspace page to `/editor` (`app/editor/page.tsx`), and rewrote `/` (`app/page.tsx`) to perform server-side redirect based on user authentication status
  - Added Clerk's built-in `<UserButton />` in the right section of the `EditorNavbar` (`components/editor/editor-navbar.tsx`)
  - Created Sign In (`app/sign-in/[[...sign-in]]/page.tsx`) and Sign Up (`app/sign-up/[[...sign-up]]/page.tsx`) pages using a sleek, professional two-panel desktop / one-panel mobile layout without gradients
  - [x] Project dialogs and Editor Home screen (feature-spec `04-project-dialogs`)
- [x] Prisma schema and data layer (feature-spec `05-prisma`)
- [x] Project REST APIs (feature-spec `06-project-apis`)
- [x] Wired Editor Home and Project CRUD APIs (feature-spec `07-wire-editor-home`)
  - Created `lib/project-data.ts` to query owned and shared projects server-side.
  - Modified `POST /api/projects` endpoint to accept optional client-side `id` to align Room ID and Project ID.
  - Implemented `hooks/use-project-actions.ts` hook for Dialog states and CRUD mutations (Create, Rename, Delete).
  - Modified `components/editor/project-sidebar.tsx` to dynamically render project lists, handle active states, and expose hover action callbacks.
  - Built interactive wrapper `app/editor/editor-home-client.tsx` holding Create, Rename, and Delete Dialogs.
  - Converted `app/editor/page.tsx` to Server Component fetching real project lists.
  - Created `app/editor/[roomId]/page.tsx` placeholder layout to avoid 404s.

## In Progress

- None.

## Next Up

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
