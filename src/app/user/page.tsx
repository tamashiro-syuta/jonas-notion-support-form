"use client";

import Image from "next/image";
import { useLiff } from "@/components/custom/LiffProvider";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/toast-actions";
import { sendMessage } from "../actions/sendMessage";

export default function Page() {
  const { liff, user } = useLiff();

  const handleClick = async () => {
    if (liff) {
      try {
        const userID = user?.userId;
        if (!userID) throw new Error("ユーザーIDが取得できません");

        await sendMessage({ message: "Hello, World!", userID });

        showSuccess({ message: "メッセージが送信されました" });
      } catch (error) {
        showError({
          message: `エラーが発生しました。${error}`,
          duration: 5000,
        });
      }
    } else {
      console.log("liff is not available");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user ? (
        <div>
          <h1 className="text-3xl font-bold">
            こんにちは、{user.displayName}さん
          </h1>
          <p className="text-lg">ID: {user.userId}</p>
          <p className="text-lg">MESSAGE: {user.statusMessage}</p>
          {user.pictureUrl && (
            <Image
              src={user.pictureUrl}
              alt={user.displayName}
              width={400}
              height={400}
            />
          )}
        </div>
      ) : (
        <p>未ログイン</p>
      )}

      <Button onClick={handleClick}>メッセージ送信</Button>

      <Button>Test</Button>
    </main>
  );
}
