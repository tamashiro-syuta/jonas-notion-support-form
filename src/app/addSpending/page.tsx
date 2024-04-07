"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { clsx } from "clsx";
import { useLiff } from "@/components/custom/LiffProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inputs, schema } from "./zod";
import Loading from "@/components/custom/Loading";
import { showError } from "@/lib/toast-actions";
import { sendMessage } from "../actions/sendMessage";
import { addSpending } from "../actions/addSpending";
import { fetchDefaultNotionDB } from "../actions/db/notionDB";
import { Genre, NotionDB } from "@prisma/client";
import { fetchSpendingGenres } from "../actions/db/genre";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { liff, user } = useLiff();
  const [db, setDb] = useState<NotionDB | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAndSetBudget = useCallback(async () => {
    if (!liff || !user) return;

    try {
      const db = await fetchDefaultNotionDB({ lineUserId: user.userId });
      const genres = await fetchSpendingGenres({
        lineUserId: user.userId,
        notionDBId: Number(db.id),
      });

      setDb(db);
      setGenres(genres);
      setLoading(false);
    } catch (error) {
      showError({ message: `${error}`, duration: 50000 });
      router.push("/");
    }
  }, [liff, router, user]);

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
    if (!liff || !user) return;
    if (!db) {
      const message = "DBが見つかりませんでした。管理者に連絡してください。";
      showError({ message });
      return;
    }

    try {
      const lineUserId = user.userId;
      const notionDBId = db.id;
      await addSpending({ lineUserId, notionDBId, genre, amount });

      const message = `【支出の追加】\n項目: ${genre}\n金額: ${amount}円`;
      await sendMessage({ message, lineUserId });

      await liff.closeWindow();
    } catch (error) {
      showError({ message: `エラーが発生しました。${error}`, duration: 5000 });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      {isSubmitting && <Loading />}
      <form
        className="bg-white rounded pt-2 mb-4"
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
