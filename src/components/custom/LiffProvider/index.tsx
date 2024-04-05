"use client";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Liff } from "@line/liff";
import { Profile } from "@line/bot-sdk";

const LiffContext = createContext<{
  liff: Liff | null;
  user: Profile | null;
  liffError: string | null;
}>({ liff: null, user: null, liffError: null });

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: FC<PropsWithChildren<{ liffId: string }>> = ({
  children,
  liffId,
}) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import("@line/liff");
      const liff = liffModule.default;
      console.log("LIFF init...");

      await liff.init({ liffId });

      console.log("LIFF init succeeded.");
      setLiff(liff);

      const user = await liff.getProfile();
      setUser(user);
      console.log("user setting succeeded.");
    } catch (error) {
      console.log("LIFF init failed.");
      setLiffError((error as Error).toString());
    }
  }, [liffId]);

  // init Liff
  useEffect(() => {
    const init = async () => {
      console.log("LIFF init start...");
      await initLiff();
    };

    init();
  }, [initLiff]);

  return (
    <LiffContext.Provider
      value={{
        liff,
        user,
        liffError,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};
