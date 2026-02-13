import { describe, it, expect } from "vitest";
import { decodeJwt } from "../src/tools/jwt.js";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("jwt", () => {
  it("decodes header and payload", () => {
    const result = decodeJwt(SAMPLE_JWT);
    expect(result.header).toEqual({ alg: "HS256", typ: "JWT" });
    expect(result.payload).toEqual({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
    });
  });

  it("reports issuedAt", () => {
    const result = decodeJwt(SAMPLE_JWT);
    expect(result.issuedAt).toBe("2018-01-18T01:30:22.000Z");
  });

  it("reports null for missing exp", () => {
    const result = decodeJwt(SAMPLE_JWT);
    expect(result.isExpired).toBeNull();
    expect(result.expiresAt).toBeNull();
  });

  it("throws on invalid JWT", () => {
    expect(() => decodeJwt("not.a.valid.jwt")).toThrow();
    expect(() => decodeJwt("onlyonepart")).toThrow("expected 3 parts");
  });
});
