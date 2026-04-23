import db from "mime-db";

/**
 * XyPriss Compressible Check (Hardened)
 *
 * Ported from jshttp/compressible for the XyPriss Framework.
 * Ensures zero third-party external dependencies for core middleware logic.
 */

const COMPRESSIBLE_TYPE_REGEXP = /^text\/|\+(?:json|text|xml)$/i;
const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;

/**
 * Checks if a type is compressible.
 *
 * @param {string} type - The Content-Type header value
 * @return {boolean | undefined} Returns `true` if compressible, `false` if not, or `undefined` if indeterminate.
 */
export function compressible(type: string): boolean | undefined {
  if (typeof type !== "string") return false;

  const match = EXTRACT_TYPE_REGEXP.exec(type);
  if (!match) return undefined;

  const mime = match[1].toLowerCase();
  const data = (db as Record<string, { compressible?: boolean }>)[mime];

  return typeof data !== "undefined" && typeof data.compressible !== "undefined"
    ? data.compressible
    : COMPRESSIBLE_TYPE_REGEXP.test(mime) || undefined;
}

export default compressible;
