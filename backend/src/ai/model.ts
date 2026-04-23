import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

const provider = process.env.LLM_PROVIDER || "openai";

export const model: BaseChatModel = (() => {
  switch (provider) {
    case "anthropic":
      return new ChatAnthropic({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        apiKey: process.env.ANTHROPIC_API_KEY,
        temperature: 0.7,
      });
    case "google":
    case "gemini":
      return new ChatGoogleGenerativeAI({
        model: process.env.GOOGLE_MODEL || "gemini-2.0-flash",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.7,
      });
    case "ollama":
      return new ChatOllama({
        model: process.env.OLLAMA_MODEL || "llama3",
        temperature: 0.7,
      });
    case "openai":
    default:
      return new ChatOpenAI({
        model: process.env.OPENAI_API_MODEL || "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
      });
  }
})();
