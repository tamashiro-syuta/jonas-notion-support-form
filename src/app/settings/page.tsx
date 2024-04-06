"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchNotionDBs } from "../actions/db/notionDB";
import { NotionDB } from "@prisma/client";
import Loading from "@/components/custom/Loading";
import { useLiff } from "@/components/custom/LiffProvider";
import { showError } from "@/lib/toast-actions";

const Page = () => {
  const { user } = useLiff();
  const [notionDBs, setNotionDBs] = useState<NotionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotionDBId, setSelectedNotionDBId] = useState<string>();
  const router = useRouter();

  const fetchNotionDBsCallback = useCallback(async () => {
    if (!user) return;

    const notionDBs = await fetchNotionDBs({ userID: user?.userId || "" });
    setNotionDBs(notionDBs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotionDBsCallback();
  }, [fetchNotionDBsCallback]);

  if (loading) return <Loading />;

  return (
    <div>
      <Select onValueChange={setSelectedNotionDBId}>
        <SelectTrigger className="w-full my-2">
          <SelectValue placeholder="家計簿を選択" />
        </SelectTrigger>
        <SelectContent>
          {notionDBs.map((notionDB) => (
            <SelectItem key={notionDB.id} value={notionDB.id.toString()}>
              {notionDB.displayDatabaseName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="w-full text-base my-2 h-24 hover:bg-gray-100 border-2 border-primary"
        onClick={() => {
          if (!selectedNotionDBId)
            return showError({ message: "家計簿を選択してください" });

          router.push(`/settings/${selectedNotionDBId}/balanceByGenre`);
        }}
      >
        カテゴリ別の予算 へ
      </Button>

      <Button
        variant="outline"
        className="w-full text-base my-2 h-24 hover:bg-gray-100 border-2 border-primary"
        onClick={() => {
          if (!selectedNotionDBId)
            return showError({ message: "家計簿を選択してください" });

          router.push(`/settings/${selectedNotionDBId}/totalBalance`);
        }}
      >
        今月の残額 へ
      </Button>
    </div>
  );
};

export default Page;
