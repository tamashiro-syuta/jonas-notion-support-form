import {
  ASSET,
  COMMUNICATION_EXPENSES,
  INCOME,
  INSURANCE,
  LIVING_EXPENSES,
  LOAN,
  MOTHER,
} from "@/lib/notion/constants";
import getBalanceForMonth, { Balance } from "@/lib/notion/getBalanceForMonth";
import getBudgetForMonth, { Budget } from "@/lib/notion/getBudgetForMonth";
import getSpendingForMonth, {
  Spending,
} from "@/lib/notion/getSpendingForMonth";

type Amount = { genre: string; amount: number };

function calcTotalAmountForEachGenre({
  balances,
  budgets,
}: {
  balances: Balance[];
  budgets: Budget[];
}): Amount[] {
  return balances.map(({ genre, balance }) => {
    const sameGenreBudget = budgets.find((budget) => budget.genre === genre);

    const budget = sameGenreBudget?.budget || 0;
    // NOTE: 残高がマイナスになる場合は、0として扱う
    const amount = (balance > 0 ? balance : 0) + budget;

    return { genre: genre, amount };
  });
}

function calcAmountCanSpendThisMonth({
  totalAmount,
  thisMonthSpending,
}: {
  totalAmount: Amount[];
  thisMonthSpending: Spending[];
}): Amount[] {
  const todayDate = new Date().getDate();
  const thisMonth = new Date().getMonth() + 1;
  const nowMonthLastDate = new Date(
    new Date().getFullYear(),
    thisMonth,
    0
  ).getDate();

  return totalAmount.map(({ genre, amount }) => {
    const genreSpending = thisMonthSpending.find(
      (spending) => spending.genre === genre
    );
    const spent = genreSpending ? genreSpending?.spending : 0;
    const amountCanSpend = (amount / nowMonthLastDate) * todayDate - spent;

    return { genre, amount: Math.round(amountCanSpend) };
  });
}

function excludeUnnecessaryGenres(amounts: Amount[]): Amount[] {
  const UNNECESSARY_GENRES = [
    MOTHER,
    INSURANCE,
    LOAN,
    LIVING_EXPENSES,
    ASSET,
    INCOME,
    COMMUNICATION_EXPENSES,
  ];

  return amounts.filter((amount) => {
    const includeUnnecessaryGenre = (UNNECESSARY_GENRES as string[]).includes(
      amount.genre
    );
    if (!includeUnnecessaryGenre) return amount;
  });
}

export async function GET(req: Request, res: Response) {
  try {
    const lastMonth = new Date().getMonth();
    const thisMonth = new Date().getMonth() + 1;

    const lastMonthBalance = await getBalanceForMonth({ month: lastMonth });
    const thisMonthBudget = await getBudgetForMonth({ month: thisMonth });

    const totalAmount = calcTotalAmountForEachGenre({
      balances: lastMonthBalance,
      budgets: thisMonthBudget,
    });

    const thisMonthSpending = await getSpendingForMonth({ month: thisMonth });
    const amountCanSpendThisMonth = calcAmountCanSpendThisMonth({
      totalAmount,
      thisMonthSpending,
    });

    const necessaryAmounts = excludeUnnecessaryGenres(amountCanSpendThisMonth);

    return new Response(JSON.stringify(necessaryAmounts), {
      status: 200,
    });
  } catch (error) {
    return new Response("更新に失敗しました", {
      status: 500,
    });
  }
}
