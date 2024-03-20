"use client";

import { useLiff } from "@/components/custom/LiffProvider";
import { Button } from "@/components/ui/button";

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
        console.log("message sent");
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <div className="w-full max-w-sm">
      <Button onClick={onSubmit}>ほげ</Button>
    </div>
  );
}
