import { z } from "zod";
import { createDeepAgent } from "deepagents";
import { model } from "@/ai/model";
import { parseJSON } from "@/ai/utils";
import {
  suggestChartsTool,
  type SuggestChartsOutput,
} from "@/ai/tools/suggest";
import system from "@/ai/prompts/system.md" assert { type: "text" };

export const chartAgent = createDeepAgent({
  model,
  tools: [suggestChartsTool],
  systemPrompt: system,
});

async function invokeAgent(userMessage: string): Promise<string> {
  const result = await chartAgent.invoke({
    messages: [{ role: "user", content: userMessage }],
  });

  const last = result.messages[result.messages.length - 1];
  return typeof last?.content === "string"
    ? last.content
    : JSON.stringify(last?.content ?? "");
}

export async function suggestCharts(
  data: unknown,
): Promise<SuggestChartsOutput> {
  const raw = await invokeAgent(
    `Call suggest_charts with this data: ${JSON.stringify(data)}`,
  );
  return z
    .array(z.object({ type: z.string(), reason: z.string() }))
    .parse(parseJSON(raw));
}
