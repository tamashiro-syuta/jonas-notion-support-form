"use server";

import getTotalBalanceForMonth from "@/lib/notion/getTotalBalanceForMonth";
import { loginUserGuard } from "./db/guard";
import { FetchNotionDBProps, fetchNotionDB } from "./db/notionDB";

interface Props extends FetchNotionDBProps {}

export async function totalBalance({ lineUserId, householdType }: Props) {
  loginUserGuard(lineUserId);
  const db = await fetchNotionDB({ lineUserId, householdType });

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
