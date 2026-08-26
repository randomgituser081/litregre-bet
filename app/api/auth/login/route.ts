import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/utils";
import { signSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(req: Request) {
  let body: { phone?: string; pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = normalizePhone(String(body.phone || ""));
  const pin = String(body.pin || "");

  const user = await prisma.user.findUnique({
    where: { phoneNumber: phone },
    include: { balance: true },
  });

  if (!user || !(await bcrypt.compare(pin, user.pinHash))) {
    return NextResponse.json({ error: "Invalid phone or PIN." }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const token = await signSession({
    sub: user.id,
    phone: user.phoneNumber,
    name: user.fullName,
  });

  const bal = user.balance;
  const totalKobo = bal
    ? bal.playingBalance + bal.winningBalance + bal.bonusBalance
    : BigInt(0);

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, phone: user.phoneNumber, name: user.fullName },
    balance: Number(totalKobo) / 100,
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
