export const loginUserGuard = (lineUserId: string) => {
  // NOTE: 2人しか使わないので、DBに通信せず環境変数で弾くようにして、通信回数を減らす
  if (lineUserId === process.env.MY_LINE_USER_ID) return;
  if (lineUserId === process.env.JONA_LINE_USER_ID) return;

  throw new Error("ユーザーIDが不正です");
};
