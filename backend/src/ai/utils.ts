import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "@/ai/model";

export async function callWithSystem<T>(
  systemContent: string,
  userContent: string,
  parse: (text: string) => T,
): Promise<T> {
  const response = await model.invoke([
    new SystemMessage(systemContent),
    new HumanMessage(userContent),
  ]);

  const text =
    typeof response.content === "string"
      ? response.content
      : response.content
          .map((block) => ("text" in block ? block.text : ""))
          .join("");

  return parse(text);
}

export function parseJSON<T>(text: string): T {
  const clean = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();
  return JSON.parse(clean) as T;
}
