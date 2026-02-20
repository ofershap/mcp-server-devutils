# MCP Server DevUtils — 17 Developer Tools for AI Assistants

[![npm version](https://img.shields.io/npm/v/mcp-server-devutils.svg)](https://www.npmjs.com/package/mcp-server-devutils)
[![npm downloads](https://img.shields.io/npm/dm/mcp-server-devutils.svg)](https://www.npmjs.com/package/mcp-server-devutils)
[![CI](https://github.com/ofershap/mcp-server-devutils/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-devutils/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An MCP server that gives your AI assistant 17 developer utilities — base64, UUID, JWT decode, cron, timestamps, JSON, regex. No API keys, no external services, just `npx`.

```
You: "Decode this JWT: eyJhbGci..."
AI:  Header: { alg: "RS256" }  Payload: { sub: "1234", exp: 1700000000 }  Expired: yes
```

> Works with Claude Desktop, Cursor, and VS Code Copilot. Zero auth required.

![MCP server devutils demo — JWT decode, UUID generation, and cron explanation in Claude Desktop](assets/demo.gif)

## Tools

| Tool               | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `base64_encode`    | Encode a string to Base64                         |
| `base64_decode`    | Decode a Base64 string                            |
| `uuid_generate`    | Generate one or more UUIDs (v4)                   |
| `ulid_generate`    | Generate a ULID                                   |
| `hash`             | Hash a string (md5, sha1, sha256, sha384, sha512) |
| `hash_all`         | Hash with all algorithms at once                  |
| `jwt_decode`       | Decode a JWT token (header, payload, expiry)      |
| `cron_explain`     | Explain a cron expression in plain English        |
| `cron_validate`    | Validate a cron expression                        |
| `cron_next`        | Show next N run times for a cron expression       |
| `timestamp_to_iso` | Convert Unix timestamp to ISO 8601                |
| `iso_to_timestamp` | Convert ISO 8601 to Unix timestamp                |
| `timestamp_now`    | Get current time in multiple formats              |
| `json_format`      | Pretty-print a JSON string                        |
| `json_minify`      | Minify a JSON string                              |
| `json_validate`    | Validate JSON and report its type                 |
| `regex_test`       | Test a regex pattern against a string             |

## Quick Start

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-server-devutils"]
    }
  }
}
```

### With Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-server-devutils"]
    }
  }
}
```

### With VS Code (Copilot)

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "mcp-server-devutils"]
    }
  }
}
```

## Examples

Ask your AI assistant:

- "Decode this JWT token: eyJhbG..."
- "What does the cron expression `0 9 * * 1-5` mean?"
- "Generate 5 UUIDs"
- "Hash this string with SHA-256: hello world"
- "Convert Unix timestamp 1700000000 to a date"
- "Format this JSON: {"a":1,"b":2}"
- "Test the regex `\d{3}-\d{4}` against '555-1234'"

## Development

```bash
npm install
npm test
npm run build
```

## Author

[![Made by ofershap](https://gitshow.dev/api/card/ofershap)](https://gitshow.dev/ofershap)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/ofershap)

## License

[MIT](LICENSE) &copy; [Ofer Shapira](https://github.com/ofershap)
