import {
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

/** Sports/leagues only — fixtures come from prediction API sync. */
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
  await prisma.sport.create({
    data: {
      name: "Basketball",
      slug: "basketball",
      icon: "basketball",
      sortOrder: 2,
    },
  });

  await prisma.league.createMany({
    data: [
      {
        sportId: football.id,
        name: "Football",
        slug: "football",
        country: "International",
        isPopular: true,
        sortOrder: 1,
      },
    ],
  });

  console.log("Seed complete: sports + leagues only (run npm run sync:events for fixtures)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
