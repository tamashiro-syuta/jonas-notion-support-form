"use server";

import { prisma } from "@/lib/db/client";
import { HouseholdType, NotionDB } from "@prisma/client";
import { loginUserGuard } from "./guard";

interface BaseProps {
  lineUserId: string;
}

export interface FetchAllNotionDBsProps extends BaseProps {}

export interface FetchNotionDBProps extends BaseProps {
  householdType: HouseholdType;
}

export async function fetchAllNotionDBs({
  lineUserId,
}: FetchAllNotionDBsProps): Promise<NotionDB[]> {
  try {
    loginUserGuard(lineUserId);

    return await prisma.notionDB.findMany();
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function fetchNotionDB({
  lineUserId,
  householdType,
}: FetchNotionDBProps): Promise<NotionDB> {
  try {
    loginUserGuard(lineUserId);
    return await prisma.notionDB.findFirstOrThrow({
      where: { household: householdType },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}
