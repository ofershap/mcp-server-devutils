import { createHash } from "node:crypto";

const SUPPORTED_ALGORITHMS = [
  "md5",
  "sha1",
  "sha256",
  "sha384",
  "sha512",
] as const;

export type HashAlgorithm = (typeof SUPPORTED_ALGORITHMS)[number];

export function hash(
  input: string,
  algorithm: HashAlgorithm = "sha256",
): string {
  return createHash(algorithm).update(input, "utf-8").digest("hex");
}

export function hashAll(input: string): Record<HashAlgorithm, string> {
  const result = {} as Record<HashAlgorithm, string>;
  for (const algo of SUPPORTED_ALGORITHMS) {
    result[algo] = hash(input, algo);
  }
  return result;
}

export const supportedAlgorithms = SUPPORTED_ALGORITHMS;
