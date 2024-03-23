"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLiff } from "@/components/custom/LiffProvider";
import { Profile } from "@liff/get-profile";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/toast-actions";

export default function Page() {
  const { liff } = useLiff();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (liff) {
      (async () => {
        const user = await liff.getProfile();
        setUser(user);
      })();
    }
  }, [liff]);

  console.log("user", user);

  const handleClick = async () => {
    if (liff) {
      try {
        const userID = user?.userId;
        const res = await fetch(`${window.location.origin}/api/lineBot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "こんにちは！",
            userID,
          }),
        });

        res.status > 400
          ? showSuccess({ message: "メッセージを送信しました" })
          : showError({ message: "失敗しました", duration: 5000 });
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
    </main>
  );
}
