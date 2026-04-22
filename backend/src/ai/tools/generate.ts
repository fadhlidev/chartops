import { z } from "zod";
import { tool } from "langchain/tools";
import { template } from "radash";
import { callWithSystem, parseJSON } from "@/ai/utils";
import { TemplateSchema } from "@/core/schema";
import system from "@/ai/prompts/system.md" assert { type: "text" };
import generate from "@/ai/prompts/generate.md" assert { type: "text" };

export type GenerateChartOutput = z.infer<typeof TemplateSchema>;

const DEFAULT_COLORS = ["#FFA552", "#E77768", "#6FC9BF", "#286FB0"];

export const generateChartTool = tool(
  async ({ data, type, title, colors }) => {
    const result = await callWithSystem(
      system,
      template(generate, {
        DATA: JSON.stringify(data),
        TYPE: type,
        TITLE: title,
        COLORS: JSON.stringify(colors ?? DEFAULT_COLORS),
      }),
      (text) => TemplateSchema.parse(parseJSON(text)),
    );
    return JSON.stringify(result);
  },
  {
    name: "generate_chart",
    description:
      "Generate a complete HighCharts configuration object plus dataMapping metadata " +
      "for a given chart type and dataset. Returns { config, dataMapping }.",
    schema: z.object({
      data: z.unknown().describe("The raw JSON data"),
      type: z
        .string()
        .describe("HighCharts chart type, e.g. 'bar', 'line', 'pie'"),
      title: z.string().optional().describe("Chart title (optional)"),
      colors: z
        .array(z.string())
        .optional()
        .describe("Hex color array for the chart palette (optional)"),
    }),
  },
);
