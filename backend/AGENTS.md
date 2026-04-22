# ChartOps Backend

Elysia + Bun runtime.

## Commands
```bash
bun dev     # dev server with watch mode
bun run dev # same as above
```

## API Routes (v1)
- `POST /api/v1/ai/suggest` - Suggest chart types
- `POST /api/v1/ai/extract` - Extract data from chart config
- `POST /api/v1/ai/generate` - Generate chart config
- `POST /api/v1/ai/insight` - Generate insights

## Plugins
- `@bogeychan/elysia-logger` - Pino-based logging (autoLogging enabled)
- `@elysiajs/cors` - CORS support
- `elysia-rate-limit` - Rate limiting (60 req/min)
- `@elysiajs/swagger` - OpenAPI docs at `/swagger`

## Notes
- Entry point: `src/index.ts`
- Port: 8080
- OpenAPI docs at `/swagger`
- Global error handler returns `{ error: { code, message } }`
- No tests/lint/typecheck configured
