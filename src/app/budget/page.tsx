"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const serializeResponse = (objects: any[]) => {
  let messages = ["【カテゴリ別の予算】"];

  objects.forEach((object) => {
    messages.push(`${object.genre} : ${object.amount}`);
  });

  return messages;
};

export default function Page() {
  const { liff } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff) {
      toast.error("まずは右上のアイコンボタンからログインしようか！！！");
      return;
    }

    try {
      const res = await fetch(`${window.location.origin}/api/budget`);
      const data = await res.json();

      await liff.sendMessages([
        {
          type: "text",
          text: serializeResponse(data).join("\n"),
        },
      ]);

      await liff.closeWindow();
    } catch (error) {
      toast.error(`エラーが発生しました。${error}`);
    }
  }, [liff]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  if (!liff) return <p>まずは右上のアイコンボタンからログインしようか！！！</p>;

  return <></>;
}
