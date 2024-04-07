"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NotionDB } from "@prisma/client";
import Loading from "@/components/custom/Loading";
import { useLiff } from "@/components/custom/LiffProvider";
import { fetchNotionDBs } from "./actions/db/notionDB";
import { Separator } from "@/components/ui/separator";
import {
  NotionLogoIcon,
  GearIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import MenuItem from "@/components/custom/menu-item";

const Page = () => {
  const { user } = useLiff();
  const [notionDBs, setNotionDBs] = useState<NotionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotionDBId, setSelectedNotionDBId] = useState<string>();

  const fetchNotionDBsCallback = useCallback(async () => {
    if (!user) return;

    const notionDBs = await fetchNotionDBs({ lineUserId: user?.userId || "" });
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
        <div className="flex items-center">
          <NotionLogoIcon className="h-6 w-6" />
          <h1 className="pl-1 text-xl text-left py-1">
            家計簿を選択してください
          </h1>
        </div>
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

      <div>
        <div className="flex items-center mt-6">
          <PaperPlaneIcon className="h-4 w-4" />
          <h1 className="pl-2 text-xl text-left py-1">LINE通知</h1>
        </div>
        <Separator className="mb-2" />
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

      <div>
        <div className="flex items-center mt-6">
          <GearIcon className="h-6 w-6" />
          <h1 className="pl-1 text-xl text-left py-1">設定</h1>
        </div>
        <Separator className="mb-2" />
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
    </div>
  );
};

export default Page;
