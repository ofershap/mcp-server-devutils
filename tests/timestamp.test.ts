import { describe, it, expect } from "vitest";
import { unixToIso, isoToUnix, now } from "../src/tools/timestamp.js";

describe("timestamp", () => {
  it("converts unix seconds to ISO", () => {
    expect(unixToIso(1700000000)).toBe("2023-11-14T22:13:20.000Z");
  });

  it("converts unix milliseconds to ISO", () => {
    expect(unixToIso(1700000000000)).toBe("2023-11-14T22:13:20.000Z");
  });

  it("converts ISO to unix", () => {
    const result = isoToUnix("2023-11-14T22:13:20.000Z");
    expect(result.seconds).toBe(1700000000);
    expect(result.milliseconds).toBe(1700000000000);
  });

  it("throws on invalid date", () => {
    expect(() => isoToUnix("not-a-date")).toThrow("Invalid date string");
  });

  it("now returns all formats", () => {
    const result = now();
    expect(result.iso).toBeTruthy();
    expect(result.unix).toBeGreaterThan(0);
    expect(result.unixMs).toBeGreaterThan(0);
    expect(result.utc).toBeTruthy();
  });
});
