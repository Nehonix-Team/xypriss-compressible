# History

## 2.0.0 / 2026

- Full rewrite in strict TypeScript (Nehonix fork)
- Internal `MimeDbEntry` interface replaces untyped `Record<string, any>` cast
- Malformed type strings (no match from `EXTRACT_TYPE_REGEXP`) now return `undefined` instead of `undefined` silently via a falsy branch — behaviour is the same but the intent is explicit
- JSDoc added to all constants, the function, and the type

## 2.4.0 / 2023-02-23

- Use `mime-db` `~1.52.0`

## 2.3.0 / 2021-02-17

- Use `mime-db` `~1.46.0`

## 2.2.0 / 2020-04-09

- Use `mime-db` `~1.44.0`

## 2.1.0 / 2020-01-05

- Use `mime-db` `~1.43.0`

## 2.0.0 / 2019-04-26

- Drop support for Node.js below `0.6`
- Use `mime-db` `~1.40.0`

## 1.0.0 / 2014-08-08

- Initial release
