export class NotionError extends Error {
  static {
    this.prototype.name = "NotionError";
  }

  constructor(message = "Notion API へのリクエストでエラーが発生しました") {
    super(message);
  }
}
