import { z } from "zod";
import { tool } from "langchain/tools";
import { callWithSystem, parseJSON } from "@/ai/utils";
import extract from "@/ai/prompts/extract.md" assert { type: "text" };

const outputSchema = z.array(z.record(z.string(), z.unknown()));

export type ExtractChartOutput = z.infer<typeof outputSchema>;

export const extractChartTool = tool(
  async ({ config }) => {
    const result = await callWithSystem(
      extract,
      JSON.stringify(config),
      (text) => outputSchema.parse(parseJSON(text)),
    );
    return JSON.stringify(result);
  },
  {
    name: "extract_chart",
    description:
      "Reverse-engineer a HighCharts configuration back into clean tabular data. " +
      "Returns a JSON array of flat record objects, one per data point.",
    schema: z.object({
      config: z
        .record(z.string(), z.unknown())
        .describe("The HighCharts config object to extract data from"),
    }),
  },
);
