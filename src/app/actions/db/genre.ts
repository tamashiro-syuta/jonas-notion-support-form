"use server";

import { prisma } from "@/lib/db/client";
import { Genre } from "@prisma/client";
import { correctNotionDBGuard, loginUserGuard } from "./guard";

interface BaseProps {
  userID: string;
}

interface FetchProps extends BaseProps {
  notionDBId: number;
}

interface SpendingFetchProps extends BaseProps {
  notionDBId: number;
}

interface BalancedFetchProps extends BaseProps {
  notionDBId: number;
}

interface BudgetFetchProps extends BaseProps {
  notionDBId: number;
}

interface BulkUpdateProps extends BaseProps {
  genres: Genre[];
}

export async function fetchGenres({
  userID,
  notionDBId,
}: FetchProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);
    await correctNotionDBGuard(userID, notionDBId);

    return await prisma.genre.findMany({
      where: {
        notionDBId,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function fetchSpendingGenres({
  userID,
  notionDBId,
}: SpendingFetchProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);
    await correctNotionDBGuard(userID, notionDBId);

    return await prisma.genre.findMany({
      where: {
        notionDBId,
        isSpending: true,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function fetchBalancedGenres({
  userID,
  notionDBId,
}: BalancedFetchProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);
    await correctNotionDBGuard(userID, notionDBId);

    return await prisma.genre.findMany({
      where: {
        notionDBId,
        isBalance: true,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function fetchBudgetGenres({
  userID,
  notionDBId,
}: BudgetFetchProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);
    await correctNotionDBGuard(userID, notionDBId);

    return await prisma.genre.findMany({
      where: {
        notionDBId,
        isBudget: true,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function bulkUpdateIsBalance({
  userID,
  genres,
}: BulkUpdateProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);

    const dataList = genres.map((genre) => ({
      where: { id: genre.id },
      data: { isBalance: genre.isBalance },
    }));

    return await prisma.$transaction(
      dataList.map((data) => prisma.genre.update(data))
    );
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function bulkUpdateIsSpending({
  userID,
  genres,
}: BulkUpdateProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);

    const dataList = genres.map((genre) => ({
      where: { id: genre.id },
      data: { isSpending: genre.isSpending },
    }));

    return await prisma.$transaction(
      dataList.map((data) => prisma.genre.update(data))
    );
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function bulkUpdateIsBudget({
  userID,
  genres,
}: BulkUpdateProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);

    const dataList = genres.map((genre) => ({
      where: { id: genre.id },
      data: { isBudget: genre.isBudget },
    }));

    return await prisma.$transaction(
      dataList.map((data) => prisma.genre.update(data))
    );
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}
