import {
  PrismaClient,
  EventStatus,
  MarketType,
} from "@prisma/client";

const prisma = new PrismaClient();

const TEAMS = [
  ["Arsenal", "Chelsea"],
  ["Liverpool", "Man City"],
  ["Barcelona", "Real Madrid"],
  ["Bayern Munich", "Dortmund"],
  ["Inter Milan", "AC Milan"],
  ["PSG", "Marseille"],
  ["Sporting CP", "Benfica"],
  ["Ajax", "PSV"],
  ["River Plate", "Boca Juniors"],
  ["Flamengo", "Palmeiras"],
  ["Enyimba", "Rangers Int'l"],
  ["Kano Pillars", "Shooting Stars"],
  ["Lobi Stars", "Plateau United"],
  ["Sunshine Stars", "Remo Stars"],
  ["Kwara United", "Niger Tornadoes"],
];

function odds(base: number, spread = 0.4) {
  return {
    home: +(base + Math.random() * spread).toFixed(2),
    draw: +(2.8 + Math.random() * 1.2).toFixed(2),
    away: +(4 + Math.random() * 3).toFixed(2),
  };
}

async function seedMarkets(eventId: string, o: ReturnType<typeof odds>) {
  const m1 = await prisma.market.create({
    data: { eventId, type: MarketType.one_x_two, specifier: "" },
  });
  await prisma.outcome.createMany({
    data: [
      { marketId: m1.id, key: "home", label: "Home", odds: o.home },
      { marketId: m1.id, key: "draw", label: "Draw", odds: o.draw },
      { marketId: m1.id, key: "away", label: "Away", odds: o.away },
    ],
  });

  const m25 = await prisma.market.create({
    data: { eventId, type: MarketType.over_under_25, specifier: "total=2.5" },
  });
  await prisma.outcome.createMany({
    data: [
      { marketId: m25.id, key: "over", label: "Over 2.5", odds: 1.85 },
      { marketId: m25.id, key: "under", label: "Under 2.5", odds: 1.95 },
    ],
  });

  const mb = await prisma.market.create({
    data: { eventId, type: MarketType.btts, specifier: "" },
  });
  await prisma.outcome.createMany({
    data: [
      { marketId: mb.id, key: "yes", label: "BTTS Yes", odds: 1.72 },
      { marketId: mb.id, key: "no", label: "BTTS No", odds: 2.05 },
    ],
  });
}

async function main() {
  await prisma.betSelection.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.market.deleteMany();
  await prisma.event.deleteMany();
  await prisma.league.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.shareCode.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.userBalance.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const football = await prisma.sport.create({
    data: { name: "Football", slug: "football", icon: "football", sortOrder: 1 },
  });
  const basketball = await prisma.sport.create({
    data: {
      name: "Basketball",
      slug: "basketball",
      icon: "basketball",
      sortOrder: 2,
    },
  });
  const tennis = await prisma.sport.create({
    data: { name: "Tennis", slug: "tennis", icon: "tennis", sortOrder: 3 },
  });

  const leagues = await Promise.all([
    prisma.league.create({
      data: {
        sportId: football.id,
        name: "England Premier League",
        slug: "epl",
        country: "England",
        isPopular: true,
        sortOrder: 1,
      },
    }),
    prisma.league.create({
      data: {
        sportId: football.id,
        name: "UEFA Champions League",
        slug: "ucl",
        country: "Europe",
        isPopular: true,
        sortOrder: 2,
      },
    }),
    prisma.league.create({
      data: {
        sportId: football.id,
        name: "Spain La Liga",
        slug: "laliga",
        country: "Spain",
        isPopular: true,
        sortOrder: 3,
      },
    }),
    prisma.league.create({
      data: {
        sportId: football.id,
        name: "Nigeria NPFL",
        slug: "npfl",
        country: "Nigeria",
        isPopular: true,
        sortOrder: 4,
      },
    }),
    prisma.league.create({
      data: {
        sportId: basketball.id,
        name: "NBA",
        slug: "nba",
        country: "USA",
        isPopular: true,
        sortOrder: 1,
      },
    }),
    prisma.league.create({
      data: {
        sportId: tennis.id,
        name: "ATP Tour",
        slug: "atp",
        country: "International",
        isPopular: false,
        sortOrder: 1,
      },
    }),
  ]);

  const now = Date.now();
  let teamIdx = 0;
  for (const league of leagues.slice(0, 4)) {
    for (let i = 0; i < 8; i++) {
      const [home, away] = TEAMS[teamIdx % TEAMS.length];
      teamIdx++;
      const hoursAhead = i < 2 ? -1 : i * 3 + 1;
      const isLive = i === 0 && league.slug === "epl";
      const kickoff = new Date(now + hoursAhead * 60 * 60 * 1000);
      const o = odds(1.4 + (i % 5) * 0.15);

      const event = await prisma.event.create({
        data: {
          leagueId: league.id,
          homeTeam: home,
          awayTeam: away,
          kickoff,
          status: isLive ? EventStatus.live : EventStatus.upcoming,
          homeScore: isLive ? 1 : 0,
          awayScore: isLive ? 0 : 0,
          liveMinute: isLive ? "67:12 H2" : "",
          isFeatured: i === 0 && league.slug === "ucl",
          isHot: i === 0,
        },
      });
      await seedMarkets(event.id, o);
    }
  }

  console.log("Seed complete:", {
    sports: 3,
    leagues: leagues.length,
    events: teamIdx,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
