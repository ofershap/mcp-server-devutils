import { describe, it, expect } from "vitest";
import { hash, hashAll } from "../src/tools/hash.js";

describe("hash", () => {
  it("produces sha256 by default", () => {
    const result = hash("hello");
    expect(result).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });

  it("produces md5", () => {
    const result = hash("hello", "md5");
    expect(result).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("produces sha1", () => {
    const result = hash("hello", "sha1");
    expect(result).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
  });

  it("hashAll returns all algorithms", () => {
    const result = hashAll("test");
    expect(Object.keys(result)).toEqual([
      "md5",
      "sha1",
      "sha256",
      "sha384",
      "sha512",
    ]);
    expect(result.md5).toBe("098f6bcd4621d373cade4e832627b4f6");
  });
});
