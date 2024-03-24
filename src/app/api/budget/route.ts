import {
  ASSET,
  COMMUNICATION_EXPENSES,
  INCOME,
  INSURANCE,
} from "@/lib/notion/constants";
import getBudgetForMonth, { Budget } from "@/lib/notion/getBudgetForMonth";
import getSpendingForMonth, {
  Spending,
} from "@/lib/notion/getSpendingForMonth";

type Amount = { genre: string; amount: number };

function calcAmountCanSpendThisMonth({
  thisMonthBudget,
  thisMonthSpending,
}: {
  thisMonthBudget: Budget[];
  thisMonthSpending: Spending[];
}): Amount[] {
  const todayDate = new Date().getDate();
  const thisMonth = new Date().getMonth() + 1;
  const nowMonthLastDate = new Date(
    new Date().getFullYear(),
    thisMonth,
    0
  ).getDate();

  return thisMonthBudget.map(({ genre, budget }) => {
    const genreSpending = thisMonthSpending.find(
      (spending) => spending.genre === genre
    );
    const spent = genreSpending ? genreSpending?.spending : 0;
    const amountCanSpend = (budget / nowMonthLastDate) * todayDate - spent;

    return { genre, amount: Math.round(amountCanSpend) };
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

export async function GET(req: Request, res: Response) {
  try {
    const thisMonth = new Date().getMonth() + 1;
    const thisMonthBudget = await getBudgetForMonth({ month: thisMonth });

    const thisMonthSpending = await getSpendingForMonth({ month: thisMonth });
    const amountCanSpendThisMonth = calcAmountCanSpendThisMonth({
      thisMonthBudget,
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
