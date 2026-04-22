<!-- BEGIN:nextjs-agent-rules -->
# ChartOps Frontend

Next.js 16 / React 19

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.

## Key Versions
- Next.js 16.2.4
- React 19.2.4
- ESLint 9 (flat config in `eslint.config.mjs`)
- Tailwind 4 (`@tailwindcss/postcss` v4)

## Commands
```bash
bun dev      # dev server at localhost:3000
bun build   # production build
bun lint   # ESLint only (no typecheck)
```

## Notes
- No typecheck script configured - lint is the only verification
- Read `node_modules/next/dist/docs/` for breaking changes before writing code
- Tailwind 4 uses CSS-based configuration (not `tailwind.config.js`)
- ESLint 9 uses flat config structure

<!-- END:nextjs-agent-rules -->
