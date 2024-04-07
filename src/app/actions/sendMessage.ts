"use server";

import client from "@/lib/line-messaging-api/client";
import { loginUserGuard } from "./db/guard";

interface Props {
  message: string;
  lineUserId: string;
}

export async function sendMessage({ message, lineUserId }: Props) {
  try {
    loginUserGuard(lineUserId);

    await client.pushMessage(lineUserId, {
      type: "text",
      text: message,
    });
  } catch (error) {
    throw new Error(`更新に失敗しました。${error}`);
  }
}
