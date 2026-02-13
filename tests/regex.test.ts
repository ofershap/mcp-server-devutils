import { describe, it, expect } from "vitest";
import { testRegex } from "../src/tools/regex.js";

describe("regex", () => {
  it("finds matches", () => {
    const result = testRegex("\\d+", "g", "abc 123 def 456");
    expect(result.matches).toBe(true);
    expect(result.matchCount).toBe(2);
    expect(result.groups[0]?.match).toBe("123");
    expect(result.groups[1]?.match).toBe("456");
  });

  it("reports no matches", () => {
    const result = testRegex("xyz", "g", "hello world");
    expect(result.matches).toBe(false);
    expect(result.matchCount).toBe(0);
  });

  it("captures named groups", () => {
    const result = testRegex(
      "(?<year>\\d{4})-(?<month>\\d{2})",
      "g",
      "2026-02-13",
    );
    expect(result.groups[0]?.groups?.year).toBe("2026");
    expect(result.groups[0]?.groups?.month).toBe("02");
  });

  it("works with case-insensitive flag", () => {
    const result = testRegex("hello", "gi", "Hello HELLO hello");
    expect(result.matchCount).toBe(3);
  });
});
