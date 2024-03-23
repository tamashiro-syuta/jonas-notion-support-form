import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "../notion-client";
import { BALANCE, GENRE } from "./constants";

type Props = {
  month: number;
};

export type Balance = {
  genre: string;
  balance: number;
};

async function getBalanceForMonth({ month }: Props): Promise<Balance[]> {
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
    const balance = result.properties[BALANCE] as any;

    return {
      genre: String(genre.title[0].plain_text),
      balance: Number(balance.formula.number),
    };
  });
}

export default getBalanceForMonth;