/** Strip to digits for phone / PIN fields. */
export function digitsOnly(value: string, max?: number) {
  const d = value.replace(/\D/g, "");
  return max != null ? d.slice(0, max) : d;
}

export function validatePhone(raw: string): string | null {
  const d = digitsOnly(raw);
  if (d.length < 10) return "Enter a valid Nigerian phone number";
  if (d.length > 13) return "Phone number is too long";
  return null;
}

export function validatePin(pin: string): string | null {
  if (!/^\d{4,6}$/.test(pin)) return "PIN must be 4–6 digits";
  return null;
}

export function formatPhoneDisplay(raw: string) {
  const d = digitsOnly(raw);
  if (d.startsWith("234") && d.length >= 13) {
    return `0${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  }
  if (d.length === 11 && d.startsWith("0")) {
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  return raw;
}
