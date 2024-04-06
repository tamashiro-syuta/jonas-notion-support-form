"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect, useState } from "react";
import { sendMessage } from "../actions/sendMessage";
import { balanceByGenre } from "../actions/balanceByGenre";
import { BalanceColumn } from "@/lib/notion/types";
import { fetchBalancedGenres } from "../actions/db/genre";
import { useRouter } from "next/router";
import { fetchDefaultNotionDB } from "../actions/db/notionDB";

const serializeResponse = (balances: BalanceColumn[]): string[] => {
  let messages = ["【カテゴリ別の今月の残額】"];

  balances.forEach((balance) => {
    messages.push(`${balance.genre} : ${balance.balance.toLocaleString()}円`);
  });

  return messages;
};

export default function Page() {
  const router = useRouter();
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) {
      showError({
        message: "まずは右上のアイコンボタンからログインしようか！！！",
      });
      return;
    }

    try {
      const userID = user.userId;
      const db = await fetchDefaultNotionDB({ userID });
      const genres = await fetchBalancedGenres({ userID, notionDBId: db.id });

      const balances = await balanceByGenre({
        userID,
        notionId: db.id,
        genreNames: genres.map((genre) => genre.genre),
      });

      const message = serializeResponse(balances).join("\n");
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
