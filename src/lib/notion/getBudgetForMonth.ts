import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./client";
import { BUDGET, GENRE, ORDER } from "./constants";
import { BudgetColumn } from "./types";

type Props = {
  month: number;
};

async function getBalanceForMonth({ month }: Props): Promise<BudgetColumn[]> {
  const data = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "月",
          select: {
            equals: `${month.toString()}月`,
          },
        },
      ],
    },
  });

  const results = data.results as DatabaseObjectResponse[];
  return results.map((result) => {
    // NOTE: notionから型探すのが難しいから、一旦any
    const genre = result.properties[GENRE] as any;
    const order = result.properties[ORDER] as any;
    const balance = result.properties[BUDGET] as any;

    return {
      genre: String(genre.title[0].plain_text),
      order: Number(order.number),
      budget: Number(balance.formula.number),
    };
  });
}

export default getBalanceForMonth;
