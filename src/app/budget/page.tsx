"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const { liff } = useLiff();

  const onSubmit = async () => {
    await liff
      ?.sendMessages([
        {
          type: "text",
          text: "Hello, World!",
        },
      ])
      .then(() => {
        toast.error("送ったよ", {
          style: {
            background: "red",
            color: "white",
          },
          duration: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(`エラーが発生しました : ${err.message}`, {
          style: {
            background: "red",
            color: "white",
          },
          duration: 3000,
        });
      });
  };

  return (
    <div className="w-full max-w-sm">
      <Button onClick={onSubmit}>ほげ</Button>
    </div>
  );
}
