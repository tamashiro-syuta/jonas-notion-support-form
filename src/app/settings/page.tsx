"use client";

import { useCallback, useEffect, useState } from "react";
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
import MenuItem from "@/components/custom/menu-item";

const Page = () => {
  const { user } = useLiff();
  const [notionDBs, setNotionDBs] = useState<NotionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotionDBId, setSelectedNotionDBId] = useState<string>();

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

      <MenuItem
        selectedNotionDBId={selectedNotionDBId}
        targetFeatureName="支出の追加"
        targetFeaturePath="addSpending"
        isSettings
      />

      <MenuItem
        selectedNotionDBId={selectedNotionDBId}
        targetFeatureName="項目別の予算"
        targetFeaturePath="balanceByGenre"
        isSettings
      />

      <MenuItem
        selectedNotionDBId={selectedNotionDBId}
        targetFeatureName="今月の残額"
        targetFeaturePath="budgetByGenre"
        isSettings
      />
    </div>
  );
};

export default Page;
