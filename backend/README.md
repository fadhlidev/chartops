# ChartOps Backend

Elysia API server with Bun runtime.

## Stack

- **Runtime**: Bun
- **Framework**: Elysia
- **Logging**: Pino (via `@bogeychan/elysia-logger`)

## Getting Started

```bash
bun install
bun run dev
```

Server runs at `http://localhost:8080`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Health status |
| GET | `/swagger` | OpenAPI documentation |
| POST | `/api/v1/ai/suggest` | Suggest chart types for data |
| POST | `/api/v1/ai/extract` | Extract data from chart config |
| POST | `/api/v1/ai/generate` | Generate chart configuration |
| POST | `/api/v1/ai/insight` | Generate insights from chart |

## Request Examples

### POST /api/v1/ai/suggest

```json
{
  "data": [{ "month": "Jan", "sales": 100 }]
}
```

### POST /api/v1/ai/extract

```json
{
  "config": { "chart": { "type": "column" }, "series": [...] }
}
```

### POST /api/v1/ai/generate

```json
{
  "data": [{ "month": "Jan", "sales": 100 }],
  "type": "bar",
  "title": "Monthly Sales",
  "colors": ["#FFA552", "#E77768"]
}
```

### POST /api/v1/ai/insight

```json
{
  "config": { "chart": { "type": "column" }, "series": [...] }
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_API_MODEL` | Model to use (default: `gpt-4o`) |

## Configuration

- **Port**: 8080
- **Rate Limit**: 60 requests/minute
- **CORS**: Enabled for all origins