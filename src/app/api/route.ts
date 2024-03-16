import { notion } from "@/lib/notion-client";

// NOTE: 未設定 かつ ジャンルが 引数の値 のレコードを取得
async function getGenresBudget(genre: string) {
  const budget = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "月",
          select: {
            equals: "未設定",
          },
        },
        {
          property: "項目",
          title: {
            equals: genre,
          },
        },
      ],
    },
  });

  // NOTE: この時点でレコードは1つしかないので、初めの値を取得
  const record = budget.results[0];

  if (!record?.object)
    return new Response("選択した項目が見つかりませんでした", { status: 400 });

  return record;
}

// NOTE: レコードの単体データが入る
async function updateBudget(record: any, addAmount = 0) {
  // const updateProperty = "支出額";
  const UPDATE_PROPERTY = "支出額";
  const assetRecordsAmount = record.properties[UPDATE_PROPERTY]?.number || 0;

  const updateResponse = await notion.pages.update({
    page_id: record.id,
    properties: {
      [UPDATE_PROPERTY]: {
        type: "number",
        number: assetRecordsAmount + addAmount,
      },
    },
  });

  console.log(updateResponse);
}

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  console.log("exec on server", body);

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
    const budget = await getGenresBudget(genre);
    await updateBudget(budget, amount);

    return new Response("更新が完了しました", {
      status: 200,
    });
  } catch (error) {
    return new Response("更新に失敗しました", {
      status: 500,
    });
  }
}
