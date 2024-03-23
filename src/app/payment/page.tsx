"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { clsx } from "clsx";
import { useLiff } from "@/components/custom/LiffProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@liff/get-profile";
import { Inputs, schema } from "./zod";
import Loading from "@/components/custom/Loading";
import { showError, showSuccess } from "@/lib/toast-actions";

export default function Page() {
  const { liff } = useLiff();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (liff) {
      (async () => {
        const user = await liff.getProfile();
        setUser(user);
      })();
    }
  }, [liff]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const isCorrectLineUser = () => {
    const correctLineUserIDs = [
      process.env.MY_LINE_USER_ID!,
      process.env.JONA_LINE_USER_ID!,
    ];
    if (!user) return false;

    return correctLineUserIDs.includes(user.userId);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!liff || !user) {
      showError({
        message: "まずは右上のアイコンボタンからログインしようか！！！",
      });
      return;
    }
    if (!isCorrectLineUser()) {
      showError({ message: "LINEアカウントが違います" });
      return;
    }

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genre: data.genre,
          amount: data.amount,
        }),
      });

      if (res.status > 400) {
        showError({ message: "エラーが発生しました" });
      } else {
        const message = `【支出の追加】\nカテゴリ: ${data.genre}\n金額: ${data.amount}円`;
        await fetch(`${window.location.origin}/api/lineBot`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            userID: user.userId,
          }),
        });
        await liff.closeWindow();
      }
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
    }
  };

  return (
    <div className="w-full max-w-sm">
      {isSubmitting && <Loading />}
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            項目
          </label>
          <select
            id="genre"
            className={clsx(
              "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
              errors.genre
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            )}
            {...register("genre")}
          >
            <option value="">-- 選択してください --</option>
            <option value="食費">食費</option>
            <option value="日用品">日用品</option>
            <option value="エンタメ">エンタメ</option>
          </select>
          {errors.genre && (
            <p className="text-red-500 text-xs italic my-1">
              項目を選択してください
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            金額
          </label>
          <input
            className={clsx(
              "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
              errors.amount
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            )}
            id="amount"
            type="number"
            placeholder="1000"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-red-500 text-xs italic my-1">
              金額を入力してください
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            disabled={isSubmitting}
            className="w-full bg-primary hover:text-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            どすこい !!!
          </button>
        </div>
      </form>
    </div>
  );
}
