import { MarketType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { SlipLeg } from "@/lib/betting/markets";
import { MAX_SLIP_LEGS } from "@/lib/constants";
import { combinedOdds, parseStakeToKobo } from "@/lib/utils";

const MIN_STAKE_KOBO = BigInt(10000); // ₦100

export class PlaceBetError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function deductStake(
  playing: bigint,
  winning: bigint,
  bonus: bigint,
  stake: bigint
) {
  let remaining = stake;
  let p = playing;
  let w = winning;
  let b = bonus;

  if (p >= remaining) {
    p -= remaining;
    remaining = BigInt(0);
  } else {
    remaining -= p;
    p = BigInt(0);
    if (b >= remaining) {
      b -= remaining;
      remaining = BigInt(0);
    } else {
      remaining -= b;
      b = BigInt(0);
      if (w < remaining) {
        throw new PlaceBetError("Insufficient balance", 402);
      }
      w -= remaining;
    }
  }

  return { playingBalance: p, winningBalance: w, bonusBalance: b };
}

export async function placeBet(
  userId: string,
  legs: SlipLeg[],
  stakeInput: string | number
) {
  const stakeKobo = parseStakeToKobo(stakeInput);
  if (stakeKobo < MIN_STAKE_KOBO) {
    throw new PlaceBetError("Minimum stake is ₦100", 400);
  }
  if (!legs.length) {
    throw new PlaceBetError("Slip is empty", 400);
  }
  if (legs.length > MAX_SLIP_LEGS) {
    throw new PlaceBetError(`Maximum ${MAX_SLIP_LEGS} selections`, 400);
  }

  return prisma.$transaction(async (tx) => {
    const validated: SlipLeg[] = [];

    for (const leg of legs) {
      const event = await tx.event.findUnique({ where: { id: leg.eventId } });
      if (!event) {
        throw new PlaceBetError(
          `Match not found: ${leg.homeTeam} vs ${leg.awayTeam}`,
          400
        );
      }
      if (event.status === "finished" || event.status === "cancelled") {
        throw new PlaceBetError(
          `${leg.homeTeam} vs ${leg.awayTeam} is no longer open`,
          400
        );
      }

      const outcome = await tx.outcome.findFirst({
        where: {
          market: { eventId: leg.eventId, type: leg.marketType as MarketType },
          key: leg.outcomeKey,
          isActive: true,
        },
      });
      if (!outcome) {
        throw new PlaceBetError(
          `Selection unavailable: ${leg.outcomeLabel}`,
          400
        );
      }

      validated.push({
        ...leg,
        odds: Number(outcome.odds),
        outcomeLabel:
          leg.outcomeLabel ||
          outcome.label ||
          `${leg.homeTeam} vs ${leg.awayTeam}`,
      });
    }

    const totalOdds = combinedOdds(validated.map((l) => l.odds));
    const potential = BigInt(Math.round(Number(stakeKobo) * totalOdds));

    const balance = await tx.userBalance.findUnique({ where: { userId } });
    if (!balance) {
      throw new PlaceBetError("Wallet not found", 400);
    }

    const total =
      balance.playingBalance + balance.winningBalance + balance.bonusBalance;
    if (total < stakeKobo) {
      throw new PlaceBetError("Insufficient balance — top up or lower stake", 402);
    }

    const next = deductStake(
      balance.playingBalance,
      balance.winningBalance,
      balance.bonusBalance,
      stakeKobo
    );

    await tx.userBalance.update({
      where: { userId },
      data: next,
    });

    const bet = await tx.bet.create({
      data: {
        userId,
        stake: stakeKobo,
        totalOdds: new Prisma.Decimal(totalOdds.toFixed(4)),
        potential,
        status: "pending",
        selections: {
          create: validated.map((leg) => ({
            eventId: leg.eventId,
            marketType: leg.marketType,
            outcomeKey: leg.outcomeKey,
            outcomeLabel: leg.outcomeLabel,
            oddsAtPlace: leg.odds,
          })),
        },
      },
      include: {
        selections: {
          include: {
            event: {
              include: { league: true },
            },
          },
        },
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: "bet",
        status: "completed",
        amount: stakeKobo,
        reference: bet.id.slice(0, 36),
      },
    });

    return bet;
  });
}

export function serializeBet(
  bet: Prisma.BetGetPayload<{
    include: {
      selections: {
        include: {
          event: { include: { league: true } };
        };
      };
    };
  }>
) {
  return {
    id: bet.id,
    stake: Number(bet.stake),
    totalOdds: Number(bet.totalOdds),
    potential: Number(bet.potential),
    status: bet.status,
    createdAt: bet.createdAt.toISOString(),
    selections: bet.selections.map((s) => ({
      id: s.id,
      homeTeam: s.event.homeTeam,
      awayTeam: s.event.awayTeam,
      leagueName: s.event.league.name,
      kickoff: s.event.kickoff.toISOString(),
      marketType: s.marketType,
      outcomeKey: s.outcomeKey,
      outcomeLabel: s.outcomeLabel,
      odds: Number(s.oddsAtPlace),
    })),
  };
}
