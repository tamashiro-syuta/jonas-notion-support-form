import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "./client";
import { BALANCE } from "./constants";

type Props = {
  month: number;
  notionDBDatabaseId: string;
};

async function getTotalBalanceForMonth({
  month,
  notionDBDatabaseId,
}: Props): Promise<number> {
  const data = await notion.databases.query({
    database_id: notionDBDatabaseId,
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
