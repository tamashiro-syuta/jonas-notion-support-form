"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../actions/sendMessage";
import { Amount, budgetByGenre } from "../actions/budgetByGenre";
import { useRouter } from "next/navigation";
import { fetchDefaultNotionDB } from "../actions/db/notionDB";

const serializeResponse = (objects: Amount[]) => {
  let messages = ["【カテゴリ別の予算】"];

  objects.forEach((object) => {
    messages.push(`${object.genre} : ${object.amount.toLocaleString()}円`);
  });

  return messages;
};

export default function Page() {
  const router = useRouter();
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) {
      const message = "まずは右上のアイコンボタンからログインしようか";
      showError({ message });
      return;
    }

    try {
      const userID = user.userId;
      const db = await fetchDefaultNotionDB({ userID });
      const data = await budgetByGenre({ userID, notionId: db.id });
      const message = serializeResponse(data).join("\n");

      await sendMessage({ message, userID });
      await liff.closeWindow();
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
      router.push("/");
    }
  }, [liff, router, user]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  return <Loading />;
}
