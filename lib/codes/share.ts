import { randomBytes } from "crypto";
import type { SlipLeg } from "@/lib/betting/markets";
import { prisma } from "@/lib/db";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateShareCodeString(length = 6): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  }
  return out;
}

export async function createShareCode(
  legs: SlipLeg[],
  userId?: string
): Promise<{ code: string; expiresAt: Date }> {
  let code = generateShareCodeString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await prisma.shareCode.create({
        data: {
          code,
          legs: legs as unknown as object,
          createdBy: userId || null,
          expiresAt,
        },
      });
      return { code, expiresAt };
    } catch {
      code = generateShareCodeString();
    }
  }
  throw new Error("Could not generate unique share code");
}

export async function loadShareCode(code: string): Promise<SlipLeg[] | null> {
  const row = await prisma.shareCode.findUnique({
    where: { code: code.toUpperCase().trim() },
  });
  if (!row) return null;
  if (row.expiresAt < new Date()) return null;
  return row.legs as unknown as SlipLeg[];
}
