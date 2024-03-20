import { Menubar } from "@/components/ui/menubar";
import AccountMenu from "./client";

function AppBar() {
  return (
    <Menubar className="sticky top-0 z-50 rounded-none w-full h-14 bg-primary flex justify-end">
      <AccountMenu />
    </Menubar>
  );
}

export default AppBar;
