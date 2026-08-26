export const SESSION_COOKIE = "lb_session";
export const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
export const APP_URL = process.env.APP_URL || "http://localhost:3000";

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234") && digits.length === 13) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `234${digits.slice(1)}`;
  if (digits.length === 10) return `234${digits}`;
  return digits;
}

export function formatPhoneDisplay(phone: string): string {
  if (phone.startsWith("234") && phone.length === 13) {
    return `0${phone.slice(3)}`;
  }
  return phone;
}

export function formatNaira(kobo: bigint | number): string {
  const n = typeof kobo === "bigint" ? Number(kobo) / 100 : kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(n);
}

export function parseStakeToKobo(input: string | number): bigint {
  const n = typeof input === "number" ? input : parseFloat(String(input).replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return BigInt(0);
  return BigInt(Math.round(n * 100));
}

export function combinedOdds(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((acc, o) => acc * o, 1);
}
