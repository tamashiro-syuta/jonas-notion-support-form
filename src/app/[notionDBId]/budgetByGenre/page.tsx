"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../../actions/sendMessage";
import { Amount, budgetByGenre } from "../../actions/budgetByGenre";
import { fetchBalancedGenres, fetchBudgetGenres } from "@/app/actions/db/genre";

interface Props {
  params: {
    notionDBId: string;
  };
}

const serializeResponse = (objects: Amount[]) => {
  let messages = ["【項目別の予算】"];

  objects.forEach((object) => {
    messages.push(`${object.genre} : ${object.amount.toLocaleString()}円`);
  });

  return messages;
};

export default function Page({ params: { notionDBId } }: Props) {
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) return;

    try {
      const genres = await fetchBudgetGenres({
        lineUserId: user.userId,
        notionDBId: Number(notionDBId),
      });

      const genreNames = genres.map((genre) => genre.genre);
      const data = await budgetByGenre({
        lineUserId: user.userId,
        notionDBId: Number(notionDBId),
        genreNames,
      });

      await sendMessage({
        message: serializeResponse(data).join("\n"),
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
