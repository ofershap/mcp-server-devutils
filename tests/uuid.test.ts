import { describe, it, expect } from "vitest";
import { generateUuid, generateUlid } from "../src/tools/uuid.js";

describe("uuid", () => {
  it("generates a valid UUID v4", () => {
    const [uuid] = generateUuid(1);
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("generates multiple UUIDs", () => {
    const uuids = generateUuid(5);
    expect(uuids).toHaveLength(5);
    const unique = new Set(uuids);
    expect(unique.size).toBe(5);
  });

  it("caps at 100", () => {
    const uuids = generateUuid(200);
    expect(uuids).toHaveLength(100);
  });
});

describe("ulid", () => {
  it("generates a 26-character ULID", () => {
    const ulid = generateUlid();
    expect(ulid).toHaveLength(26);
    expect(ulid).toMatch(/^[0-9A-Z]{26}$/);
  });

  it("generates unique ULIDs", () => {
    const a = generateUlid();
    const b = generateUlid();
    expect(a).not.toBe(b);
  });
});
