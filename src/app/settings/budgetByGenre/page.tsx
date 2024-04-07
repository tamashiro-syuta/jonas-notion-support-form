"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchDefaultNotionDB } from "@/app/actions/db/notionDB";
import { useLiff } from "@/components/custom/LiffProvider";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";

const Page = () => {
  const router = useRouter();
  const { liff, user } = useLiff();

  const fetchAndSetBudget = useCallback(async () => {
    if (!liff || !user) return;

    try {
      const db = await fetchDefaultNotionDB({ lineUserId: user.userId });

      router.push(`/settings/${db.id}/budgetByGenre`);
    } catch (error) {
      showError({ message: `${error}`, duration: 50000 });
      router.push("/");
    }
  }, [liff, router, user]);

  useEffect(() => {
    fetchAndSetBudget();
  }, [fetchAndSetBudget]);

  return <Loading />;
};

export default Page;
