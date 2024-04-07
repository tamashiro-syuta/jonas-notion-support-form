"use server";

import getTotalBalanceForMonth from "@/lib/notion/getTotalBalanceForMonth";
import { loginUserGuard } from "./db/guard";
import { fetchNotionDBById } from "./db/notionDB";

interface Props {
  lineUserId: string;
  notionDBId: number;
}

export async function totalBalance({ lineUserId, notionDBId }: Props) {
  loginUserGuard(lineUserId);
  const db = await fetchNotionDBById({ lineUserId, notionDBId });

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
