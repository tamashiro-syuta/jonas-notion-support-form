import { prisma } from "@/lib/db/client";

export const loginUserGuard = async (userID: string) => {
  const user = await prisma.user.findUnique({ where: { lineUserId: userID } });

  if (user) return;
  throw new Error("ユーザーIDが不正です");
};
