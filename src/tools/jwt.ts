export interface JwtDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
  expiresAt: string | null;
  issuedAt: string | null;
}

export function decodeJwt(token: string): JwtDecoded {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT: expected 3 parts separated by dots");
  }

  const [headerB64, payloadB64, signature] = parts as [string, string, string];

  const header = JSON.parse(
    Buffer.from(headerB64, "base64url").toString("utf-8"),
  ) as Record<string, unknown>;
  const payload = JSON.parse(
    Buffer.from(payloadB64, "base64url").toString("utf-8"),
  ) as Record<string, unknown>;

  const exp = typeof payload.exp === "number" ? payload.exp : null;
  const iat = typeof payload.iat === "number" ? payload.iat : null;

  return {
    header,
    payload,
    signature,
    isExpired: exp !== null ? Date.now() / 1000 > exp : null,
    expiresAt: exp !== null ? new Date(exp * 1000).toISOString() : null,
    issuedAt: iat !== null ? new Date(iat * 1000).toISOString() : null,
  };
}
