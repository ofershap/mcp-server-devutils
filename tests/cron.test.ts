import { describe, it, expect } from "vitest";
import { explainCron, validateCron, nextCronRuns } from "../src/tools/cron.js";

describe("cron", () => {
  describe("explainCron", () => {
    it("explains a simple expression", () => {
      const result = explainCron("0 9 * * 1-5");
      expect(result).toContain("at minute 0");
      expect(result).toContain("at hour 9");
      expect(result).toContain("Monday through Friday");
    });

    it("explains every minute", () => {
      const result = explainCron("* * * * *");
      expect(result).toContain("every minute");
      expect(result).toContain("every hour");
    });

    it("throws on invalid expression", () => {
      expect(() => explainCron("invalid")).toThrow("expected 5 fields");
    });
  });

  describe("validateCron", () => {
    it("validates a correct expression", () => {
      expect(validateCron("0 9 * * 1-5")).toEqual({ valid: true });
    });

    it("rejects wrong field count", () => {
      const result = validateCron("0 9 *");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Expected 5 fields");
    });

    it("rejects out-of-range values", () => {
      const result = validateCron("60 9 * * *");
      expect(result.valid).toBe(false);
    });
  });

  describe("nextCronRuns", () => {
    it("returns the requested number of runs", () => {
      const runs = nextCronRuns("* * * * *", 3);
      expect(runs).toHaveLength(3);
    });

    it("returns valid ISO dates", () => {
      const runs = nextCronRuns("0 12 * * *", 2);
      for (const run of runs) {
        expect(new Date(run).toISOString()).toBe(run);
      }
    });

    it("throws on invalid expression", () => {
      expect(() => nextCronRuns("bad cron")).toThrow();
    });
  });
});
