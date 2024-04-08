"use server";

import { prisma } from "@/lib/db/client";
import { Genre } from "@prisma/client";
import { loginUserGuard } from "./guard";
import { FetchNotionDBProps } from "./notionDB";

interface BaseProps {
  lineUserId: string;
}

interface FetchProps extends BaseProps, FetchNotionDBProps {}
interface SpendingFetchProps extends BaseProps, FetchNotionDBProps {}
interface BalancedFetchProps extends BaseProps, FetchNotionDBProps {}
interface BudgetFetchProps extends BaseProps, FetchNotionDBProps {}

interface BulkUpdateProps extends BaseProps {
  genres: Genre[];
}

export async function fetchGenres({
  lineUserId,
  householdType,
}: FetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

    return await prisma.genre.findMany({
      where: {
        notionDB: {
          household: householdType,
        },
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
  householdType,
}: SpendingFetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

    return await prisma.genre.findMany({
      where: {
        isSpending: true,
        notionDB: {
          household: householdType,
        },
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
  householdType,
}: BalancedFetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

    return await prisma.genre.findMany({
      where: {
        isBalance: true,
        notionDB: {
          household: householdType,
        },
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
  householdType,
}: BudgetFetchProps): Promise<Genre[]> {
  try {
    loginUserGuard(lineUserId);

    return await prisma.genre.findMany({
      where: {
        isBudget: true,
        notionDB: {
          household: householdType,
        },
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
