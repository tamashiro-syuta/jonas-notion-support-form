"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { Inputs, schema } from "./zod";
import { toast } from "sonner";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await fetch("/api", {
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
      toast.error("エラーが発生しました", {
        style: {
          background: "red",
          color: "white",
        },
        duration: 3000,
      });
      return;
    } else {
      toast.success("更新が完了しました", {
        style: {
          background: "green",
          color: "white",
        },
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full max-w-sm">
      {isSubmitting && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 bg-secondary bg-opacity-10 flex items-center justify-center"
          aria-label="読み込み中"
        >
          <div className="animate-spin h-12 w-12 bg-primary rounded-xl"></div>
        </div>
      )}
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
