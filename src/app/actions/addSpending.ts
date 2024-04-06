"use server";

import { NotionError } from "@/lib/Error";
import getGenresBudgetForMonth from "@/lib/notion/getGenresBudgetForMonth";
import updateBudget from "@/lib/notion/updateBudget";
import { correctNotionDBGuard, loginUserGuard } from "./db/guard";

interface Props {
  userID: string;
  notionId: number;
  genre: string;
  amount: number;
}

export async function addSpending({ userID, genre, amount, notionId }: Props) {
  try {
    if (isNaN(amount)) throw new Error("金額に数字ではない値が検出されました");

    await loginUserGuard(userID);
    const db = await correctNotionDBGuard(userID, notionId);

    // NOTE: new Date().getMonth() は 0 から始まるため、 +1 する
    const thisMonth = new Date().getMonth() + 1;
    const budget = await getGenresBudgetForMonth({
      genre,
      month: thisMonth,
      notionDBDatabaseId: db.databaseId,
    });
    await updateBudget(budget, amount);
  } catch (error) {
    if (error instanceof NotionError) {
      throw new Error(
        `NotionAPIにリクエスト時にエラーが発生しました。${error}`
      );
    }
    throw new Error("更新に失敗しました");
  }
}
