"use server";

import client from "@/lib/line-messaging-api/client";

interface Props {
  message: string;
  userID: string;
}

export async function sendMessage({ message, userID }: Props) {
  try {
    const userIDs = [
      process.env.MY_LINE_USER_ID,
      process.env.JONA_LINE_USER_ID,
    ];

    if (!userIDs.includes(userID)) throw new Error("ユーザーIDが不正です");

    await client.pushMessage(userID, {
      type: "text",
      text: message,
    });
  } catch (error) {
    throw new Error(`更新に失敗しました。${error}`);
  }
}
