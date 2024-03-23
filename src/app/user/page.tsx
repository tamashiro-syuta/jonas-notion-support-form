"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLiff } from "@/components/custom/LiffProvider";
import { Profile } from "@liff/get-profile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { liff } = useLiff();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (liff) {
      (async () => {
        const user = await liff.getProfile();
        setUser(user);

        toast.success(
          `ユーザー情報を取得しました。${user.displayName}, ${user.userId}`,
          {
            style: {
              background: "green",
              color: "white",
            },
            duration: 3000,
          }
        );

        liff.closeWindow();
      })();
    }
  }, [liff]);

  console.log("user", user);

  const handleClick = async () => {
    if (liff) {
      try {
        await liff.sendMessages([
          {
            type: "text",
            text: "こんにちは",
          },
        ]);

        await toast.success("メッセージを送信しました", {
          style: {
            background: "green",
            color: "white",
          },
          duration: 3000,
        });
      } catch (error) {
        toast.error(`失敗！${error}`, {
          style: {
            background: "red",
            color: "white",
          },
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
