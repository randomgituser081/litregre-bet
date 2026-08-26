import { NextResponse } from "next/server";
import type { SlipLeg } from "@/lib/betting/markets";
import { createShareCode } from "@/lib/codes/share";
import { exportLegsToSportyBet } from "@/lib/codes/adapter";
import { getSession } from "@/lib/auth/session";
import { MAX_SLIP_LEGS } from "@/lib/constants";

export async function POST(req: Request) {
  let body: { legs?: SlipLeg[]; exportSportyBet?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const legs = (Array.isArray(body.legs) ? body.legs : []).slice(
    0,
    MAX_SLIP_LEGS
  );
  if (!legs.length) {
    return NextResponse.json({ error: "Slip is empty" }, { status: 400 });
  }

  const session = await getSession();

  try {
    const { code, expiresAt } = await createShareCode(legs, session?.sub);

    let sportyBet: { code: string | null; url: string | null } | null = null;
    if (body.exportSportyBet !== false) {
      try {
        const sb = await exportLegsToSportyBet(legs);
        if (sb.code) {
          sportyBet = { code: sb.code, url: sb.url };
        }
      } catch {
        /* optional */
      }
    }

    return NextResponse.json({
      code,
      expiresAt: expiresAt.toISOString(),
      sportyBet,
    });
  } catch (e) {
    console.error("[codes/generate]", e);
    return NextResponse.json({ error: "Could not generate code" }, { status: 500 });
  }
}
