"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import { useCallback, useEffect } from "react";

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
    if (!liff) return;

    const res = await fetch(`${window.location.origin}/api/budget`);
    const data = await res.json();
    console.log(data);

    await liff.sendMessages([
      {
        type: "text",
        text: serializeResponse(data).join("\n"),
      },
    ]);

    await liff.closeWindow();
  }, [liff]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  if (!liff) return <p>まずは右上のアイコンボタンからログインしようか！！！</p>;

  return <></>;
}
