const FIELD_NAMES = ["minute", "hour", "day of month", "month", "day of week"];

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function explainCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(
      "Invalid cron expression: expected 5 fields (minute hour day-of-month month day-of-week)",
    );
  }

  const [minute, hour, dom, month, dow] = parts as [
    string,
    string,
    string,
    string,
    string,
  ];

  const segments: string[] = [];

  segments.push(describeField(minute, "minute"));
  segments.push(describeField(hour, "hour"));
  segments.push(describeField(dom, "day of month"));
  segments.push(describeMonthField(month));
  segments.push(describeDowField(dow));

  return segments.filter(Boolean).join(", ");
}

function describeField(value: string, name: string): string {
  if (value === "*") return `every ${name}`;
  if (value.includes("/")) {
    const [, step] = value.split("/");
    return `every ${step} ${name}s`;
  }
  if (value.includes(",")) return `${name} ${value}`;
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    return `${name} ${start} through ${end}`;
  }
  return `at ${name} ${value}`;
}

function describeMonthField(value: string): string {
  if (value === "*") return "every month";
  const num = parseInt(value, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return `in ${MONTH_NAMES[num]}`;
  }
  return `month ${value}`;
}

function describeDowField(value: string): string {
  if (value === "*") return "every day of the week";
  if (value.includes("-")) {
    const rangeParts = value.split("-");
    const startStr = rangeParts[0] ?? "";
    const endStr = rangeParts[1] ?? "";
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    const startName =
      !isNaN(start) && start >= 0 && start <= 6 ? DAY_NAMES[start] : startStr;
    const endName =
      !isNaN(end) && end >= 0 && end <= 6 ? DAY_NAMES[end] : endStr;
    return `on ${startName} through ${endName}`;
  }
  if (value.includes(",")) {
    const days = value
      .split(",")
      .map((d) => {
        const n = parseInt(d, 10);
        return !isNaN(n) && n >= 0 && n <= 6 ? DAY_NAMES[n] : d;
      })
      .join(", ");
    return `on ${days}`;
  }
  const num = parseInt(value, 10);
  if (!isNaN(num) && num >= 0 && num <= 6) {
    return `on ${DAY_NAMES[num]}`;
  }
  return `day of week ${value}`;
}

export function validateCron(expression: string): {
  valid: boolean;
  error?: string;
} {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      error: `Expected 5 fields, got ${parts.length}`,
    };
  }

  const ranges = [
    [0, 59],
    [0, 23],
    [1, 31],
    [1, 12],
    [0, 7],
  ] as const;

  for (let i = 0; i < 5; i++) {
    const field = parts[i] ?? "";
    const range = ranges[i] ?? [0, 0];
    const [min, max] = range;
    const err = validateField(field, min, max, FIELD_NAMES[i] ?? "");
    if (err) return { valid: false, error: err };
  }

  return { valid: true };
}

function validateField(
  field: string,
  min: number,
  max: number,
  name: string,
): string | null {
  if (field === "*") return null;

  const segments = field.split(",");
  for (const segment of segments) {
    const stepParts = segment.split("/");
    const rangePart = stepParts[0] ?? "";

    if (rangePart !== "*") {
      const rangePieces = rangePart.split("-");
      for (const piece of rangePieces) {
        const num = parseInt(piece, 10);
        if (isNaN(num) || num < min || num > max) {
          return `Invalid ${name}: "${piece}" is not between ${min} and ${max}`;
        }
      }
    }

    if (stepParts[1]) {
      const step = parseInt(stepParts[1], 10);
      if (isNaN(step) || step < 1) {
        return `Invalid step in ${name}: "${stepParts[1]}"`;
      }
    }
  }

  return null;
}

export function nextCronRuns(expression: string, count = 5): string[] {
  const validation = validateCron(expression);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const parts = expression.trim().split(/\s+/);
  const runs: string[] = [];
  const now = new Date();
  const current = new Date(now);
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  const maxIterations = 525960;
  let iterations = 0;

  while (runs.length < count && iterations < maxIterations) {
    iterations++;
    if (
      matchesCron(current, parts as [string, string, string, string, string])
    ) {
      runs.push(current.toISOString());
    }
    current.setMinutes(current.getMinutes() + 1);
  }

  return runs;
}

function matchesCron(
  date: Date,
  [minute, hour, dom, month, dow]: [string, string, string, string, string],
): boolean {
  return (
    matchesField(date.getMinutes(), minute) &&
    matchesField(date.getHours(), hour) &&
    matchesField(date.getDate(), dom) &&
    matchesField(date.getMonth() + 1, month) &&
    matchesField(date.getDay(), dow)
  );
}

function matchesField(value: number, field: string): boolean {
  if (field === "*") return true;

  return field.split(",").some((segment) => {
    const [rangePart, stepStr] = segment.split("/");
    const step = stepStr ? parseInt(stepStr, 10) : 1;

    if (rangePart === "*") {
      return value % step === 0;
    }

    const rp = rangePart ?? "";
    if (rp.includes("-")) {
      const rangePieces = rp.split("-");
      const start = parseInt(rangePieces[0] ?? "", 10);
      const end = parseInt(rangePieces[1] ?? "", 10);
      if (value < start || value > end) return false;
      return (value - start) % step === 0;
    }

    const num = parseInt(rp, 10);
    return value === num;
  });
}
