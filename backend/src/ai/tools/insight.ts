import { z } from "zod";
import { tool } from "langchain/tools";
import { callWithSystem, parseJSON } from "@/ai/utils";
import insight from "@/ai/prompts/insight.md" assert { type: "text" };

const outputSchema = z.object({ insight: z.string() });

export type InsightChartOutput = z.infer<typeof outputSchema>;

export const insightChartTool = tool(
  async ({ config }) => {
    const result = await callWithSystem(
      insight,
      JSON.stringify(config),
      (text) => outputSchema.parse(parseJSON(text)),
    );
    return JSON.stringify(result);
  },
  {
    name: "insight_chart",
    description:
      "Analyze a HighCharts configuration and produce human-readable business insights. " +
      "Returns { insight } where the value is a Markdown-formatted analysis string.",
    schema: z.object({
      config: z
        .record(z.string(), z.unknown())
        .describe("The HighCharts config object to analyze"),
    }),
  },
);
