import Loading from "@/components/custom/Loading";

export default function Home() {
  // NOTE: ルートに遷移するのは、ログイン後にリダイレクトのみで、その後も別ページへ遷移されるので、ローディングUIを表示しておく
  return <Loading />;
}
