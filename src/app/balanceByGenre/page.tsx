"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../actions/sendMessage";
import { balanceByGenre } from "../actions/balanceByGenre";
import { BalanceColumn } from "@/lib/notion/types";
import { fetchBalancedGenres } from "../actions/db/genre";

const serializeResponse = (balances: BalanceColumn[]): string[] => {
  let messages = ["【カテゴリ別の今月の残額】"];

  balances.forEach((balance) => {
    messages.push(`${balance.genre} : ${balance.balance.toLocaleString()}円`);
  });

  return messages;
};

export default function Page() {
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) {
      showError({
        message: "まずは右上のアイコンボタンからログインしようか！！！",
      });
      return;
    }

    try {
      const genres = await fetchBalancedGenres({
        userID: user.userId,
        // TODO: あとでdefaultのnotionIdに変更する
        notionDBId: 1,
      });

      const balances = await balanceByGenre({
        userID: user.userId,
        notionId: 1,
        genreNames: genres.map((genre) => genre.genre),
      });

      await sendMessage({
        message: serializeResponse(balances).join("\n"),
        userID: user.userId,
      });
      await liff.closeWindow();
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
    }
  }, [liff, user]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  return <Loading />;
}
