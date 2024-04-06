import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import AccountMenu from "./client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronRightIcon,
  HamburgerMenuIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { GearIcon } from "@radix-ui/react-icons";

function AppBar() {
  return (
    <Menubar className="sticky top-0 z-50 rounded-none w-full h-14 bg-primary flex justify-between">
      <div className="flex items-center">
        <MenubarMenu>
          <Sheet>
            <SheetTrigger asChild>
              <HamburgerMenuIcon className="w-8 h-8 py-2 mx-2 text-white" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mt-6 text-xl text-left px-2 py-1 mb-1 border-l-4">
                <div className="flex items-center">
                  <PaperPlaneIcon className="h-6 w-6" />
                  <h2 className="pl-2 text-xl text-left">LINE通知</h2>
                </div>
              </SheetHeader>
              <SheetClose asChild>
                <Link href={"/addSpending"}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <ChevronRightIcon className="w-full h-full" />
                    </div>
                    <span className="ms-3">支出の追加</span>
                  </div>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/balanceByGenre"}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <ChevronRightIcon className="w-full h-full" />
                    </div>
                    <span className="ms-3">項目別の予算</span>
                  </div>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/totalBalance"}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <ChevronRightIcon className="w-full h-full" />
                    </div>
                    <span className="ms-3">今月の残額</span>
                  </div>
                </Link>
              </SheetClose>

              <SheetHeader className="mt-6 text-xl text-left px-2 py-1 mb-1 border-l-4">
                <div className="flex items-center">
                  <GearIcon className="h-6 w-6" />
                  <h2 className="pl-2 text-xl text-left">設定</h2>
                </div>
              </SheetHeader>
              <SheetClose asChild>
                <Link href={"/settings"}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <ChevronRightIcon className="w-full h-full" />
                    </div>
                    <span className="ms-3">支出の追加</span>
                  </div>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/settings"}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <ChevronRightIcon className="w-full h-full" />
                    </div>
                    <span className="ms-3">項目別の予算</span>
                  </div>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={"/settings"}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      <ChevronRightIcon className="w-full h-full" />
                    </div>
                    <span className="ms-3">今月の残額</span>
                  </div>
                </Link>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </MenubarMenu>
        <MenubarMenu>
          <Link href="/">
            <h1 className="text-base text-white font-bold">かけちゃん</h1>
          </Link>
        </MenubarMenu>
      </div>

      {/* NOTE: 右寄せメニュー */}
      <div>
        <AccountMenu />
      </div>
    </Menubar>
  );
}

export default AppBar;
