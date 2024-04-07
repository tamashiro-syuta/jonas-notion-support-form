"use server";

import { prisma } from "@/lib/db/client";
import { Genre } from "@prisma/client";
import { loginUserGuard } from "./guard";
import { fetchNotionDBById } from "./notionDB";

interface BaseProps {
  lineUserId: string;
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
  lineUserId,
  notionDBId,
}: FetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);
    await fetchNotionDBById({ lineUserId, notionDBId });

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
  lineUserId,
  notionDBId,
}: SpendingFetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);
    await fetchNotionDBById({ lineUserId, notionDBId });

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
  lineUserId,
  notionDBId,
}: BalancedFetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);
    await fetchNotionDBById({ lineUserId, notionDBId });

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
  lineUserId,
  notionDBId,
}: BudgetFetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);
    await fetchNotionDBById({ lineUserId, notionDBId });

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
  lineUserId,
  genres,
}: BulkUpdateProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

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
  lineUserId,
  genres,
}: BulkUpdateProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

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
  lineUserId,
  genres,
}: BulkUpdateProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

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
