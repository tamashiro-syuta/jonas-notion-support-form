"use server";

import getBalanceForMonth from "@/lib/notion/getBalanceForMonth";

export async function balanceByCategory(genreNames?: string[]) {
  try {
    const thisMonth = new Date().getMonth() + 1;
    const balances = await getBalanceForMonth({
      month: thisMonth,
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
