"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useEffect, useState } from "react";
import { Profile } from "@liff/get-profile";
import { PersonIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLiff } from "../LiffProvider";
import { showSuccess } from "@/lib/toast-actions";

export const AccountMenu = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { liff } = useLiff();

  useEffect(() => {
    if (liff?.isLoggedIn()) {
      (async () => {
        const profile = await liff!.getProfile();

        console.log("profile", profile);
        setProfile(profile);
      })();
    }
  }, [liff]);

  return (
    <div id="account-icon">
      {profile ? (
        <MenubarMenu>
          <MenubarTrigger>
            <Avatar>
              <AvatarImage src={profile.pictureUrl} />
              <AvatarFallback>{profile.displayName}</AvatarFallback>
            </Avatar>
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem
              onClick={() => {
                liff?.logout();
                showSuccess({ message: "ログアウトしました" });
                location.reload();
              }}
            >
              ログアウト
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      ) : (
        <MenubarMenu>
          <MenubarTrigger>
            <Avatar>
              <PersonIcon className="w-full h-full py-2 bg-white" />
            </Avatar>
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem
              onClick={() => {
                liff?.login();
              }}
            >
              LINE ログイン
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      )}
    </div>
  );
};

export default AccountMenu;
