import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bal = await prisma.userBalance.findUnique({
    where: { userId: session.sub },
  });

  const playing = Number(bal?.playingBalance ?? 0);
  const winning = Number(bal?.winningBalance ?? 0);
  const bonus = Number(bal?.bonusBalance ?? 0);

  return NextResponse.json({
    playing_balance: playing / 100,
    winning_balance: winning / 100,
    bonus_balance: bonus / 100,
    total_balance: (playing + winning + bonus) / 100,
    currency: "NGN",
  });
}
