"use server";

import getBalanceForMonth from "@/lib/notion/getBalanceForMonth";
import { loginUserGuard } from "./db/guard";
import { fetchNotionDBById } from "./db/notionDB";

interface Props {
  lineUserId: string;
  notionDBId: number;
  genreNames?: string[];
}

export async function balanceByGenre({
  lineUserId,
  notionDBId,
  genreNames,
}: Props) {
  try {
    loginUserGuard(lineUserId);
    const db = await fetchNotionDBById({ lineUserId, notionDBId });

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
