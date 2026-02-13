import { describe, it, expect } from "vitest";
import { base64Encode, base64Decode } from "../src/tools/base64.js";

describe("base64", () => {
  it("encodes a string", () => {
    expect(base64Encode("hello world")).toBe("aGVsbG8gd29ybGQ=");
  });

  it("decodes a string", () => {
    expect(base64Decode("aGVsbG8gd29ybGQ=")).toBe("hello world");
  });

  it("roundtrips", () => {
    const input = "The quick brown fox 🦊";
    expect(base64Decode(base64Encode(input))).toBe(input);
  });

  it("handles empty string", () => {
    expect(base64Encode("")).toBe("");
    expect(base64Decode("")).toBe("");
  });

  it("handles unicode", () => {
    const input = "שלום עולם";
    expect(base64Decode(base64Encode(input))).toBe(input);
  });
});
