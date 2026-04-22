import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: process.env.OPENAI_API_MODEL || "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});
