"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../actions/sendMessage";
import { Amount, budgetByCategory } from "../actions/budgetByCategory";

const serializeResponse = (objects: Amount[]) => {
  let messages = ["【カテゴリ別の予算】"];

  objects.forEach((object) => {
    messages.push(`${object.genre} : ${object.amount.toLocaleString()}円`);
  });

  return messages;
};

export default function Page() {
  const { liff } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff) {
      showError({
        message: "まずは右上のアイコンボタンからログインしようか！！！",
      });
      return;
    }

    try {
      const data = await budgetByCategory();
      const user = await liff.getProfile();

      await sendMessage({
        message: serializeResponse(data).join("\n"),
        userID: user.userId,
      });

      await liff.closeWindow();
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
    }
  }, [liff]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  return <Loading />;
}
