import { prisma } from "@/lib/db/client";

export const loginUserGuard = async (userID: string) => {
  const user = await prisma.user.findUnique({ where: { lineUserId: userID } });

  if (user) return user;
  throw new Error("ユーザーIDが不正です");
};

export const correctNotionDBGuard = async (
  userID: string,
  notionDBId: number
) => {
  const user = await loginUserGuard(userID);
  const db = await prisma.notionDB.findUnique({
    where: {
      id: notionDBId,
      userId: user.id,
    },
  });

  if (db) return db;

  throw new Error("DBが不正です");
};
