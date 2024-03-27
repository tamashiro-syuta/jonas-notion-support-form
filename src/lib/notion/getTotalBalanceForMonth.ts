import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./client";
import { BALANCE } from "./constants";

type Props = {
  month: number;
};

async function getTotalBalanceForMonth({ month }: Props): Promise<number> {
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
  const balances = results.map((result) => {
    // NOTE: notionから型探すのが難しいから、一旦any
    const balance = result.properties[BALANCE] as any;

    return Number(balance.formula.number);
  });

  console.log(balances.reduce((acc, cur) => acc + cur, 0));

  return balances.reduce((acc, cur) => acc + cur, 0);
}

export default getTotalBalanceForMonth;
