import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const createApp = () =>
  new Elysia()
    .use(cors())
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

describe("GET /", () => {
  it("returns 200", async () => {
    const app = createApp();
    const res = await app.handle(req("/"));
    expect(res.status).toBe(200);
  });

  it("returns the string 'ChartOps API'", async () => {
    const app = createApp();
    const res = await app.handle(req("/"));
    const text = await res.text();
    expect(text).toBe("ChartOps API");
  });
});

describe("GET /health", () => {
  it("returns 200", async () => {
    const app = createApp();
    const res = await app.handle(req("/health"));
    expect(res.status).toBe(200);
  });

  it("returns { status: 'ok' }", async () => {
    const app = createApp();
    const res = await app.handle(req("/health"));
    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});

describe("Unknown routes", () => {
  it("returns 404 for an unregistered route", async () => {
    const app = createApp();
    const res = await app.handle(req("/unknown"));
    expect(res.status).toBe(404);
  });
});

describe("CORS headers", () => {
  it("GET / response includes Access-Control-Allow-Origin", async () => {
    const app = createApp();
    const res = await app.handle(
      new Request("http://localhost/", {
        headers: { Origin: "http://example.com" },
      })
    );
    const corsHeader = res.headers.get("Access-Control-Allow-Origin");
    expect(corsHeader).not.toBeNull();
  });
});

describe("Response Content-Type", () => {
  it("JSON endpoints return Content-Type application/json", async () => {
    const app = createApp();
    const res = await app.handle(req("/health"));
    const ct = res.headers.get("Content-Type");
    expect(ct).toContain("application/json");
  });
});