import { notion } from "../notion-client";
import { SPENDING } from "./constants";

// TODO: recordの型を指定する

// NOTE: レコードの単体データが入る
async function updateBudget(record: any, addAmount = 0) {
  const assetRecordsAmount = record.properties[SPENDING]?.number || 0;
  await notion.pages.update({
    page_id: record.id,
    properties: {
      [SPENDING]: {
        type: "number",
        number: assetRecordsAmount + addAmount,
      },
    },
  });
}

export default updateBudget;
