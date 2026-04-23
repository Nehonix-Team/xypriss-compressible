"use strict";
/*!
 * xypriss-compressible
 * Copyright(c) 2013 Jonathan Ong
 * Copyright(c) 2014 Jeremiah Senkpiel
 * Copyright(c) 2015 Douglas Christopher Wilson
 * Copyright(c) 2026 Nehonix Team
 * MIT Licensed
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressible = compressible;
const mime_db_1 = __importDefault(require("mime-db"));
// ─── Constants ────────────────────────────────────────────────────────────────
/**
 * Matches MIME types that are considered compressible by convention when they
 * are absent from `mime-db`, as a safe fallback:
 *
 * - `text/*`          — all plain-text types
 * - `*+json`          — JSON-based structured formats
 * - `*+text`          — text-based structured formats
 * - `*+xml`           — XML-based structured formats
 *
 * @internal
 */
const COMPRESSIBLE_TYPE_REGEXP = /^text\/|\+(?:json|text|xml)$/i;
/**
 * Extracts the bare MIME type from a full `Content-Type` string, stripping
 * any parameters (e.g. `charset=utf-8`) and surrounding whitespace.
 *
 * @example
 * ```
 * "text/html; charset=utf-8"  →  match[1] === "text/html"
 * "  application/json "       →  match[1] === "application/json"
 * ```
 *
 * @internal
 */
const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
// ─── Public API ───────────────────────────────────────────────────────────────
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
function compressible(type) {
    // Non-string input: return false rather than throwing so the function can be
    // used safely as a filter predicate without a try/catch.
    if (typeof type !== "string") {
        return false;
    }
    // Extract the bare MIME type, discarding parameters and whitespace.
    const match = EXTRACT_TYPE_REGEXP.exec(type);
    if (!match || !match[1]) {
        // Malformed type — cannot determine compressibility.
        return undefined;
    }
    const mime = match[1].toLowerCase();
    // ── 1. mime-db lookup ────────────────────────────────────────────────────
    const entry = mime_db_1.default[mime];
    if (entry !== undefined && entry.compressible !== undefined) {
        return entry.compressible;
    }
    // ── 2. Convention-based fallback ─────────────────────────────────────────
    if (COMPRESSIBLE_TYPE_REGEXP.test(mime)) {
        return true;
    }
    // ── 3. Unknown ───────────────────────────────────────────────────────────
    return undefined;
}
exports.default = compressible;
