"use server";

import getBalanceForMonth from "@/lib/notion/getBalanceForMonth";

export async function balanceByCategory() {
  try {
    const thisMonth = new Date().getMonth() + 1;
    const balances = await getBalanceForMonth({
      month: thisMonth,
    });

    return balances.sort((a, b) => a.order - b.order);
  } catch (error) {
    throw new Error("取得に失敗しました");
  }
}
