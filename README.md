# XyPriss Compressible Check — `xypriss-compressible`

> [!NOTE]
> **Internalized Fork**: This module is a strictly typed TypeScript port of the original `compressible` library. It has been internalized into the XyPriss ecosystem to reduce external dependency surfaces and ensure architectural consistency within XyPriss framework plugins.

---

## Overview

`xypriss-compressible` determines whether a given `Content-Type` or MIME type string is worth compressing before sending to the client. It combines an explicit database lookup ([`mime-db`](https://www.npmjs.com/package/mime-db)) with a convention-based fallback for types not covered by the database.

---

## Installation

```sh
xfpm install xypriss-compressible
```

---

## Usage

### Basic

```typescript
import compressible from "xypriss-compressible";

compressible("text/html");                 // → true
compressible("image/png");                 // → false
compressible("application/x-custom");      // → undefined
```

### With a full `Content-Type` header value

Parameters like `charset` are automatically stripped before the lookup.

```typescript
compressible("text/html; charset=utf-8");         // → true
compressible("application/json; charset=utf-8");  // → true
```

### In middleware

```typescript
import vary        from "xypriss-vary";
import compressible from "xypriss-compressible";

function compressionMiddleware(req, res, next) {
  const type = res.getHeader("Content-Type") as string;

  if (type && compressible(type) === true) {
    vary(res, "Accept-Encoding");
    // … apply compression stream …
  }

  next();
}
```

---

## API

### `compressible(type)`

| Parameter | Type     | Description                                          |
|-----------|----------|------------------------------------------------------|
| `type`    | `string` | A MIME type or full `Content-Type` header value.     |

**Returns** `boolean | undefined`:

| Return value | Meaning                                                                 |
|--------------|-------------------------------------------------------------------------|
| `true`       | The type is compressible.                                               |
| `false`      | The type is explicitly not compressible, or `type` is not a string.    |
| `undefined`  | Compressibility is unknown — treat as "maybe" in your middleware logic. |

The function **never throws**. Non-string inputs return `false`; malformed strings return `undefined`.

---

## Resolution Order

1. **`mime-db` lookup** — if the database entry carries an explicit `compressible` flag, that value is returned as-is.
2. **Convention-based fallback** — if the type is absent from the database (or has no `compressible` flag), the following patterns return `true`:
   - `text/*`
   - `*+json`
   - `*+text`
   - `*+xml`
3. **Unknown** — if neither rule matches, `undefined` is returned.

---

## Common Values

| MIME type                        | Result      |
|----------------------------------|-------------|
| `text/html`                      | `true`      |
| `text/plain`                     | `true`      |
| `application/json`               | `true`      |
| `application/vnd.api+json`       | `true`      |
| `application/xml`                | `true`      |
| `image/png`                      | `false`     |
| `image/jpeg`                     | `false`     |
| `application/octet-stream`       | `false`     |
| `video/mp4`                      | `false`     |
| `application/x-custom`           | `undefined` |

---

## Technical Implementation

- **Strict TypeScript port** — no runtime dependencies beyond `mime-db`; full compile-time safety.
- **Never throws** — non-string inputs return `false`; malformed strings return `undefined`. Safe to use as a filter predicate without `try/catch`.
- **Typed `mime-db` access** — the internal `MimeDbEntry` interface makes the database shape explicit and prevents silent property access on `unknown`.
- **Clear resolution order** — db lookup → regexp fallback → `undefined`; each step is isolated and commented.

---

## Changelog

### 2.0.0 — 2026 *(Nehonix fork)*
- Full rewrite in strict TypeScript
- Internal `MimeDbEntry` interface replaces untyped `Record<string, any>` cast
- Malformed type strings (no match from `EXTRACT_TYPE_REGEXP`) now return `undefined` instead of `undefined` silently via a falsy branch — behaviour is the same but the intent is explicit
- JSDoc added to all constants, the function, and the type

### 2.4.0 — 2023-02-23 *(upstream)*
- Use `mime-db` `~1.52.0`

### 2.3.0 — 2021-02-17 *(upstream)*
- Use `mime-db` `~1.46.0`

### 2.2.0 — 2020-04-09 *(upstream)*
- Use `mime-db` `~1.44.0`

### 2.1.0 — 2020-01-05 *(upstream)*
- Use `mime-db` `~1.43.0`

### 2.0.0 — 2019-04-26 *(upstream)*
- Drop support for Node.js below `0.6`
- Use `mime-db` `~1.40.0`

### 1.0.0 — 2014-08-08 *(upstream)*
- Initial release

---

## License

Copyright © 2013 Jonathan Ong  
Copyright © 2014 Jeremiah Senkpiel  
Copyright © 2015 Douglas Christopher Wilson  
Copyright © 2026 Nehonix Team  
Released under the [MIT License](./LICENSE).