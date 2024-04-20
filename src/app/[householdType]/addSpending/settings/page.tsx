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
import { bulkUpdateIsSpending } from "@/app/actions/db/genre";
import { showError, showSuccess } from "@/lib/toast-actions";
import { useRouter } from "next/navigation";
import {
  castHouseholdType,
  matchHouseholdType,
} from "@/lib/db/matchHouseholdType";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
      if (index === 0)
        return {
          checkbox: null,
          [genre.genre]: genre.isSpending,
        };
      return { ...acc, [genre.genre]: genre.isSpending };
    }, {}),
  });

  // NOTE: ex) values === { "項目名": true, "項目名2": false }
  async function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
    const changedGenres: Genre[] = [];

    for (const key in values) {
      const keysGenre = genres.filter((genre) => genre.genre === key)[0];
      const inputBalance = (values as any)[key];
      const valueIsChanged = inputBalance !== keysGenre.isSpending;

      const newGenre: Genre = {
        ...keysGenre,
        isSpending: inputBalance,
      };

      if (valueIsChanged) changedGenres.push(newGenre);
    }

    if (!user) return showError({ message: "ユーザー情報が取得できません" });

    try {
      setLoading(true);
      await bulkUpdateIsSpending({
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

  const changeAllTrue = () => {
    genres.forEach((genre) => {
      form.setValue(genre.genre as never, true as never);
    });
  };

  const changeAllFalse = () => {
    genres.forEach((genre) => {
      form.setValue(genre.genre as never, false as never);
    });
  };

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

      console.log(genres);

      form.reset(
        genres.reduce((acc, genre, index) => {
          if (index === 0) return { [genre.genre]: genre.isSpending };
          return { ...acc, [genre.genre]: genre.isSpending };
        }, {}),
        {}
      );
    } catch (error) {
      showError({ message: `${error}` });
      router.push("/settings");
    }
  }, [form, householdType, router, user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  console.log("form", form.getValues());

  if (loading) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mx-2">
        <div className="flex flex-row items-center justify-center mt-2 px-2 pt-2">
          <p className="basis-1/2 text-xl w-full pb-2">支出項目の設定</p>
          <div className="basis-1/2 flex flex-row justify-end">
            <FormField
              control={form.control}
              name={"checkbox" as never}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl className="flex flex-row justify-end">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 justify-end"
                    >
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem
                            value="all-selected"
                            id="all-selected"
                            className="h-5 w-5"
                            onClick={changeAllTrue}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">全選択</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="clear"
                          id="clear"
                          className="h-5 w-5"
                          onClick={changeAllFalse}
                        />
                        <FormLabel className="font-normal">クリア</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <RadioGroup className="basis-1/2 flex justify-end">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="all-selected"
                id="all-selected"
                className="h-5 w-5"
                onClick={changeAllTrue}
              />
              <Label htmlFor="all-selected">全選択</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="clear"
                id="clear"
                className="h-5 w-5"
                onClick={changeAllFalse}
              />
              <Label htmlFor="clear">クリア</Label>
            </div>
          </RadioGroup> */}
        </div>
        {genres.map((genre) => (
          <FormField
            key={genre.id}
            control={form.control}
            name={genre.genre as never}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between md:p-3 py-2 px-3">
                <FormLabel>{genre.genre}</FormLabel>
                <FormMessage />
                <FormControl
                  onClick={() => {
                    console.log("asdfasdf");
                    form.setValue("checkbox" as never, undefined as never);
                  }}
                >
                  <Switch
                    defaultChecked={genre.isSpending}
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
