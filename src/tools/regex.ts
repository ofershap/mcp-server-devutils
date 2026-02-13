export interface RegexTestResult {
  matches: boolean;
  matchCount: number;
  groups: RegexMatch[];
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: Record<string, string> | null;
}

export function testRegex(
  pattern: string,
  flags: string,
  testString: string,
): RegexTestResult {
  const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  const results: RegexMatch[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(testString)) !== null) {
    results.push({
      match: match[0],
      index: match.index,
      groups: match.groups ? { ...match.groups } : null,
    });
    if (!flags.includes("g")) break;
  }

  return {
    matches: results.length > 0,
    matchCount: results.length,
    groups: results,
  };
}
