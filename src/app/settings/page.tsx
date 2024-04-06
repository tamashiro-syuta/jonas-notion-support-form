"use client";

import { useCallback, useEffect, useState } from "react";
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
import Link from "next/link";

interface MenuItemProps {
  selectedNotionDBId: string | undefined;
  targetFeatureName: string;
  targetFeaturePath: string;
}

const MenuItem = ({
  selectedNotionDBId,
  targetFeatureName,
  targetFeaturePath,
}: MenuItemProps) => {
  if (!selectedNotionDBId) {
    return (
      <Button
        variant="outline"
        className="w-full text-base my-2 h-24 hover:bg-gray-100 border-2 border-primary"
        onClick={() => showError({ message: "家計簿を選択してください" })}
      >
        {targetFeatureName} へ
      </Button>
    );
  }

  return (
    <Link href={`/settings/${selectedNotionDBId}/${targetFeaturePath}`}>
      <Button
        variant="outline"
        className="w-full text-base my-2 h-24 hover:bg-gray-100 border-2 border-primary"
      >
        {targetFeatureName} へ
      </Button>
    </Link>
  );
};

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
    <div className="m-4">
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
      />

      <MenuItem
        selectedNotionDBId={selectedNotionDBId}
        targetFeatureName="項目別の予算"
        targetFeaturePath="balanceByGenre"
      />

      <MenuItem
        selectedNotionDBId={selectedNotionDBId}
        targetFeatureName="今月の残額"
        targetFeaturePath="budgetByGenre"
      />
    </div>
  );
};

export default Page;
