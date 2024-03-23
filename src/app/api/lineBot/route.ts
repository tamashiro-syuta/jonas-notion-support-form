import client from "@/lib/line-messeging-api/client";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const message = body.message ? String(body.message) : undefined;
  const userID = body.userID ? String(body.userID) : undefined;
  if (!message)
    return new Response("メッセージが入力されていません", { status: 400 });
  if (!userID)
    return new Response("ユーザーIDが入力されていません", { status: 400 });

  try {
    await client.pushMessage(userID, {
      type: "text",
      text: message,
    });

    return new Response(`「${message}」というメッセージが送信されました。`, {
      status: 200,
    });
  } catch (error) {
    return new Response(`更新に失敗しました。${error}`, {
      status: 500,
    });
  }
}
