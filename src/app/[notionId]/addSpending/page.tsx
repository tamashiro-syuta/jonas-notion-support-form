"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { clsx } from "clsx";
import { useLiff } from "@/components/custom/LiffProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inputs, schema } from "./zod";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { sendMessage } from "../../actions/sendMessage";
import { addSpending } from "../../actions/addSpending";
import { fetchSpendingGenres } from "@/app/actions/db/genre";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    notionId: string;
  };
}

export default function Page({ params: { notionId } }: Props) {
  const router = useRouter();
  const { liff, user } = useLiff();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAndSetBudget = useCallback(async () => {
    if (!liff || !user) {
      showError({
        message: "まずは右上のアイコンボタンからログインしようか！！！",
      });
      return;
    }

    try {
      const genres = await fetchSpendingGenres({
        userID: user.userId,
        notionDBId: Number(notionId),
      });

      setGenres(genres);
      setLoading(false);
    } catch (error) {
      showError({ message: `${error}` });
      router.push("/");
    }
  }, [liff, notionId, router, user]);

  useEffect(() => {
    fetchAndSetBudget();
  }, [fetchAndSetBudget]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ genre, amount }) => {
    if (!liff || !user) {
      showError({
        message: "まずは右上のアイコンボタンからログインしようか！！！",
      });
      return;
    }

    try {
      await addSpending({ userID: user.userId, genre, amount });

      const message = `【支出の追加】\nカテゴリ: ${genre}\n金額: ${amount}円`;
      const userID = user.userId;
      await sendMessage({ message, userID });

      await liff.closeWindow();
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
    }
  };

  if (loading) return <Loading />;

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
            {genres.map((genre) => (
              <option key={genre.id} value={genre.genre}>
                {genre.genre}
              </option>
            ))}
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
