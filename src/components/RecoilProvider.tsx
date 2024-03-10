"use client";

import { RecoilRoot } from "recoil";

interface Props {
  children: React.ReactNode;
}

const RecoilProvider = ({ children }: Props) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default RecoilProvider;
