"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../../actions/sendMessage";
import { totalBalance } from "../../actions/totalBalance";

interface Props {
  params: {
    notionDBId: string;
  };
}

const serializeResponse = (amount: number): string => {
  return `【今月の合計残額】\n${amount.toLocaleString()}円`;
};

export default function Page({ params: { notionDBId } }: Props) {
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) return;

    try {
      const amount = await totalBalance({
        lineUserId: user.userId,
        notionDBId: Number(notionDBId),
      });

      await sendMessage({
        message: serializeResponse(amount),
        lineUserId: user.userId,
      });
      await liff.closeWindow();
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
    }
  }, [liff, notionDBId, user]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  return <Loading />;
}
