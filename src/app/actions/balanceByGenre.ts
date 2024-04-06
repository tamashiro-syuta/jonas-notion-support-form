"use server";

import getBalanceForMonth from "@/lib/notion/getBalanceForMonth";
import { correctNotionDBGuard, loginUserGuard } from "./db/guard";

interface Props {
  userID: string;
  notionId: number;
  genreNames?: string[];
}

export async function balanceByGenre({ userID, notionId, genreNames }: Props) {
  try {
    await loginUserGuard(userID);
    const db = await correctNotionDBGuard(userID, notionId);

    const thisMonth = new Date().getMonth() + 1;
    const balances = await getBalanceForMonth({
      month: thisMonth,
      notionDBDatabaseId: db.databaseId,
    });

    if (genreNames) {
      const filteredBalances = balances.filter((balance) => {
        return genreNames.includes(balance.genre);
      });

      return filteredBalances.sort((a, b) => a.order - b.order);
    }

    return balances.sort((a, b) => a.order - b.order);
  } catch (error) {
    throw new Error("取得に失敗しました");
  }
}
