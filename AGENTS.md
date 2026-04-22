# ChartOps

Monorepo with frontend (Next.js) and backend (Elysia).

## Structure

- `frontend/` - Next.js app (app router)
- `backend/` - Elysia API server

## Commands

```bash
# Frontend
cd frontend && bun dev      # dev server at localhost:3000
cd frontend && bun build   # production build
cd frontend && bun lint   # ESLint

# Backend
cd backend && bun dev     # dev server with watch mode
cd backend && bun run dev # same as above
```

## Tech Stack Notes

- **Bun** is the runtime for both packages (not npm/yarn/pnpm)
- **Next.js 16** - very recent version. Check `node_modules/next/dist/docs/` for breaking changes
- **ESLint 9** - flat config in `eslint.config.mjs`
- **Tailwind 4** - configured with `@tailwindcss/postcss` v4
- **Elysia** - fast web framework, uses decorators differently from Express

## Key Constraints

- No tests configured in either package
- Frontend has no typecheck script (only lint)
- Backend has no test script

## Existing Docs

- `frontend/AGENTS.md` - Next.js specific agent rules