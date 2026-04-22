import { Elysia } from "elysia";
import { z } from "zod";
import * as ai from "@/ai/index";

export const suggestSchema = z.object({
  data: z.unknown().describe("The raw JSON data to analyze"),
});

export const extractSchema = z.object({
  config: z
    .record(z.string(), z.unknown())
    .describe("The HighCharts config object to extract data from"),
});

export const generateSchema = z.object({
  data: z.unknown().describe("The raw JSON data"),
  type: z
    .string()
    .describe("HighCharts chart type, e.g. 'bar', 'line', 'pie'"),
  title: z.string().optional().describe("Chart title (optional)"),
  colors: z
    .array(z.string())
    .optional()
    .describe("Hex color array for the chart palette (optional)"),
});

export const insightSchema = z.object({
  config: z
    .record(z.string(), z.unknown())
    .describe("The HighCharts config object to analyze"),
});

export const errorResponse = z.object({
  code: z.string().describe("Error code"),
  message: z.string().describe("Error message"),
});

export const errorSchema = z.object({
  error: errorResponse.describe("Error response"),
});

export const suggestResponse = z.object({
  data: z
    .array(
      z.object({
        type: z.string().describe("Recommended chart type"),
        reason: z.string().describe("Reason for recommendation"),
      })
    )
    .describe("Array of recommended chart types"),
});

export const extractResponse = z.object({
  data: z
    .array(z.record(z.string(), z.unknown()))
    .describe("Extracted data as array of records"),
});

export const generateResponse = z.object({
  data: z.unknown().describe("Generated chart configuration"),
});

export const insightResponse = z.object({
  data: z.object({
    insight: z.string().describe("Business insight analysis"),
  }),
});

export const aiRoutes = new Elysia({ prefix: "/api/v1/ai" })
  .post(
    "/suggest",
    async ({ body }) => {
      const result = await ai.suggestCharts(body.data);
      return { data: result };
    },
    {
      body: suggestSchema,
      response: {
        200: suggestResponse,
        400: errorSchema,
        500: errorSchema,
      },
    }
  )
  .post(
    "/extract",
    async ({ body }) => {
      const result = await ai.extractChart(body.config);
      return { data: result };
    },
    {
      body: extractSchema,
      response: {
        200: extractResponse,
        400: errorSchema,
        500: errorSchema,
      },
    }
  )
  .post(
    "/generate",
    async ({ body }) => {
      const result = await ai.generateChart(
        body.data,
        body.type,
        body.title,
        body.colors
      );
      return { data: result };
    },
    {
      body: generateSchema,
      response: {
        200: generateResponse,
        400: errorSchema,
        500: errorSchema,
      },
    }
  )
  .post(
    "/insight",
    async ({ body }) => {
      const result = await ai.insightChart(body.config);
      return { data: result };
    },
    {
      body: insightSchema,
      response: {
        200: insightResponse,
        400: errorSchema,
        500: errorSchema,
      },
    }
  );