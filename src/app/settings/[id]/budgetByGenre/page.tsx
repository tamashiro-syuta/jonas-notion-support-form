"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLiff } from "@/components/custom/LiffProvider";
import { Genre } from "@prisma/client";
import { fetchGenres } from "@/app/actions/db/genre";
import Loading from "@/components/custom/Loading";
import { Switch } from "@/components/ui/switch";
import { bulkUpdateIsBudget } from "@/app/actions/db/genre";
import { showError, showSuccess } from "@/lib/toast-actions";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const Page = ({ params: { id } }: Props) => {
  const router = useRouter();
  const { user } = useLiff();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const dynamicFormSchema = genres.reduce((acc, genre) => {
    return acc.merge(
      z.object({
        [genre.genre]: z.boolean(),
      })
    );
  }, z.object({}));

  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: genres.reduce((acc, genre, index) => {
      if (index === 0) return { [genre.genre]: genre.isBudget };
      return { ...acc, [genre.genre]: genre.isBudget };
    }, {}),
  });

  // NOTE: ex) values === { "項目名": true, "項目名2": false }
  async function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
    const changedGenres: Genre[] = [];

    for (const key in values) {
      const keysGenre = genres.filter((genre) => genre.genre === key)[0];
      const inputBalance = (values as any)[key];
      const valueIsChanged = inputBalance !== keysGenre.isBudget;

      const newGenre: Genre = {
        ...keysGenre,
        isBudget: inputBalance,
      };

      if (valueIsChanged) changedGenres.push(newGenre);
    }

    if (!user) return showError({ message: "ユーザー情報が取得できません" });

    try {
      setLoading(true);
      await bulkUpdateIsBudget({
        userID: user.userId,
        genres: changedGenres,
      });
      showSuccess({ message: "更新しました" });
    } catch (error) {
      showError({ message: `更新に失敗しました, ${error}` });
    } finally {
      setLoading(false);
    }
  }

  const fetch = useCallback(async () => {
    if (!user) return;

    try {
      const genres = await fetchGenres({
        userID: user.userId,
        notionDBId: Number(id),
      });
      setGenres(genres);
      setLoading(false);

      form.reset(
        genres.reduce((acc, genre, index) => {
          if (index === 0) return { [genre.genre]: genre.isBudget };
          return { ...acc, [genre.genre]: genre.isBudget };
        }, {}),
        {}
      );
    } catch (error) {
      showError({ message: `${error}` });
      router.push("/settings");
    }
  }, [form, id, router, user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mx-2">
        <p className="text-lg mt-2 px-2 pt-2 font-bold w-full">
          項目ごとの予算設定
        </p>
        {genres.map((genre) => (
          <FormField
            key={genre.id}
            control={form.control}
            name={genre.genre as never}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between md:p-3 py-1 px-3">
                <FormLabel>{genre.genre}</FormLabel>
                <FormMessage />
                <FormControl>
                  <Switch
                    defaultChecked={genre.isBudget}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="w-full">
          更新
        </Button>
      </form>
    </Form>
  );
};

export default Page;
