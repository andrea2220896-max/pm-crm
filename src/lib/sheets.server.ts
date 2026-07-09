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

export async function getValues(range: string): Promise<string[][]> {
  const url = `${GATEWAY}/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) await relayError(res, `getValues(${range})`);
  const json = (await res.json()) as { values?: string[][] };
  return json.values ?? [];
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
}
