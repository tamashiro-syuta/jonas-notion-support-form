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
import { fetchAllNotionDBs } from "./actions/db/notionDB";
import { Separator } from "@/components/ui/separator";
import {
  NotionLogoIcon,
  GearIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import MenuItem from "@/components/custom/menu-item";
import {
  ADD_SPENDING,
  BALANCE_BY_GENRE,
  BUDGET_BY_GENRE,
  SETTINGS,
} from "@/lib/constants";

const Page = () => {
  const { user } = useLiff();
  const [notionDBs, setNotionDBs] = useState<NotionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [householdType, setHouseholdType] = useState<string>();

  const fetchNotionDBsCallback = useCallback(async () => {
    if (!user) return;

    const notionDBs = await fetchAllNotionDBs({
      lineUserId: user.userId,
    });
    setNotionDBs(notionDBs);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotionDBsCallback();
  }, [fetchNotionDBsCallback]);

  if (loading) return <Loading />;

  return (
    <div>
      <Select onValueChange={setHouseholdType}>
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
            <SelectItem key={notionDB.id} value={notionDB.household}>
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
          householdType={householdType}
          targetFeatureName={ADD_SPENDING}
          targetFeaturePath="addSpending"
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName={BUDGET_BY_GENRE}
          targetFeaturePath="budgetByGenre"
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName={BALANCE_BY_GENRE}
          targetFeaturePath="balanceByGenre"
        />
      </div>

      <div>
        <div className="flex items-center mt-6">
          <GearIcon className="h-6 w-6" />
          <h1 className="pl-1 text-xl text-left py-1">{SETTINGS}</h1>
        </div>
        <Separator className="mb-2" />
        <MenuItem
          householdType={householdType}
          targetFeatureName={ADD_SPENDING}
          targetFeaturePath="addSpending"
          isSettings
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName={BUDGET_BY_GENRE}
          targetFeaturePath="budgetByGenre"
          isSettings
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName={BALANCE_BY_GENRE}
          targetFeaturePath="balanceByGenre"
          isSettings
        />
      </div>
    </div>
  );
};

export default Page;
