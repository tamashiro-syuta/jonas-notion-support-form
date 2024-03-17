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

const getUser = selector({
  key: `${key}/selector/liff/getUser`,
  get: async ({ get }) => {
    const { liff } = get(state);
    if (!liff) return null;

    const user = await liff.getProfile();

    return user;
  },
});

const getIsLogin = selector({
  key: `${key}/selector/liff/getIsLogin`,
  get: async ({ get }) => {
    const { liff } = get(state);
    if (!liff) return null;

    return await liff.isLoggedIn();
  },
});

export const selectors = {
  useLiff: () => useRecoilValue(liff),
  useUser: () => useRecoilValue(getUser),
  useIsLogin: () => useRecoilValue(getIsLogin),
};
