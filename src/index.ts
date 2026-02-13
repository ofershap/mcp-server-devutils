import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { base64Encode, base64Decode } from "./tools/base64.js";
import { generateUuid, generateUlid } from "./tools/uuid.js";
import { hash, hashAll, supportedAlgorithms } from "./tools/hash.js";
import { decodeJwt } from "./tools/jwt.js";
import { explainCron, validateCron, nextCronRuns } from "./tools/cron.js";
import { unixToIso, isoToUnix, now } from "./tools/timestamp.js";
import { formatJson, minifyJson, validateJson } from "./tools/json-utils.js";
import { testRegex } from "./tools/regex.js";

const server = new McpServer({
  name: "mcp-server-devutils",
  version: "0.1.0",
});

server.tool(
  "base64_encode",
  "Encode a string to Base64",
  { input: z.string().describe("The string to encode") },
  async ({ input }) => ({
    content: [{ type: "text", text: base64Encode(input) }],
  }),
);

server.tool(
  "base64_decode",
  "Decode a Base64 string",
  { input: z.string().describe("The Base64 string to decode") },
  async ({ input }) => ({
    content: [{ type: "text", text: base64Decode(input) }],
  }),
);

server.tool(
  "uuid_generate",
  "Generate one or more UUIDs (v4)",
  {
    count: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(1)
      .describe("Number of UUIDs to generate"),
  },
  async ({ count }) => ({
    content: [{ type: "text", text: generateUuid(count).join("\n") }],
  }),
);

server.tool(
  "ulid_generate",
  "Generate a ULID (Universally Unique Lexicographically Sortable Identifier)",
  {},
  async () => ({
    content: [{ type: "text", text: generateUlid() }],
  }),
);

server.tool(
  "hash",
  `Hash a string using a specified algorithm. Supported: ${supportedAlgorithms.join(", ")}`,
  {
    input: z.string().describe("The string to hash"),
    algorithm: z
      .enum(supportedAlgorithms)
      .default("sha256")
      .describe("Hash algorithm"),
  },
  async ({ input, algorithm }) => ({
    content: [{ type: "text", text: hash(input, algorithm) }],
  }),
);

server.tool(
  "hash_all",
  "Hash a string with all supported algorithms at once",
  { input: z.string().describe("The string to hash") },
  async ({ input }) => ({
    content: [{ type: "text", text: JSON.stringify(hashAll(input), null, 2) }],
  }),
);

server.tool(
  "jwt_decode",
  "Decode a JWT token (without verification) and show header, payload, expiry",
  { token: z.string().describe("The JWT token to decode") },
  async ({ token }) => {
    try {
      const decoded = decodeJwt(token);
      return {
        content: [{ type: "text", text: JSON.stringify(decoded, null, 2) }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Failed to decode JWT"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "cron_explain",
  "Explain a cron expression in plain English",
  {
    expression: z
      .string()
      .describe('Cron expression (5 fields, e.g. "0 9 * * 1-5")'),
  },
  async ({ expression }) => {
    try {
      return {
        content: [{ type: "text", text: explainCron(expression) }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Invalid cron expression"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "cron_validate",
  "Validate a cron expression",
  {
    expression: z.string().describe("Cron expression to validate"),
  },
  async ({ expression }) => ({
    content: [{ type: "text", text: JSON.stringify(validateCron(expression)) }],
  }),
);

server.tool(
  "cron_next",
  "Show the next N run times for a cron expression",
  {
    expression: z.string().describe("Cron expression"),
    count: z
      .number()
      .int()
      .min(1)
      .max(20)
      .default(5)
      .describe("Number of next runs to show"),
  },
  async ({ expression, count }) => {
    try {
      const runs = nextCronRuns(expression, count);
      return {
        content: [{ type: "text", text: runs.join("\n") }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Invalid cron expression"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "timestamp_to_iso",
  "Convert a Unix timestamp to ISO 8601 date string",
  {
    timestamp: z.number().describe("Unix timestamp (seconds or milliseconds)"),
  },
  async ({ timestamp }) => ({
    content: [{ type: "text", text: unixToIso(timestamp) }],
  }),
);

server.tool(
  "iso_to_timestamp",
  "Convert an ISO 8601 date string to Unix timestamp",
  {
    date: z.string().describe("ISO 8601 date string"),
  },
  async ({ date }) => {
    try {
      const result = isoToUnix(date);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Invalid date"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "timestamp_now",
  "Get the current time in multiple formats",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(now(), null, 2) }],
  }),
);

server.tool(
  "json_format",
  "Pretty-print / format a JSON string",
  {
    input: z.string().describe("JSON string to format"),
    indent: z.number().int().min(1).max(8).default(2).describe("Indent size"),
  },
  async ({ input, indent }) => {
    try {
      return {
        content: [{ type: "text", text: formatJson(input, indent) }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Invalid JSON"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "json_minify",
  "Minify a JSON string (remove whitespace)",
  { input: z.string().describe("JSON string to minify") },
  async ({ input }) => {
    try {
      return {
        content: [{ type: "text", text: minifyJson(input) }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Invalid JSON"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "json_validate",
  "Validate a JSON string and report its type",
  { input: z.string().describe("JSON string to validate") },
  async ({ input }) => ({
    content: [
      { type: "text", text: JSON.stringify(validateJson(input), null, 2) },
    ],
  }),
);

server.tool(
  "regex_test",
  "Test a regular expression against a string",
  {
    pattern: z.string().describe("Regular expression pattern"),
    flags: z.string().default("g").describe('Regex flags (e.g. "gi", "gm")'),
    testString: z.string().describe("String to test against"),
  },
  async ({ pattern, flags, testString }) => {
    try {
      const result = testRegex(pattern, flags, testString);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${err instanceof Error ? err.message : "Invalid regex"}`,
          },
        ],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
