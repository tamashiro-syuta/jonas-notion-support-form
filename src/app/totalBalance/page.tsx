"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../actions/sendMessage";
import { totalBalance } from "../actions/totalBalance";
import { useRouter } from "next/navigation";
import { fetchDefaultNotionDB } from "../actions/db/notionDB";

const serializeResponse = (amount: number): string => {
  return `【今月の合計残額】\n${amount.toLocaleString()}円`;
};

export default function Page() {
  const router = useRouter();
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) return;

    try {
      const lineUserId = user.userId;
      const db = await fetchDefaultNotionDB({ lineUserId });
      const amount = await totalBalance({ lineUserId, notionDBId: db.id });

      const message = serializeResponse(amount);
      await sendMessage({ message, lineUserId });
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
