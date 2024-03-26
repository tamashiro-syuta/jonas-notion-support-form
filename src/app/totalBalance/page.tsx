"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";

const serializeResponse = (object: number): string => {
  return `【今月の合計残額】\n${object.toLocaleString()}円`;
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
      const res = await fetch(`${window.location.origin}/api/totalBalance`);
      const data = await res.json();
      const user = await liff.getProfile();

      await fetch(`${window.location.origin}/api/lineBot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: serializeResponse(data),
          userID: user.userId,
        }),
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
