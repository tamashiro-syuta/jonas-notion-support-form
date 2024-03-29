"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../actions/sendMessage";
import { totalBalance } from "../actions/totalBalance";

const serializeResponse = (amount: number): string => {
  return `【今月の合計残額】\n${amount.toLocaleString()}円`;
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
      const amount = await totalBalance();
      const user = await liff.getProfile();

      await sendMessage({
        message: serializeResponse(amount),
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
