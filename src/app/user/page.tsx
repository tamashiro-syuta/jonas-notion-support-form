"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLiff } from "@/components/custom/LiffProvider";
import { Profile } from "@liff/get-profile";
import { toast } from "sonner";

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
      })();
    }
  }, [liff]);

  console.log("user", user);

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
    </main>
  );
}
