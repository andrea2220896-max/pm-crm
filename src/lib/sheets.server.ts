// Server-only helpers to call the Google Sheets API through the Lovable connector gateway.
import { SPREADSHEET_ID } from "./constants";

const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

function authHeaders() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY no configurada");
  if (!sheetsKey) throw new Error("GOOGLE_SHEETS_API_KEY no configurada");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": sheetsKey,
    "Content-Type": "application/json",
  };
}

async function relayError(res: Response, action: string): Promise<never> {
  const body = await res.text();
  console.error(`[sheets] ${action} failed [${res.status}]:`, body);
  throw new Error(`Sheets ${action} failed [${res.status}]: ${body.slice(0, 500)}`);
}

// ---------- In-memory cache + inflight dedup + 429 backoff ----------
type CacheEntry = { at: number; data: string[][] };
const CACHE = new Map<string, CacheEntry>();
const INFLIGHT = new Map<string, Promise<string[][]>>();
const CACHE_TTL_MS = 30_000; // 30s — reads are cheap to be a bit stale
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchRangeWithRetry(range: string): Promise<string[][]> {
  const url = `${GATEWAY}/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
  let lastErr: Response | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, { headers: authHeaders() });
    if (res.ok) {
      const json = (await res.json()) as { values?: string[][] };
      return json.values ?? [];
    }
    lastErr = res;
    if (res.status !== 429 && res.status < 500) break;
    // exponential backoff: 400ms, 900ms, 1600ms
    const retryAfter = Number(res.headers.get("Retry-After")) * 1000;
    await sleep(retryAfter > 0 ? retryAfter : 400 + attempt * 500);
  }
  if (lastErr) await relayError(lastErr, `getValues(${range})`);
  throw new Error("unreachable");
}

export async function getValues(range: string): Promise<string[][]> {
  const now = Date.now();
  const cached = CACHE.get(range);
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.data;

  const existing = INFLIGHT.get(range);
  if (existing) return existing;

  const p = fetchRangeWithRetry(range)
    .then((data) => {
      CACHE.set(range, { at: Date.now(), data });
      return data;
    })
    .finally(() => INFLIGHT.delete(range));
  INFLIGHT.set(range, p);
  return p;
}

/** Invalidate cached ranges (call after writes). */
export function invalidateCache(prefix?: string) {
  if (!prefix) {
    CACHE.clear();
    return;
  }
  for (const k of CACHE.keys()) if (k.startsWith(prefix)) CACHE.delete(k);
}

export async function batchGetValues(ranges: string[]): Promise<string[][][]> {
  const q = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&");
  const url = `${GATEWAY}/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${q}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) await relayError(res, `batchGet`);
  const json = (await res.json()) as { valueRanges?: Array<{ values?: string[][] }> };
  return (json.valueRanges ?? []).map((v) => v.values ?? []);
}

/** Update one or many cells via values.batchUpdate (USER_ENTERED). */
export async function batchUpdateValues(
  updates: Array<{ range: string; values: (string | number)[][] }>,
): Promise<void> {
  if (updates.length === 0) return;
  const url = `${GATEWAY}/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ valueInputOption: "USER_ENTERED", data: updates }),
  });
  if (!res.ok) await relayError(res, "batchUpdate");
  // Bust cache so next read sees the update
  invalidateCache();
}
