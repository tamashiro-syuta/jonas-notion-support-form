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
import { BALANCE_BY_GENRE } from "@/lib/constants";

interface Props {
  params: {
    householdType: string;
  };
}

const serializeResponse = (balances: BalanceColumn[]): string[] => {
  let messages = [`【${BALANCE_BY_GENRE}】`];

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

      // const genres = [
      //   {
      //     id: 12,
      //     notionDBId: 2,
      //     genre: "食費",
      //     orderNumber: 2,
      //     isSpending: true,
      //     isBalance: true,
      //     isBudget: true,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 13,
      //     notionDBId: 2,
      //     genre: "日用品",
      //     orderNumber: 3,
      //     isSpending: true,
      //     isBalance: true,
      //     isBudget: true,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 14,
      //     notionDBId: 2,
      //     genre: "エンタメ",
      //     orderNumber: 4,
      //     isSpending: true,
      //     isBalance: true,
      //     isBudget: true,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 17,
      //     notionDBId: 2,
      //     genre: "車関連",
      //     orderNumber: 5,
      //     isSpending: false,
      //     isBalance: true,
      //     isBudget: true,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 16,
      //     notionDBId: 2,
      //     genre: "光熱費",
      //     orderNumber: 6,
      //     isSpending: true,
      //     isBalance: true,
      //     isBudget: true,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 18,
      //     notionDBId: 2,
      //     genre: "家賃",
      //     orderNumber: 7,
      //     isSpending: false,
      //     isBalance: true,
      //     isBudget: false,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 19,
      //     notionDBId: 2,
      //     genre: "Wi-Fi",
      //     orderNumber: 8,
      //     isSpending: false,
      //     isBalance: true,
      //     isBudget: false,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 20,
      //     notionDBId: 2,
      //     genre: "自動車保険",
      //     orderNumber: 9,
      //     isSpending: false,
      //     isBalance: true,
      //     isBudget: false,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 15,
      //     notionDBId: 2,
      //     genre: "先取り貯金",
      //     orderNumber: 10,
      //     isSpending: false,
      //     isBalance: true,
      //     isBudget: false,
      //     createdAt: "2024-03-28T11:33:48.840Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      //   {
      //     id: 21,
      //     notionDBId: 2,
      //     genre: "その他",
      //     orderNumber: 11,
      //     isSpending: false,
      //     isBalance: true,
      //     isBudget: true,
      //     createdAt: "2024-04-10T13:41:15.884Z",
      //     updatedAt: "2024-04-12T04:57:17.136Z",
      //   },
      // ];

      console.log("genres", genres);

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
