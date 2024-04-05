import { prisma } from "@/lib/db/client";

export const loginUserGuard = async (userID: string) => {
  const user = await prisma.user.findUnique({ where: { lineUserId: userID } });

  console.log("user", user);

  if (user) return user;
  throw new Error("ユーザーIDが不正です");
};
