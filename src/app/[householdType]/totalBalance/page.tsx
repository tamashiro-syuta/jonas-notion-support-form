"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { useCallback, useEffect } from "react";
import { sendMessage } from "../../actions/sendMessage";
import { totalBalance } from "../../actions/totalBalance";
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

const serializeResponse = (amount: number): string => {
  return `【今月の合計残額】\n${amount.toLocaleString()}円`;
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
      const amount = await totalBalance({
        lineUserId: user.userId,
        householdType: castHouseholdType(householdType),
      });

      await sendMessage({
        message: serializeResponse(amount),
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
