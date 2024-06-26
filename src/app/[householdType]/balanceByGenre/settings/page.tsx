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
import { bulkUpdateIsBalance } from "@/app/actions/db/genre";
import { showError, showSuccess } from "@/lib/toast-actions";
import { useRouter } from "next/navigation";
import {
  castHouseholdType,
  matchHouseholdType,
} from "@/lib/db/matchHouseholdType";

interface Props {
  params: {
    householdType: string;
  };
}

const Page = ({ params: { householdType } }: Props) => {
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
      if (index === 0) return { [genre.genre]: genre.isBalance };
      return { ...acc, [genre.genre]: genre.isBalance };
    }, {}),
  });

  // NOTE: ex) values === { "項目名": true, "項目名2": false }
  async function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
    const changedGenres: Genre[] = [];

    for (const key in values) {
      const keysGenre = genres.filter((genre) => genre.genre === key)[0];
      const inputBalance = (values as any)[key];
      const valueIsChanged = inputBalance !== keysGenre.isBalance;

      const newGenre: Genre = {
        ...keysGenre,
        isBalance: inputBalance,
      };

      if (valueIsChanged) changedGenres.push(newGenre);
    }

    if (!user) return showError({ message: "ユーザー情報が取得できません" });

    try {
      setLoading(true);
      await bulkUpdateIsBalance({
        lineUserId: user.userId,
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
    if (!matchHouseholdType(householdType)) {
      showError({ message: "不適切な値が指定されています" });
      router.push("/");
    }

    try {
      const genres = await fetchGenres({
        lineUserId: user.userId,
        householdType: castHouseholdType(householdType),
      });
      setGenres(genres);
      setLoading(false);

      form.reset(
        genres.reduce((acc, genre, index) => {
          if (index === 0) return { [genre.genre]: genre.isBalance };
          return { ...acc, [genre.genre]: genre.isBalance };
        }, {}),
        {}
      );
    } catch (error) {
      showError({ message: `${error}` });
      router.push("/");
    }
  }, [form, householdType, router, user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mx-2">
        <p className="text-lg mt-2 px-2 pt-2 w-full">項目ごとの残高設定</p>
        {genres.map((genre) => (
          <FormField
            key={genre.id}
            control={form.control}
            name={genre.genre as never}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between md:p-3 py-2 px-3">
                <FormLabel>{genre.genre}</FormLabel>
                <FormMessage />
                <FormControl>
                  <Switch
                    defaultChecked={genre.isBalance}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-stone-600 data-[state=unchecked]:bg-stone-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button
          variant="secondary"
          type="submit"
          className="w-full shadow bg-secondary hover:text-primary hover:bg-stone-200 text-primary py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          更新
        </Button>
      </form>
    </Form>
  );
};

export default Page;
