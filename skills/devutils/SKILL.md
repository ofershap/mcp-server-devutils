---
name: devutils
description: 17 developer utilities via MCP — base64, UUID, hash, JWT decode, cron, timestamps, JSON, regex. Use for common dev utility tasks.
---

# Developer Utilities via MCP

Use this skill for everyday developer utility tasks: encoding, hashing, JWT decoding, cron expressions, timestamps, JSON formatting, and regex testing. Zero auth required.

## Available Tools

| Category          | Tools                                                   |
| ----------------- | ------------------------------------------------------- |
| **Encoding**      | `base64_encode`, `base64_decode`                        |
| **ID Generation** | `uuid_generate`, `ulid_generate`                        |
| **Hashing**       | `hash` (single algo), `hash_all` (all algos)            |
| **JWT**           | `jwt_decode` (header, payload, expiry check)            |
| **Cron**          | `cron_explain`, `cron_validate`, `cron_next`            |
| **Timestamps**    | `timestamp_to_iso`, `iso_to_timestamp`, `timestamp_now` |
| **JSON**          | `json_format`, `json_minify`, `json_validate`           |
| **Regex**         | `regex_test`                                            |

## Key Patterns

- `jwt_decode` shows header, payload, and checks if expired — does NOT verify signatures
- `hash` defaults to SHA-256; `hash_all` runs md5, sha1, sha256, sha384, sha512 at once
- `cron_next` shows the next N scheduled run times — useful for validating cron schedules
- `uuid_generate` can create multiple UUIDs in one call (pass `count` parameter)
- `json_validate` reports whether input is valid JSON and its root type (object, array, etc.)
