import Link from "next/link";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import AccountMenu from "./account-menu";
import SideBar from "./side-bar";

function AppBar() {
  return (
    <Menubar className="sticky top-0 z-50 rounded-none w-full h-14 bg-secondary flex justify-between">
      <div className="flex items-center">
        <MenubarMenu>
          <SideBar />
        </MenubarMenu>
        <MenubarMenu>
          <Link href="/">
            <h1 className="text-base text-primary font-bold">かけちゃん</h1>
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
