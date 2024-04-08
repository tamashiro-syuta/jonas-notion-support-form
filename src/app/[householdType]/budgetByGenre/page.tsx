"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../../actions/sendMessage";
import { Amount, budgetByGenre } from "../../actions/budgetByGenre";
import { fetchBalancedGenres, fetchBudgetGenres } from "@/app/actions/db/genre";
import {
  castHouseholdType,
  matchHouseholdType,
} from "@/lib/db/matchHouseholdType";
import { useRouter } from "next/router";

interface Props {
  params: {
    householdType: string;
  };
}

const serializeResponse = (objects: Amount[]) => {
  let messages = ["【項目別の予算】"];

  objects.forEach((object) => {
    messages.push(`${object.genre} : ${object.amount.toLocaleString()}円`);
  });

  return messages;
};

export default function Page({ params: { householdType } }: Props) {
  const router = useRouter();
  const { liff, user } = useLiff();

  const fetchAndSendBudget = useCallback(async () => {
    if (!liff || !user) return;
    if (!matchHouseholdType(householdType)) {
      showError({ message: "不適切な値が指定されています" });
      router.push("/");
    }

    try {
      const genres = await fetchBudgetGenres({
        lineUserId: user.userId,
        householdType: castHouseholdType(householdType),
      });

      const genreNames = genres.map((genre) => genre.genre);
      const data = await budgetByGenre({
        lineUserId: user.userId,
        householdType: castHouseholdType(householdType),
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
  }, [liff, user, householdType, router]);

  useEffect(() => {
    fetchAndSendBudget();
  }, [fetchAndSendBudget]);

  return <Loading />;
}
