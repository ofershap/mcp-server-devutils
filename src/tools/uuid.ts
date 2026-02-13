import { randomUUID } from "node:crypto";

export function generateUuid(count = 1): string[] {
  return Array.from({ length: Math.min(count, 100) }, () => randomUUID());
}

export function generateUlid(): string {
  const timestamp = Date.now();
  const timeChars = encodeTime(timestamp, 10);
  const randomChars = encodeRandom(16);
  return timeChars + randomChars;
}

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(time: number, length: number): string {
  let result = "";
  let t = time;
  for (let i = length - 1; i >= 0; i--) {
    const mod = t % 32;
    result = (CROCKFORD[mod] ?? "0") + result;
    t = Math.floor(t / 32);
  }
  return result;
}

function encodeRandom(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = "";
  for (const byte of bytes) {
    result += CROCKFORD[byte % 32] ?? "0";
  }
  return result.slice(0, length);
}
