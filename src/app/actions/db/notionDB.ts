"use server";

import { prisma } from "@/lib/db/client";
import { NotionDB } from "@prisma/client";
import { loginUserGuard } from "./guard";

interface BaseProps {
  userID: string;
}

interface FetchProps extends BaseProps {}

export async function fetchNotionDBs({
  userID,
}: FetchProps): Promise<NotionDB[]> {
  try {
    const user = await loginUserGuard(userID);

    return await prisma.notionDB.findMany({
      where: {
        userId: user.id,
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}
