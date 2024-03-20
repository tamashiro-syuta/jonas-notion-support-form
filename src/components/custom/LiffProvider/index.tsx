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
import { toast } from "sonner";

const LiffContext = createContext<{
  liff: Liff | null;
  liffError: string | null;
}>({ liff: null, liffError: null });

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: FC<PropsWithChildren<{ liffId: string }>> = ({
  children,
  liffId,
}) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import("@line/liff");
      const liff = liffModule.default;
      console.log("LIFF init...");

      await liff.init({ liffId });

      console.log("LIFF init succeeded.");
      toast.success("LIFF init succeeded.", {
        style: {
          background: "green",
          color: "white",
        },
        duration: 3000,
      });
      setLiff(liff);
    } catch (error) {
      console.log("LIFF init failed.");
      toast.error("LIFF init failed.", {
        style: {
          background: "red",
          color: "white",
        },
        duration: 3000,
      });
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
        liffError,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};
