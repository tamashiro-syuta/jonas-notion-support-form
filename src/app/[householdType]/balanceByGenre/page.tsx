"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../../actions/sendMessage";
import { balanceByGenre } from "../../actions/balanceByGenre";
import { BalanceColumn } from "@/lib/notion/types";
import { fetchBalancedGenres } from "../../actions/db/genre";
import {
  castHouseholdType,
  matchHouseholdType,
} from "@/lib/db/matchHouseholdType";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    householdType: string;
  };
}

const serializeResponse = (balances: BalanceColumn[]): string[] => {
  let messages = ["【項目別の今月の残額】"];

  balances.forEach((balance) => {
    messages.push(`${balance.genre} : ${balance.balance.toLocaleString()}円`);
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
      const genres = await fetchBalancedGenres({
        lineUserId: user.userId,
        householdType: castHouseholdType(householdType),
      });

      const genreNames = genres.map((genre) => genre.genre);
      const balances = await balanceByGenre({
        lineUserId: user.userId,
        householdType: castHouseholdType(householdType),
        genreNames,
      });

      await sendMessage({
        message: serializeResponse(balances).join("\n"),
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
