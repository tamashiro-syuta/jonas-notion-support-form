import { atom, selector, useRecoilValue } from "recoil";
import { Liff } from "@line/liff";

const key = "liffProvider";

interface LiffProvider {
  liff: Liff | null;
  liffError: string | null;
}

export const state = atom<LiffProvider>({
  key: `${key}/atom`,
  default: {
    liff: null,
    liffError: null,
  },
});

const liff = selector({
  key: `${key}/selector/liff`,
  get: ({ get }) => {
    const { liff } = get(state);

    return liff;
  },
});

export const selectors = {
  useLiff: () => useRecoilValue(liff),
};
