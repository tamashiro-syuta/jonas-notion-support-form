import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Button
        asChild
        className="flex-1 flex items-center justify-center bg-red-400 border-8 hover:border-background rounded-xl w-full hover:bg-white hover:text-red-400 hover:border-red-400 hover:rounded-xl"
      >
        <Link href="/payment" className="text-9xl">
          支出
        </Link>
      </Button>

      <Button
        asChild
        className="flex-1 flex items-center justify-center bg-blue-400 border-8 hover:border-background rounded-xl w-full hover:bg-white hover:text-blue-400 hover:border-blue-400 hover:rounded-xl"
      >
        <Link href="/hoge" className="text-9xl">
          表示
        </Link>
      </Button>
    </main>
  );
}
