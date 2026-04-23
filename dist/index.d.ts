/*!
 * xypriss-compressible
 * Copyright(c) 2013 Jonathan Ong
 * Copyright(c) 2014 Jeremiah Senkpiel
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2026 Nehonix Team
 * MIT Licensed
 */
/**
 * Determine whether a given `Content-Type` or MIME type string is compressible.
 *
 * **Resolution order:**
 * 1. The type is looked up in [`mime-db`](https://www.npmjs.com/package/mime-db).
 *    If the database entry carries an explicit `compressible` flag, that value
 *    is returned as-is (`true` or `false`).
 * 2. If the type is absent from the database (or carries no `compressible`
 *    flag), a regexp-based fallback returns `true` for:
 *    - `text/*`
 *    - `*+json`, `*+text`, `*+xml`
 * 3. If neither rule matches, `undefined` is returned to signal that
 *    compressibility is unknown — callers should treat this as "maybe".
 *
 * @example
 * ```ts
 * import compressible from "xypriss-compressible";
 *
 * compressible("text/html");                    // → true
 * compressible("text/html; charset=utf-8");     // → true
 * compressible("application/json");             // → true
 * compressible("application/vnd.api+json");     // → true
 * compressible("image/png");                    // → false
 * compressible("application/octet-stream");     // → false
 * compressible("application/x-custom");         // → undefined
 * ```
 *
 * @param type - A MIME type string or full `Content-Type` header value.
 *               Parameters such as `charset` are ignored.
 * @returns
 *   - `true`      — the type is compressible.
 *   - `false`     — the type is explicitly not compressible, or `type` is not
 *                   a string.
 *   - `undefined` — compressibility is indeterminate.
 *
 * @public
 */
export declare function compressible(type: string): boolean | undefined;
export default compressible;
