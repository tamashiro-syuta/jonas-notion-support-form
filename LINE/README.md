# LINE ディレクトリについて
## `image` ディレクトリ
- リッチメニューで使用する画像を格納するディレクトリ

## リッチメニューの変更の仕方
- 基本的には下述してあるコマンド手順で対応できるが、より複雑なリッチメニューの変更を行う際は、以下のサイトを参考に変更する
  - https://developers.line.biz/ja/docs/messaging-api/switch-rich-menus/#richmenu-switch-01

- 読み替えが必要な箇所
  - Headerの `Bearer Token` にチャンネルアクセストークン
    - ※ 小数点は利用できないので注意
  - `uri` にリッチメニューを選択した際に遷移するLIFFのURL

***※ 画像のサイズに変更があった場合は、サイズや座標の変更が必要になるので、その都度頑張って変更しよう！！！***

### 個人家計簿 のリッチメニューを設定
- 変更箇所を読み替えて、下記を実行

1. リッチメニュータップ時の処理をプロット
    ```bash
    curl -v -X POST https://api.line.me/v2/bot/richmenu \
    -H 'Authorization: Bearer {ここに channel access token}' \
    -H 'Content-Type: application/json' \
    -d \
    '{
        "size": {
            "width": 800,
            "height": 540
        },
        "selected": true,
        "name": "richmenu-individual-v4",
        "chatBarText": "メニュー",
        "areas": [
            # TODO: ---------- タブ切り替え 部分 ----------
            {
                "bounds": {
                    "x": 400,
                    "y": 0,
                    "width": 400,
                    "height": 60
                },
                "action": {
                    "type": "richmenuswitch",
                    "richMenuAliasId": "richmenu-alias-pairs-v4",
                    "data": "richmenu-changed-to-pairs-v4"
                }
            },
            # TODO: ---------- 支出の記録 部分 ----------
            {
                "bounds": {
                    "x": 0,
                    "y": 60,
                    "width": 800,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/INDIVIDUAL/addSpending"
                }
            },
            # TODO: ---------- 今日の予算 部分 ----------
            {
                "bounds": {
                    "x": 0,
                    "y": 300,
                    "width": 267,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/INDIVIDUAL/budgetByGenre"
                }
            },
            # TODO: ---------- 今月の残り 部分 ----------
            {
                "bounds": {
                    "x": 266,
                    "y": 300,
                    "width": 267,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/INDIVIDUAL/balanceByGenre"
                }
            },
            # TODO: ---------- 設定 部分 ----------
            {
                "bounds": {
                    "x": 532,
                    "y": 300,
                    "width": 266,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/INDIVIDUAL/settings"
                }
            }
        ]
    }'
    ```

2. 以下のレスポンスが返ってくるので、どこかにメモとして残しておく（後で使うから）
    ```json
    { "richMenuId": "richmenu-xxxxxx" }
    ```

3. 画像のアップロード
    - 画像のファイル名に変更があった場合は読み替える
    ```bash
    curl -v -X POST https://api-data.line.me/v2/bot/richmenu/richmenu-xxxxxx/content \
    -H 'Authorization: Bearer {ここに channel access token}' \
    -H "Content-Type: image/png" \
    -T LINE/image/richmenu-individual.png
    ```

4. リッチメニューをデフォルトにする
    ```bash
    curl -v -X POST https://api.line.me/v2/bot/user/all/richmenu/richmenu-xxxxxx \
    -H 'Authorization: Bearer {ここに channel access token}'
    ```

5. リッチメニューのエイリアスを作成
    ```bash
    curl -v -X POST https://api.line.me/v2/bot/richmenu/alias \
    -H 'Authorization: Bearer {ここに channel access token}' \
    -H 'Content-Type: application/json' \
    -d \
    '{
        "richMenuAliasId": "richmenu-alias-individual-v4",
        "richMenuId": "richmenu-xxxxxxx"
    }'
    ```

6. 終了！！！！！

### 同棲家計簿 のリッチメニューを設定
- 同じく、変更箇所を読み替えて、下記を実行

1. リッチメニュータップ時の処理をプロット
    ```bash
    curl -v -X POST https://api.line.me/v2/bot/richmenu \
    -H 'Authorization: Bearer {ここに channel access token}' \
    -H 'Content-Type: application/json' \
    -d \
    '{
        "size": {
            "width": 800,
            "height": 540
        },
        "selected": true,
        "name": "richmenu-pairs-v4",
        "chatBarText": "メニュー",
        "areas": [
            # TODO: ---------- タブ切り替え 部分 ----------
            {
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 400,
                    "height": 60
                },
                "action": {
                    "type": "richmenuswitch",
                    "richMenuAliasId": "richmenu-alias-individual-v4",
                    "data": "richmenu-changed-to-individual-v4"
                }
            },
            # TODO: ---------- 支出の記録 部分 ----------
            {
                "bounds": {
                    "x": 0,
                    "y": 60,
                    "width": 800,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/PAIRS/addSpending"
                }
            },
            # TODO: ---------- 今日の予算 部分 ----------
            {
                "bounds": {
                    "x": 0,
                    "y": 300,
                    "width": 267,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/PAIRS/budgetByGenre"
                }
            },
            # TODO: ---------- 今月の残り 部分 ----------
            {
                "bounds": {
                    "x": 266,
                    "y": 300,
                    "width": 267,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/PAIRS/balanceByGenre"
                }
            },
            # TODO: ---------- 設定 部分 ----------
            {
                "bounds": {
                    "x": 532,
                    "y": 300,
                    "width": 266,
                    "height": 240
                },
                "action": {
                    "type": "uri",
                    "uri": "https://liff.line.me/{ ここに liff id }/PAIRS/settings"
                }
            }
        ]
    }'
    ```

2. 以下のレスポンスが返ってくるので、どこかにメモとして残しておく（後で使うから）
    ```json
    { "richMenuId": "richmenu-xxxxxx" }
    ```

3. 画像のアップロード
    - 画像のファイル名に変更があった場合は読み替える
    ```bash
    curl -v -X POST https://api-data.line.me/v2/bot/richmenu/richmenu-xxxxxx/content \
    -H 'Authorization: Bearer {ここに channel access token}' \
    -H "Content-Type: image/png" \
    -T LINE/image/richmenu-pairs.png
    ```

4. リッチメニューのエイリアスを作成
    ```bash
    curl -v -X POST https://api.line.me/v2/bot/richmenu/alias \
    -H 'Authorization: Bearer {ここに channel access token}' \
    -H 'Content-Type: application/json' \
    -d \
    '{
        "richMenuAliasId": "richmenu-alias-pairs-v4",
        "richMenuId": "richmenu-xxxxxxx"
    }'
    ```

6. 終了！！！！！
