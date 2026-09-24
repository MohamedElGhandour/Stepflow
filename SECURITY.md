# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 2.x | yes |
| 1.x | no — see [MIGRATION.md](./MIGRATION.md) |

## Reporting a vulnerability

Report privately through
[GitHub Security Advisories](https://github.com/MohamedElGhandour/Stepflow/security/advisories/new).
Please do not open a public issue for a vulnerability.

Include what you can: affected version, a reproduction, and the impact you see.
Expect an acknowledgement within a week.

## Scope notes

Step `title` and `content` are React nodes, so Stepflow never sets
`innerHTML` and never parses HTML strings. If you render untrusted HTML inside
step content yourself — via `dangerouslySetInnerHTML` or a markdown renderer —
sanitising it is your responsibility.
