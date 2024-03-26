import { z } from "zod";

export const schema = z.object({
  genre: z.string().min(1, { message: "選択してください" }),
  amount: z.coerce
    .number()
    .int()
    .min(1, { message: "１以上の数値を指定してください。" }),
});

export type Inputs = {
  genre: string;
  amount: number;
};
