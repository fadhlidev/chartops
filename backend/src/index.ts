import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@bogeychan/elysia-logger";
import { aiRoutes } from "@/routes/ai";

const app = new Elysia()
  .use(
    logger({
      autoLogging: {
        ignore: (ctx) => ctx.path === "/health",
      },
    }),
  )
  .use(cors())
  .use(
    rateLimit({
      duration: 60 * 1000,
      max: 60,
    }),
  )
  .use(swagger())
  .use(aiRoutes)
  .onError(({ error, code, log }) => {
    if (log) {
      log.error(error);
    } else {
      console.error(error);
    }
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      error: {
        code: code === "VALIDATION" ? "validation_error" : "internal_error",
        message,
      },
    };
  })
  .get("/", () => "ChartOps API")
  .get("/health", () => ({ status: "ok" }))
  .listen(8080);

const { hostname, port } = app.server ?? { hostname: "localhost", port: 8080 };
console.log(``);
console.log(`   ╭──────────────────────────────────╮`);
console.log(`   │      🚀 ChartOps API Ready       │`);
console.log(`   ╰──────────────────────────────────╯`);
console.log(``);
console.log(`   Local:   http://${hostname}:${port}`);
console.log(`   Docs:    http://${hostname}:${port}/swagger`);
console.log(`   Health:  http://${hostname}:${port}/health`);
console.log(``);
