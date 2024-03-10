"use client";

import React, { FC, PropsWithChildren, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { state as liffProviderState } from "./store";

export const LiffProvider: FC<PropsWithChildren<{ liffId: string }>> = ({
  children,
  liffId,
}) => {
  const setLiffProvider = useSetRecoilState(liffProviderState);
  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import("@line/liff");
      const liff = liffModule.default;
      console.log("LIFF init...");

      await liff.init({ liffId });

      console.log("LIFF init succeeded.");
      setLiffProvider({ liff, liffError: null });
    } catch (error) {
      console.log("LIFF init failed.");
      setLiffProvider({ liff: null, liffError: (error as Error).toString() });
    }
  }, [liffId, setLiffProvider]);

  // init Liff
  useEffect(() => {
    console.log("LIFF init start...");
    initLiff();
  }, [initLiff]);

  return <>{children}</>;
};
