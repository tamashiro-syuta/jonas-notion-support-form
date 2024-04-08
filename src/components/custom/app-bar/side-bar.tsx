"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GearIcon,
  ChevronRightIcon,
  HamburgerMenuIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { HouseholdType } from "@prisma/client";
import {
  ADD_SPENDING,
  BALANCE_BY_GENRE,
  BUDGET_BY_GENRE,
  SETTINGS,
  INDIVIDUAL_HOUSEHOLD_NAME,
  PAIRS_HOUSEHOLD_NAME,
} from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { castHouseholdType } from "@/lib/db/matchHouseholdType";

export const SideBar = () => {
  const [householdType, setHouseholdType] = useState<HouseholdType>(
    HouseholdType.INDIVIDUAL
  );

  const onTabChange = (value: string) => {
    setHouseholdType(castHouseholdType(value));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <HamburgerMenuIcon className="w-8 h-8 py-2 mx-2 text-primary" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-secondary">
        <SheetHeader className="text-left">
          <Tabs
            defaultValue={HouseholdType.INDIVIDUAL}
            onValueChange={onTabChange}
            className="w-full mt-4 mb-1 border rounded-full"
          >
            <TabsList className="w-full bg-secondary">
              <TabsTrigger
                value={HouseholdType.INDIVIDUAL}
                className="w-full text-sm"
              >
                {INDIVIDUAL_HOUSEHOLD_NAME}
              </TabsTrigger>
              <TabsTrigger
                value={HouseholdType.PAIRS}
                className="w-full text-sm"
              >
                {PAIRS_HOUSEHOLD_NAME}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetHeader>
        <SheetHeader className="mt-2 text-xl text-left px-2 py-2 mb-1 border-l-4 bg-white border-primary">
          <div className="flex items-center">
            <PaperPlaneIcon className="h-5 w-5" />
            <h2 className="pl-2 text-xl text-left">LINE通知</h2>
          </div>
        </SheetHeader>
        <SheetClose asChild className="w-full">
          <Link href={`/${householdType}/addSpending`}>
            <div className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <ChevronRightIcon className="w-full h-full" />
              </div>
              <span className="ms-3">{ADD_SPENDING}</span>
            </div>
          </Link>
        </SheetClose>
        <SheetClose asChild className="w-full">
          <Link href={`/${householdType}/balanceByGenre`}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <ChevronRightIcon className="w-full h-full" />
              </div>
              <span className="ms-3">{BUDGET_BY_GENRE}</span>
            </div>
          </Link>
        </SheetClose>
        <SheetClose asChild className="w-full">
          <Link href={`/${householdType}/budgetByGenre`}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <ChevronRightIcon className="w-full h-full" />
              </div>
              <span className="ms-3">{BALANCE_BY_GENRE}</span>
            </div>
          </Link>
        </SheetClose>

        <SheetHeader className="mt-6 text-xl text-left px-2 py-2 mb-1 border-l-4 bg-white border-primary">
          <div className="flex items-center">
            <GearIcon className="h-6 w-6" />
            <h2 className="pl-2 text-xl text-left">{SETTINGS}</h2>
          </div>
        </SheetHeader>
        <SheetClose asChild className="w-full">
          <Link href={`/${householdType}/addSpending/settings`}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <ChevronRightIcon className="w-full h-full" />
              </div>
              <span className="ms-3">{ADD_SPENDING}</span>
            </div>
          </Link>
        </SheetClose>
        <SheetClose asChild className="w-full">
          <Link href={`/${householdType}/budgetByGenre/settings`}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <ChevronRightIcon className="w-full h-full" />
              </div>
              <span className="ms-3">{BUDGET_BY_GENRE}</span>
            </div>
          </Link>
        </SheetClose>
        <SheetClose asChild className="w-full">
          <Link href={`/${householdType}/balanceByGenre/settings`}>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
              <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <ChevronRightIcon className="w-full h-full" />
              </div>
              <span className="ms-3">{BALANCE_BY_GENRE}</span>
            </div>
          </Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default SideBar;
