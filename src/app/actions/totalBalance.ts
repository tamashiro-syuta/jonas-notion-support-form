"use server";

import getTotalBalanceForMonth from "@/lib/notion/getTotalBalanceForMonth";

export async function totalBalance() {
  try {
    const thisMonth = new Date().getMonth() + 1;
    return await getTotalBalanceForMonth({
      month: thisMonth,
    });
  } catch (error) {
    throw new Error("取得に失敗しました");
  }
}
