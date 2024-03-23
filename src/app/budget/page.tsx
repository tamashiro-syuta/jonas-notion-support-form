"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const serializeResponse = (objects: any[]) => {
  let messages = ["【カテゴリ別の予算】"];

  objects.forEach((object) => {
    messages.push(`${object.genre} : ${object.amount}円`);
  });

  return messages;
};

export default function Page() {
  const { liff } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff) {
      toast.error("まずは右上のアイコンボタンからログインしようか！！！", {
        style: {
          background: "red",
          color: "white",
        },
        duration: 3000,
      });
      return;
    }

    try {
      const res = await fetch(`${window.location.origin}/api/budget`);
      const data = await res.json();
      const user = await liff.getProfile();

      await fetch(`${window.location.origin}/api/lineBot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: serializeResponse(data).join("\n"),
          userID: user.userId,
        }),
      });

      await liff.closeWindow();
    } catch (error) {
      toast.error(`エラーが発生しました。${error}`, {
        style: {
          background: "red",
          color: "white",
        },
        duration: 3000,
      });
    }
  }, [liff]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  if (!liff) return <p>まずは右上のアイコンボタンからログインしようか！！！</p>;

  return <Loading />;
}
