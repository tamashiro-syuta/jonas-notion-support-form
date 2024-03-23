import { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/line-messeging-api/client";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const message = req.body.message;
    // NOTE: 送りたいトークルームのユーザーIDかグループID
    const userID = req.body.userID;
    await client.pushMessage(userID, {
      type: "text",
      text: message,
    });

    res
      .status(200)
      .json({ message: `「${message}」というメッセージが送信されました。` });
  } catch (e) {
    res.status(500).json({ message: `error! ${e} ` });
  }
}
