import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import AccountMenu from "./client";

function AppBar() {
  return (
    <Menubar className="sticky top-0 z-50 rounded-none w-full h-14 bg-primary flex justify-between">
      {/* NOTE: 左寄せメニュー */}
      <div className="flex items-center">
        <MenubarMenu>
          <Sheet>
            <SheetTrigger asChild>
              <HamburgerMenuIcon className="w-8 h-8 py-2 mx-2 text-white" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
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
