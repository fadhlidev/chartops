import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { z } from "zod";

const mockAi = {
  suggestCharts: async () => [
    { type: "line", reason: "Good for trends" },
    { type: "bar", reason: "Good for comparisons" },
  ],
  generateChart: async () => ({
    config: { chart: { type: "line" }, credits: { enabled: false } },
    dataMapping: { seriesPath: ["series"], dataStructure: { type: "array" }, fieldMappings: [] },
  }),
  insightChart: async () => ({ insight: "Sales increased by 50%" }),
  extractChart: async () => [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 200 },
  ],
};

const suggestSchema = z.object({
  data: z.unknown(),
}).required();

const generateSchema = z.object({
  data: z.unknown(),
  type: z.string(),
  title: z.string().optional(),
  colors: z.array(z.string()).optional(),
}).required();

const insightSchema = z.object({
  config: z.record(z.string(), z.unknown()),
}).required();

const extractSchema = z.object({
  config: z.record(z.string(), z.unknown()),
}).required();

const createApp = () =>
  new Elysia()
    .use(cors())
    .derive(() => ({ ai: mockAi }))
    .post("/api/v1/ai/suggest", async ({ body, ai }) => {
      const result = await ai.suggestCharts(body.data);
      return { data: result };
    }, { body: suggestSchema })
    .post("/api/v1/ai/generate", async ({ body, ai }) => {
      const result = await ai.generateChart(body.data, body.type, body.title, body.colors);
      return { data: result };
    }, { body: generateSchema })
    .post("/api/v1/ai/insight", async ({ body, ai }) => {
      const result = await ai.insightChart(body.config);
      return { data: result };
    }, { body: insightSchema })
    .post("/api/v1/ai/extract", async ({ body, ai }) => {
      const result = await ai.extractChart(body.config);
      return { data: result };
    }, { body: extractSchema })
    .get("/", () => "ChartOps API")
    .get("/health", () => ({ status: "ok" }))
    .onError(({ error, code }) => {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      return {
        error: {
          code: code === "VALIDATION" ? "validation_error" : "internal_error",
          message,
        },
      };
    });

const req = (path: string, options: RequestInit = {}) =>
  new Request(`http://localhost${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

describe("POST /api/v1/ai/suggest", () => {
  it("returns 200 with a valid data array", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/suggest", {
        method: "POST",
        body: JSON.stringify({ data: [{ month: "Jan", sales: 100 }] }),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 if the data field is missing", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/suggest", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );
    expect([400, 422]).toContain(res.status);
  });

  it("returns 500 if suggestCharts throws an error", async () => {
    const errorApp = new Elysia()
      .use(cors())
      .derive(() => ({
        ai: {
          ...mockAi,
          suggestCharts: async () => { throw new Error("Error"); },
        },
      }))
      .post("/api/v1/ai/suggest", async ({ body, ai }) => {
        const result = await ai.suggestCharts(body.data);
        return { data: result };
      })
      .onError(({ error, code }) => {
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        return {
          error: {
            code: code === "VALIDATION" ? "validation_error" : "internal_error",
            message,
          },
        };
      });

    const res = await errorApp.handle(
      req("/api/v1/ai/suggest", {
        method: "POST",
        body: JSON.stringify({ data: [{ x: 1 }] }),
      })
    );
    expect(res.status).toBe(500);
  });
});

describe("POST /api/v1/ai/generate", () => {
  it("returns 200 with valid data and type", async () => {
    const app = new Elysia()
      .use(cors())
      .derive(() => ({ ai: mockAi }))
      .post("/api/v1/ai/generate", async ({ body, ai }) => {
        const result = await ai.generateChart(body.data, body.type, body.title, body.colors);
        return { data: result };
      });

    const res = await app.handle(
      req("/api/v1/ai/generate", {
        method: "POST",
        body: JSON.stringify({ data: [{ month: "Jan", sales: 100 }], type: "line" }),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 if the type field is missing", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/generate", {
        method: "POST",
        body: JSON.stringify({ data: [{ sales: 100 }] }),
      })
    );
    expect([400, 422]).toContain(res.status);
  });
});

describe("POST /api/v1/ai/insight", () => {
  it("returns 200 with a valid config", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/insight", {
        method: "POST",
        body: JSON.stringify({ config: { chart: { type: "line" } } }),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 if the config field is missing", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/insight", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );
    expect([400, 422]).toContain(res.status);
  });
});

describe("POST /api/v1/ai/extract", () => {
  it("returns 200 with a valid config", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/extract", {
        method: "POST",
        body: JSON.stringify({ config: { chart: { type: "line" } } }),
      })
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 if the config field is missing", async () => {
    const app = createApp();
    const res = await app.handle(
      req("/api/v1/ai/extract", {
        method: "POST",
        body: JSON.stringify({}),
      })
    );
    expect([400, 422]).toContain(res.status);
  });
});