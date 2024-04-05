"use server";

import { prisma } from "@/lib/db/client";
import { loginUserGuard } from "./loginUserGuard";
import { Genre } from "@prisma/client";

interface BaseProps {
  userID: string;
}

interface FetchProps extends BaseProps {
  notionDBId: number;
}

interface BulkUpdateGenresProps extends BaseProps {
  genres: Genre[];
}

export async function fetchGenres({
  userID,
  notionDBId,
}: FetchProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);

    return await prisma.genre.findMany({
      where: {
        notionDBId,
      },
      orderBy: {
        orderNumber: "asc",
      },
    });
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}

export async function bulkUpdateGenres({
  userID,
  genres,
}: BulkUpdateGenresProps): Promise<Genre[]> {
  try {
    await loginUserGuard(userID);

    const dataList = genres.map((genre) => ({
      where: { id: genre.id },
      data: { isBalance: genre.isBalance },
    }));

    return await prisma.$transaction(
      dataList.map((data) => prisma.genre.update(data))
    );
  } catch (error) {
    throw new Error(`取得に失敗しました, ${error}`);
  }
}
