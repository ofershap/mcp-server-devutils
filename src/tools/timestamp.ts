export function unixToIso(unix: number): string {
  const ms = unix > 1e12 ? unix : unix * 1000;
  return new Date(ms).toISOString();
}

export function isoToUnix(iso: string): {
  seconds: number;
  milliseconds: number;
} {
  const ms = new Date(iso).getTime();
  if (isNaN(ms)) {
    throw new Error(`Invalid date string: "${iso}"`);
  }
  return { seconds: Math.floor(ms / 1000), milliseconds: ms };
}

export function now(): {
  iso: string;
  unix: number;
  unixMs: number;
  utc: string;
} {
  const date = new Date();
  return {
    iso: date.toISOString(),
    unix: Math.floor(date.getTime() / 1000),
    unixMs: date.getTime(),
    utc: date.toUTCString(),
  };
}
