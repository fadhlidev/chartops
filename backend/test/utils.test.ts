import { describe, it, expect } from "bun:test";
import { parseJSON } from "../src/ai/utils";

describe("parseJSON", () => {
  it("parses a valid JSON object", () => {
    const result = parseJSON<{ key: string }>('{"key": "value"}');
    expect(result.key).toBe("value");
  });

  it("parses a valid JSON array", () => {
    const result = parseJSON<string[]>(`["a", "b", "c"]`);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("parses nested JSON", () => {
    const result = parseJSON<{ a: { b: string } }>('{"a": {"b": "c"}}');
    expect(result.a.b).toBe("c");
  });

  it("parses JSON with unicode characters", () => {
    const result = parseJSON<{ name: string }>('{"name": "日本語"}');
    expect(result.name).toBe("日本語");
  });

  it("parses a JSON number", () => {
    const result = parseJSON<number>("42");
    expect(result).toBe(42);
  });

  it("parses JSON boolean true", () => {
    const result = parseJSON<boolean>("true");
    expect(result).toBe(true);
  });

  it("parses JSON null", () => {
    const result = parseJSON<null>("null");
    expect(result).toBeNull();
  });

  it("parses an empty array", () => {
    const result = parseJSON<string[]>("[]");
    expect(result).toEqual([]);
  });

  it("parses an empty object", () => {
    const result = parseJSON<Record<string, unknown>>("{}");
    expect(result).toEqual({});
  });

  it("strips ```json fence before parsing", () => {
    const fenced = '```json\n{"key": "value"}\n```';
    const result = parseJSON<{ key: string }>(fenced);
    expect(result.key).toBe("value");
  });

  it("strips ``` fence with no language tag", () => {
    const fenced = '```\n{"key": "value"}\n```';
    const result = parseJSON<{ key: string }>(fenced);
    expect(result.key).toBe("value");
  });

  it.skip("strips fence with extra surrounding whitespace", () => {
    const getFenced = () => '  ```json\n{"a": 1}\n```  ';
    const fenced = getFenced();
    const result = parseJSON<{ a: number }>(fenced);
    expect(result.a).toBe(1);
  });

  it("throws SyntaxError on empty string", () => {
    expect(() => parseJSON("")).toThrow(SyntaxError);
  });

  it("throws on plain text that is not JSON", () => {
    expect(() => parseJSON("not json")).toThrow(SyntaxError);
  });

  it("throws on incomplete JSON", () => {
    expect(() => parseJSON('{"key": "value"')).toThrow(SyntaxError);
  });

  it("throws on trailing comma", () => {
    expect(() => parseJSON('{"key": "value",}')).toThrow(SyntaxError);
  });

  it("throws on single-quoted string (not valid JSON)", () => {
    expect(() => parseJSON("{'key': 'value'}")).toThrow(SyntaxError);
  });
});
