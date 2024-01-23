# Chapter 22 データの変更

## Server Actionsとは?
- データベースのデータを変更するためのAPIエンドポイントの作成の必要性を排除
- 「データベースのデータを変更する非同期関数」を作成し、それをクライアント/サーバーコンポーネントから呼び出す形で動作
- セキュリティが頑丈（Server Actionsが作られた理由）
    - 様々な攻撃から守る
    - authorized accessの保証
- 以下の技術を使用
    - POSTリクエスト
    - 暗号化されたクロージャ
    - 入力を厳しくチェック
    - エラーメッセージハンドリング
    - ホスト制限

### キャッシュの操作
- データベースの操作後、「revalidatePath」・「revalidateTag」等のAPIを使用してキャッシュを操作できる。


## Server Actionsの使用

### Server Action ①: invoiceの作成
#### 1. invoice作成用routeを作成
#### 2. Server Action(非同期関数)の作成
```ts
'use server';
 
export async function createInvoice(formData: FormData) {}
```
#### 3. formDataからデータを抽出
- formData.get()を使用
- tips: 
#### 4. データの検証（型チェック）
- 型チェックライブラリ「Zod」を使用

#### 5. データベースにデータを追加

#### 6. Revalidate and redirect
- 速度向上のために[Client-side Route Cache](https://nextjs.org/docs/app/building-your-application/caching#router-cache)が使用されていた。データベースの更新とともにこのキャッシュも変更する必要がある。

#### 最初のServer Actionが作れた！


### Server Action ②: invoiceの更新
- ①と基本同じだが、今回はformDataに加えてidも渡す必要有。

memo: UUID vs. Auto-incrementating Keys

### Server Action ③: invoiceの削除



## まとめ
- 新しいデータベースの操作方法「Server Action」の登場
    - 従来: APIエンドポイントを使用したPOST
    - nextjs: Server Action（非同期関数）を定義し、それを呼び出す
- Server Actionはセキュリティが頑丈 & キャッシュの更新もできる。

- Server Actionを使用して、invoiceの作成・更新・削除を実装した。


