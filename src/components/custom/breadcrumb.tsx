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

const CUSTOM_I18_PATH_LIST = [
  { en: "addSpending", ja: "支出の追加" },
  { en: "balanceByGenre", ja: "項目別 残高" },
  { en: "budgetByGenre", ja: "項目別 予算" },
  { en: "totalBalance", ja: "合計残高" },
  { en: "budget", ja: "予算" },
  { en: "user", ja: "アカウント" },
  { en: "settings", ja: "設定" },
];

export function Breadcrumb() {
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
    <BreadcrumbComponent>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
}
