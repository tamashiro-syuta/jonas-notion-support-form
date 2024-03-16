"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";
import { Profile } from "@liff/get-profile";
import { PersonIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { selectors } from "../LiffProvider/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AccountMenu = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const liff = selectors.useLiff();

  if (liff?.isLoggedIn()) {
    (async () => {
      const profile = await liff.getProfile();

      console.log("profile", profile);
      setProfile(profile);
    })();
  } else {
    // NOTE: 本番環境ではログインを必須にする
    if (process.env.NODE_ENV === "production") {
      liff?.login();
    }
  }

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
                toast.success("ログアウトしました", {
                  style: {
                    background: "green",
                    color: "white",
                  },
                  duration: 3000,
                });
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
