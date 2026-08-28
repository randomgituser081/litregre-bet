const BASE_URL =
  process.env.PREDICTION_API_BASE_URL ?? "https://mtn.lenhub.net";

let cachedToken: string | null = null;
let tokenExpiry = 0;

type JsonRecord = Record<string, unknown>;

export function extractList(data: JsonRecord): JsonRecord[] {
  const raw =
    data.items ?? data.results ?? data.result ?? data.data ?? data.predictions;
  return Array.isArray(raw) ? (raw as JsonRecord[]) : [];
}

export async function getPredictionToken(): Promise<string | null> {
  if (process.env.PREDICTION_API_TOKEN) {
    return process.env.PREDICTION_API_TOKEN;
  }

  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const phone = process.env.PREDICTION_API_PHONE;
  const pin = process.env.PREDICTION_API_PIN;
  if (!phone || !pin) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/prediction/login/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: phone, pin }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as JsonRecord;
    const token =
      (data.token as string) ||
      (data.access as string) ||
      (data.access_token as string) ||
      null;
    if (token) {
      cachedToken = token;
      tokenExpiry = now + 50 * 60 * 1000;
    }
    return token;
  } catch {
    return null;
  }
}

export async function fetchPredictionJson(
  path: string,
  opts?: { auth?: boolean; revalidate?: number }
): Promise<JsonRecord | null> {
  const headers: HeadersInit = {};
  if (opts?.auth) {
    const token = await getPredictionToken();
    if (!token) return null;
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      ...(opts?.revalidate != null
        ? { next: { revalidate: opts.revalidate } }
        : { cache: "no-store" }),
    });
    if (!res.ok) return null;
    return (await res.json()) as JsonRecord;
  } catch {
    return null;
  }
}
