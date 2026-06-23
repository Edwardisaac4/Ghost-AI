# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 2: Collaboration and Interactive Canvas

## Current Goal
 
- Implement Liveblocks-backed collaborative visual canvas and bottom shape panel.

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
- [x] Editor Workspace Shell (feature-spec `08-editor-workspace-shell`)
  - Built the responsive workspace shell with Server Component access checks.
- [x] Share Dialog and Collaborator Management (feature-spec `09-share-dialog`)
  - Added project collaborator invitations and share configurations.
- [x] Liveblocks setup and authentication (feature-spec `10-liveblocks-setup`)
  - Structured global TypeScript types, cached node client getter, and authentication routes.
- [x] Collaborative React Flow canvas (feature-spec `11-base-canvas`)
  - Integrated `useLiveblocksFlow` for collaborative canvas nodes and edges sync.
- [x] Shape panel and node creation (feature-spec `12-shape-panel`)
  - Built bottom floating shape panel and drag-and-drop node provisioning.
- [x] Proper shape rendering and drag preview (feature-spec `13-node-shape`)
  - Added scaleable SVG node shape rendering (diamond, hexagon, cylinder) and CSS styling for rectangle, pill, circle, with custom ghost drag previews.
- [x] Node resizing and inline label editing (feature-spec `14-node-editing`)
  - Integrated `NodeResizer` for resizing with minimum bounds and dark handles.
  - Implemented center-aligned double-click editing with isolated events and zero layout shifts.
- [x] Floating color toolbar (feature-spec `16-nodes-color-toolbar` / `15-node-color-toolbar`)
  - Built absolute-positioned color swatch picker floating above selected nodes.
  - Configured custom dark fills and vivid text matching color pairs dynamically.
  - Verified compatibility with updated 4-side connection handles and label editor.
- [x] Edge behavior, styling, and inline label editing (feature-spec `16-edge-behavior`)
  - Integrated 4 connection handles (Top, Right, Bottom, Left) styled as subtle white dots with dark borders that fade in on node hover.
  - Implemented custom edge renderer (`CustomEdge`) with dynamic edge and arrowhead coloring (dimmed at rest, brightened on hover, cyan brand accent when selected).
  - Resolved connection drawing and rendering issues by registering the custom renderer under both `"default"` and `"canvasEdge"` edge types, wrapping `onConnect` to auto-assign properties, and preventing CSS stroke style overrides.
  - Added support for multiple selectable edge routing styles: Smooth Step, Step (sharp), Straight, and Curved Bezier, toggled via a floating SVG style picker toolbar when selected.
  - Built double-click inline label editing with auto-growing input, auto-saving on Enter/blur, and drag/pan containment.

## In Progress

- None.

## Next Up

- [ ] Canvas ergonomics and keyboard controls (feature-spec `17-canvas-ergonomics`)

## Architecture Decisions

- Dark-only theme: shadcn's light `:root` and `.dark` blocks replaced with a single `:root` using project dark palette values. The `dark` class is set on `<html>` to satisfy any internal `dark:` variant usage in shadcn components.
- shadcn components live in `components/ui/` and must not be modified per `ai-workflow-rules.md`.

## Session Notes

- shadcn Nova preset was used for initialization.
- Project custom CSS variables (e.g., `--bg-base`, `--accent-primary`, `--accent-ai`) are mapped to Tailwind utilities via `@theme inline` (e.g., `bg-base`, text-brand, text-ai).
