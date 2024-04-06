"use server";

import {
  ASSET,
  COMMUNICATION_EXPENSES,
  INCOME,
  INSURANCE,
} from "@/lib/notion/constants";
import getBudgetForMonth from "@/lib/notion/getBudgetForMonth";
import getSpendingForMonth from "@/lib/notion/getSpendingForMonth";
import { BaseColumn, BudgetColumn, SpendingColumn } from "@/lib/notion/types";

export interface Amount extends BaseColumn {
  amount: number;
}

function calcAmountCanSpendThisMonth({
  thisMonthBudget,
  thisMonthSpending,
}: {
  thisMonthBudget: BudgetColumn[];
  thisMonthSpending: SpendingColumn[];
}): Amount[] {
  const todayDate = new Date().getDate();
  const thisMonth = new Date().getMonth() + 1;
  const nowMonthLastDate = new Date(
    new Date().getFullYear(),
    thisMonth,
    0
  ).getDate();

  return thisMonthBudget.map(({ genre, order, budget }) => {
    const genreSpending = thisMonthSpending.find(
      (spending) => spending.genre === genre
    );
    const spent = genreSpending ? genreSpending?.spending : 0;
    const amountCanSpend = (budget / nowMonthLastDate) * todayDate - spent;

    return { genre, order, amount: Math.round(amountCanSpend) };
  });
}

function excludeUnnecessaryGenres(amounts: Amount[]): Amount[] {
  const UNNECESSARY_GENRES = [INSURANCE, ASSET, INCOME, COMMUNICATION_EXPENSES];

  return amounts.filter((amount) => {
    const includeUnnecessaryGenre = (UNNECESSARY_GENRES as string[]).includes(
      amount.genre
    );
    if (!includeUnnecessaryGenre) return amount;
  });
}

// NOTE: 実行時点でのカテゴリ別予算
export async function budgetByCategory(
  genreNames?: string[]
): Promise<Amount[]> {
  try {
    const thisMonth = new Date().getMonth() + 1;
    const thisMonthBudget = await getBudgetForMonth({ month: thisMonth });

    const thisMonthSpending = await getSpendingForMonth({ month: thisMonth });
    const amountCanSpendThisMonth = calcAmountCanSpendThisMonth({
      thisMonthBudget,
      thisMonthSpending,
    });

    const necessaryAmounts = excludeUnnecessaryGenres(amountCanSpendThisMonth);
    const sortedAmounts = necessaryAmounts.sort((a, b) => a.order - b.order);

    if (genreNames) {
      const filteredAmounts = sortedAmounts.filter((amount) => {
        return genreNames.includes(amount.genre);
      });

      return filteredAmounts.sort((a, b) => a.order - b.order);
    }

    return sortedAmounts;
  } catch (error) {
    throw new Error("更新に失敗しました");
  }
}
