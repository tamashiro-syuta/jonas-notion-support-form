"use client";

import { SlashIcon } from "@radix-ui/react-icons";

import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { HouseholdType } from "@prisma/client";
import {
  ADD_SPENDING,
  BALANCE_BY_GENRE,
  BUDGET_BY_GENRE,
  INDIVIDUAL_HOUSEHOLD_NAME,
  PAIRS_HOUSEHOLD_NAME,
  SETTINGS,
} from "@/lib/constants";

interface Props {
  className?: string;
}

const CUSTOM_I18_PATH_LIST = [
  { en: HouseholdType.INDIVIDUAL, ja: INDIVIDUAL_HOUSEHOLD_NAME },
  { en: HouseholdType.PAIRS, ja: PAIRS_HOUSEHOLD_NAME },
  { en: "addSpending", ja: ADD_SPENDING },
  { en: "balanceByGenre", ja: BALANCE_BY_GENRE },
  { en: "budgetByGenre", ja: BUDGET_BY_GENRE },
  { en: "totalBalance", ja: "合計残高" },
  { en: "budget", ja: "予算" },
  { en: "user", ja: "アカウント" },
  { en: "settings", ja: SETTINGS },
];

export function Breadcrumb(props: Props) {
  const path = usePathname();

  const pathNames = path.split("/").filter((p) => p !== "");
  const i18nPathName = (path: string): string => {
    const translateToJapanese = CUSTOM_I18_PATH_LIST.find(
      (p) => p.en === path
    )?.ja;

    return translateToJapanese || path;
  };

  const createLink = (path: string, currentPath: string): string => {
    return path.split(currentPath)[0] + currentPath;
  };

  const breadcrumbItems = pathNames.map((pathName, index) => {
    return (
      <div key={pathName} className="flex items-center">
        <BreadcrumbSeparator className="pr-2">
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem key={index}>
          <BreadcrumbLink href={createLink(path, pathName)}>
            {i18nPathName(pathName)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </div>
    );
  });

  return (
    <BreadcrumbComponent className={props.className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
