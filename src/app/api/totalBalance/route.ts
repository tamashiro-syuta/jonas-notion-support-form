import getTotalBalanceForMonth from "@/lib/notion/getTotalBalanceForMonth";

export async function GET(_req: Request, _res: Response) {
  try {
    const thisMonth = new Date().getMonth() + 1;
    const totalBalanceForMonth = await getTotalBalanceForMonth({
      month: thisMonth,
    });

    return new Response(totalBalanceForMonth.toString(), {
      status: 200,
    });
  } catch (error) {
    return new Response("取得に失敗しました", {
      status: 500,
    });
  }
}
