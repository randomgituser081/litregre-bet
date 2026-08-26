import { NextResponse } from "next/server";
import { fetchSportsWithLeagues } from "@/lib/betting/queries";

export async function GET() {
  try {
    const sports = await fetchSportsWithLeagues();
    return NextResponse.json({
      sports: sports.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        icon: s.icon,
        leagues: s.leagues.map((l) => ({
          id: l.id,
          name: l.name,
          slug: l.slug,
          country: l.country,
          isPopular: l.isPopular,
        })),
      })),
    });
  } catch (e) {
    console.error("[sports]", e);
    return NextResponse.json({ sports: [] }, { status: 503 });
  }
}
