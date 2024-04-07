"use server";

import { prisma } from "@/lib/db/client";
import { NotionDB } from "@prisma/client";
import { loginUserGuard } from "./guard";

interface BaseProps {
  lineUserId: string;
}

interface FetchProps extends BaseProps {}

interface FetchByIdProps extends BaseProps {
  notionDBId: number;
}

export async function fetchNotionDBs({
  lineUserId,
}: FetchProps): Promise<NotionDB[]> {
  try {
    loginUserGuard(lineUserId);
    return await prisma.notionDB.findMany({
      where: {
        user: { lineUserId },
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function fetchNotionDBById({
  lineUserId,
  notionDBId,
}: FetchByIdProps): Promise<NotionDB> {
  try {
    loginUserGuard(lineUserId);
    return await prisma.notionDB.findFirstOrThrow({
      where: {
        id: notionDBId,
        user: { lineUserId },
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function fetchDefaultNotionDB({
  lineUserId,
}: FetchProps): Promise<NotionDB> {
  try {
    loginUserGuard(lineUserId);
    return await prisma.notionDB.findFirstOrThrow({
      where: {
        isDefault: true,
        user: { lineUserId },
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}
