"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HouseholdType } from "@prisma/client";
import {
  ADD_SPENDING,
  BALANCE_BY_GENRE,
  BUDGET_BY_GENRE,
  SETTINGS,
  INDIVIDUAL_HOUSEHOLD_NAME,
  PAIRS_HOUSEHOLD_NAME,
} from "@/lib/constants";

export const SideBar = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const householdType = isChecked
    ? HouseholdType.PAIRS
    : HouseholdType.INDIVIDUAL;

  const isPairs = householdType === HouseholdType.PAIRS;
  const selectedHouseholdType = isPairs
    ? PAIRS_HOUSEHOLD_NAME
    : INDIVIDUAL_HOUSEHOLD_NAME;
  const unselectedHouseholdType = isPairs
    ? INDIVIDUAL_HOUSEHOLD_NAME
    : PAIRS_HOUSEHOLD_NAME;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <HamburgerMenuIcon className="w-8 h-8 py-2 mx-2 text-white" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className={clsx(isPairs ? "bg-cyan-50" : "bg-neutral-100")}
      >
        <SheetHeader className="text-left px-2">
          <Label className="text-2xl">{selectedHouseholdType}</Label>
          <div className="flex items-center justify-end space-x-2 pt-2">
            <Label className="text-sm">{unselectedHouseholdType}</Label>
            <Switch
              checked={isPairs}
              onCheckedChange={setIsChecked}
              className={clsx(
                isPairs
                  ? "data-[state=checked]:bg-cyan-800"
                  : "data-[state=unchecked]:bg-neutral-800"
              )}
            />
          </div>
        </SheetHeader>
        <SheetHeader
          className={clsx(
            "mt-6 text-xl text-left px-2 py-2 mb-1 border-l-4 bg-white",
            isPairs ? "border-cyan-800" : "border-neutral-800"
          )}
        >
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

        <SheetHeader
          className={clsx(
            "mt-6 text-xl text-left px-2 py-2 mb-1 border-l-4 bg-white",
            isPairs ? "border-cyan-800" : "border-neutral-800"
          )}
        >
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
