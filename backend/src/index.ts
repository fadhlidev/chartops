import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";
import { swagger } from "@elysiajs/swagger";
import { aiRoutes } from "@/routes/ai";

const app = new Elysia()
  .use(cors())
  .use(
    rateLimit({
      duration: 60 * 1000,
      max: 60,
    })
  )
  .use(swagger())
  .use(aiRoutes)
  .onError(({ error, code }) => {
    console.error(error);
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

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);