import { z } from "zod";
import { createDeepAgent } from "deepagents";
import { model } from "@/ai/model";
import { parseJSON } from "@/ai/utils";
import {
  suggestChartsTool,
  type SuggestChartsOutput,
  extractChartTool,
  type ExtractChartOutput,
  generateChartTool,
  type GenerateChartOutput,
  insightChartTool,
  type InsightChartOutput,
} from "@/ai/tools";
import system from "@/ai/prompts/system.md" assert { type: "text" };

export const chartAgent = createDeepAgent({
  model,
  tools: [suggestChartsTool, extractChartTool, generateChartTool, insightChartTool],
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

export async function extractChart(
  config: unknown,
): Promise<ExtractChartOutput> {
  const raw = await invokeAgent(
    `Call extract_chart with this config: ${JSON.stringify(config)}`,
  );
  return z.array(z.record(z.string(), z.unknown())).parse(parseJSON(raw));
}

export async function generateChart(
  data: unknown,
  type: string,
  title?: string,
  colors?: string[],
): Promise<GenerateChartOutput> {
  const raw = await invokeAgent(
    `Call generate_chart with data: ${JSON.stringify(data)}, type: ${type}, title: ${title ?? 'undefined'}, colors: ${JSON.stringify(colors ?? [])}`,
  );
  const schema = z.object({ config: z.unknown(), dataMapping: z.unknown() });
  return schema.parse(parseJSON(raw)).config as GenerateChartOutput;
}

export async function insightChart(
  config: unknown,
): Promise<InsightChartOutput> {
  const raw = await invokeAgent(
    `Call insight_chart with this config: ${JSON.stringify(config)}`,
  );
  return z.object({ insight: z.string() }).parse(parseJSON(raw));
}
