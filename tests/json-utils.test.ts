import { describe, it, expect } from "vitest";
import {
  formatJson,
  minifyJson,
  validateJson,
} from "../src/tools/json-utils.js";

describe("json-utils", () => {
  it("formats JSON", () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it("formats with custom indent", () => {
    const result = formatJson('{"a":1}', 4);
    expect(result).toBe('{\n    "a": 1\n}');
  });

  it("minifies JSON", () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": 2\n}');
    expect(result).toBe('{"a":1,"b":2}');
  });

  it("validates valid JSON", () => {
    expect(validateJson('{"a":1}')).toEqual({ valid: true, type: "object" });
    expect(validateJson("[1,2]")).toEqual({ valid: true, type: "array" });
    expect(validateJson('"hello"')).toEqual({ valid: true, type: "string" });
  });

  it("validates invalid JSON", () => {
    const result = validateJson("{bad}");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
