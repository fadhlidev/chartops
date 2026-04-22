import { z } from "zod";
import { tool } from "langchain/tools";
import { template } from "radash";
import { callWithSystem, parseJSON } from "@/ai/utils";
import system from "@/ai/prompts/system.md" assert { type: "text" };
import suggest from "@/ai/prompts/suggest.md" assert { type: "text" };

const outputSchema = z.array(
  z.object({ type: z.string(), reason: z.string() }),
);

export type SuggestChartsOutput = z.infer<typeof outputSchema>;

export const suggestChartsTool = tool(
  async ({ data }) => {
    const result = await callWithSystem(
      system,
      template(suggest, { DATA: JSON.stringify(data) }),
      (text) => outputSchema.parse(parseJSON(text)),
    );
    return JSON.stringify(result);
  },
  {
    name: "suggest_charts",
    description:
      "Analyze JSON data and recommend the top 3 most effective HighCharts chart types. " +
      "Returns an array of { type, reason } ordered from most to least recommended.",
    schema: z.object({
      data: z.unknown().describe("The raw JSON data to analyze"),
    }),
  },
);
