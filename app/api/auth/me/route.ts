import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { balance: true },
  });

  if (!user) {
    return NextResponse.json({ user: null });
  }

  const bal = user.balance;
  const totalKobo = bal
    ? bal.playingBalance + bal.winningBalance + bal.bonusBalance
    : BigInt(0);

  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phoneNumber,
      name: user.fullName,
    },
    balance: Number(totalKobo) / 100,
  });
}
