import { NotionError } from "@/lib/Error";
import getGenresBudgetForMonth from "@/lib/notion/getGenresBudgetForMonth";
import updateBudget from "@/lib/notion/updateBudget";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  try {
    const genre = body.genre ? String(body.genre) : undefined;
    const amount = body.amount ? Number(body.amount) : undefined;
    if (!genre)
      return new Response("項目が選択されていません", { status: 400 });
    if (!amount)
      return new Response("金額が入力されていません", { status: 400 });
    if (isNaN(amount))
      return new Response("金額に数字ではない値が検出されました", {
        status: 400,
      });

    // NOTE: new Date().getMonth() は 0 から始まるため、 +1 する
    const thisMonth = new Date().getMonth() + 1;
    const budget = await getGenresBudgetForMonth({
      genre,
      month: thisMonth,
    });
    await updateBudget(budget, amount);

    return new Response("更新が完了しました", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof NotionError) {
      throw new Response(
        `NotionAPIにリクエスト時にエラーが発生しました。${error}`,
        {
          status: 500,
        }
      );
    }
    return new Response("更新に失敗しました", {
      status: 500,
    });
  }
}
