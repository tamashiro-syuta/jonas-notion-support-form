"use server";

import getTotalBalanceForMonth from "@/lib/notion/getTotalBalanceForMonth";
import { correctNotionDBGuard, loginUserGuard } from "./db/guard";

interface Props {
  userID: string;
  notionDBId: number;
}

export async function totalBalance({ userID, notionDBId }: Props) {
  await loginUserGuard(userID);
  const db = await correctNotionDBGuard(userID, notionDBId);

  try {
    const thisMonth = new Date().getMonth() + 1;
    return await getTotalBalanceForMonth({
      month: thisMonth,
      notionDBDatabaseId: db.databaseId,
    });
  } catch (error) {
    throw new Error("取得に失敗しました");
  }
}
