import { notion } from "./client";
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NotionError } from "@/lib/Error";

type Props = {
  genre: string;
  month: number;
  notionDBDatabaseId: string;
};

export type Record =
  | PageObjectResponse
  | PartialPageObjectResponse
  | PartialDatabaseObjectResponse
  | DatabaseObjectResponse;

// NOTE: 指定の月 かつ 項目が 引数の値 のレコードを取得
async function getGenresBudgetForMonth({
  genre,
  month,
  notionDBDatabaseId,
}: Props): Promise<Record> {
  try {
    const budget = await notion.databases.query({
      database_id: notionDBDatabaseId,
      filter: {
        and: [
          {
            property: "月",
            select: {
              equals: `${month.toString()}月`,
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
      throw new NotionError("選択した項目が見つかりませんでした");

    return record;
  } catch (error) {
    throw new Error(`エラーが発生しました。${error}`);
  }
}

export default getGenresBudgetForMonth;
