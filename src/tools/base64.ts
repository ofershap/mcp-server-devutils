export function base64Encode(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64");
}

export function base64Decode(input: string): string {
  return Buffer.from(input, "base64").toString("utf-8");
}
