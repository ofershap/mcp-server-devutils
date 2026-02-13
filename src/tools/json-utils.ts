export function formatJson(input: string, indent = 2): string {
  const parsed = JSON.parse(input) as unknown;
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input) as unknown;
  return JSON.stringify(parsed);
}

export function validateJson(input: string): {
  valid: boolean;
  error?: string;
  type?: string;
} {
  try {
    const parsed = JSON.parse(input) as unknown;
    return {
      valid: true,
      type: Array.isArray(parsed) ? "array" : typeof parsed,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Invalid JSON",
    };
  }
}
