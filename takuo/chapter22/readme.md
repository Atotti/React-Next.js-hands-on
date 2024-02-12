# chapter22 (Next/12)
## データの変更
Invoiceの作成，更新，削除が出来るようにします．
- Reactサーバーアクションとは何か，およびその使いかた
- フォームとサーバーコンポーネントの操作方法
- 型検証を含む，ネイティブ`formData`オブジェクトの使いかた
- `revalidatePath`APIを使用してクライアントのキャッシュを再検証する方法
- 特定のIDを持つ動的ルートセグメントを作成する方法

### サーバーアクションとは？
React Server Actionsを使用すると，サーバー上で非同期コードを直接実行できます．データ変更のためにAPIエンドポイントを作成する必要がなくなり，クライアントやサーバーコンポーネントから呼び出す「非同期関数」を用意すればよいです．

セキュリティの面でも優秀で，React Server Actionsは様々な攻撃からの保護と認証されたアクセスを保証します．セキュリティーの安全性はPOSTリクエスト，クロージャーの暗号化，厳格な入力チェック，エラーメッセージのハッシュ化，ホスト制限等により実現されています．

### サーバーアクションでFormを作る
Reactでは，`<foam>`elementの`action`属性を利用してactionsを呼び出せます．こんなかんじ．
```ts
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```
#### invoiceの作成
ながれは次のよう．
1. ユーザー入力を取得するフォームを作成する
2. Server Actionを作成し，フォームから実行する
3. `formData`オブジェクトからデータを抽出する
4. 値の検証
5. データのDBへの挿入とエラー処理
6. キャッシュの再検証と，ユーザーのリダイレクト

##### 1. ユーザー入力を取得するフォームを作成する
`app/dashboard/invoices/create/page.tsx`を作成し，次のようにします．
```tsx
import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
```
このページは`customers`を取得して，`<Form>`にそれを渡すサーバーコンポーネントです．`<Form>`コンポーネントはすでに実装されています（ありがとう）．

##### 2. Server Actionを作成し，フォームから実行する
Formの入力が完了したら呼ばれるServer Actionの作成をします．

`app/lib/actions.ts`を作成し，次のようにします．
```tsx
'use server';
 
export async function createInvoice(formData: FormData) {}
```

`'use server'`を書くことで，このファイルで宣言する関数は全てサーバーで実行される関数になります．サーバー関数はクライアントコンポーネントとサーバーコンポーネントのどちらにもimportでき，便利です．
> Server Componentで関数の中に`use server`を直接書いてサーバーアクションをかけますが，このコースでは別ファイルに切り分けることとします．

次に，`createInvoice()`をimportし，`<Form>`elementの`action`属性に指定します．
```diff tsx
    import { customerField } from '@/app/lib/definitions';
    import Link from 'next/link';
    import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    } from '@heroicons/react/24/outline';
    import { Button } from '@/app/ui/button';
+   import { createInvoice } from '@/app/lib/actions';
    
    export default function Form({
    customers,
    }: {
    customers: customerField[];
    }) {
    return (
+       <form action={createInvoice}>
        // ...
    )
```
##### 3. `formData`オブジェクトからデータを抽出する
`app/lib/actions.ts/createInvoice()`を次のようにします．
```tsx
'use server';
 
export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Test it out:
  console.log(rawFormData);
}
```
`FormData`の`get(name)`メソッドを使い，データを抽出します．
> logはこんな感じ．
> {
>   customerId: '13d07535-c59e-4157-a011-f8d2ef4e0cbb',
>   amount: '123',
>   status: 'pending'
> }
##### 4. 値の検証
入力されたデータの形式が正しくないといけません．ので，確認します．
`/app/lib/definitions.ts`から，次のような型の定義になっていることが確認できます．
```tsx
export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};
```
フォームから入力されるのは`customer_id`, `amount`, `status`なので，とりあえずこれを検証します．
> データの型は，たとえば`console.log(typeof rawFormData.amount);`のように確認できます．この場合は`string`で，`number`ではない．

直接検証してもいいですが，型検証ライブラリを使うと楽です．`app/lib/actions.ts`でZodをインポートし，スキーマを定義します．定義したスキーマに沿って，`formData`のデータ型を検証します．
```diff tsx
'use server';
 
+import { z } from 'zod'; // import Zod
 
// create schema
+const FormSchema = z.object({
+  id: z.string(),
+  customerId: z.string(),
+  amount: z.coerce.number(),
+  status: z.enum(['pending', 'paid']),
+  date: z.string(),
+});
 
+const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
+   const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
+ const amountInCents = amount * 100;
+ const date = new Date().toISOString().split('T')[0];
}
```
このようにすると，`amount`フィールドの型を文字列から数値に強制的に変換できます．`createInvoice()`では，formDataの値を実際に検証しています．

ついでに，金額をセント単位に変換（小数点エラーを回避して精度を高めるためらしい，ほんとに？）し，請求書の作成日時を記録しておきます．

##### 5. データのDBへの挿入とエラー処理
データの準備ができたので，クエリを書いてDBに流し込みます．エラー処理とかは後の章で．
```diff tsx
import { z } from 'zod';
+import { sql } from '@vercel/postgres';
 
// ...
 
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
+  await sql`
+    INSERT INTO invoices (customer_id, amount, status, date)
+    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
+  `;
}
```
##### 6. キャッシュの再検証と，ユーザーのリダイレクト
データベースが更新されたので，クライアント側のキャッシュを更新したいです．サーバーに対して新規にアクションを行うのは，`revalidatePath`関数を使用して実現できます．`redirect`関数を使えばリダイレクトすることもできます．
```diff tsx
'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
+import { revalidatePath } from 'next/cache';
+import { redirect } from 'next/navigation';
 
// ...
 
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
 
+  revalidatePath('/dashboard/invoices');
+  redirect('/dashboard/invoices');
}
```
データベースが更新されたら，`revalidatePath()`で`'/dashboard/invoices'`パスが再検証され，新しいデータがサーバーから取得されます．また，`redirect()`で，`'/dashboard/invoices'`にリダイレクトされます．

送信時にリダイレクトされ，作成した請求書が表示されるはずです．

#### invoiceの更新
更新は，新規作成と処理は似ていますが，修正対象の請求書`id`を知る必要があります．したがって，次のような手順で実現します．
1. 請求書の`id`に基づく動的ルートセグメントを作成
2. ページパラメータから`id`を取得
3. その請求書の情報をDBから取得
4. フォームに変更前の情報を事前に入力
5. 請求書データをアップデート

##### 1. 請求書の`id`に基づく動的ルートセグメントを作成
Next.jsでは，データに基づいて動的にルートを作成したい場合に，動的ルートセグメントを作成できます．`[id]`のように，フォルダ名を角括弧で囲むことで実現できます．今回は，`app/dashboard/invoices/[id]/edit/page.tsx`を作成し，ルートを構成します．

ここで実装がどうなっているか確認すると，`/app/ui/invoices/table.tsx`では，`<UpdataInvoice>`ボタンが請求書の`id`を受け取っていることが分かります．
```diff tsx
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return (
    // ...
    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
+     <UpdateInvoice id={invoice.id} />
      <DeleteInvoice id={invoice.id} />
    </td>
    // ...
  );
}
```
`<UpdataInvoice>`コンポーネントの実装に移動し，`href`を`id`プロップを受け入れるように変更します．
```diff tsx
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
 
// ...
 
export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
+      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
```
##### 2. ページパラメータから`id`を取得
`/app/dashboard/invoices/[id]/edit/page.tsx`に戻り，次のようにします．
```tsx
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
```
大体`/create`ページと似てますが，編集フォームでは`defaultValue`として事前に顧客名とか金額とかを事前入力するようになっています．この情報の取得には`id`を使ってデータをフェッチすればよいです．
##### 3. 4. その請求書の情報をDBから取得，フォームに事前入力
`fetchInvoiceById`関数と`fetchCustomers`関数をインポートし，`Promise.all`で並列にこれらを実行します．
```diff tsx
import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
+import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
+  const [invoice, customers] = await Promise.all([
+    fetchInvoiceById(id),
+    fetchCustomers(),
+  ]);
  // ...
}
```
`http://localhost:3000/dashboard/invoices`にアクセスし，鉛筆のマークをクリックすると，編集画面に移動します．このとき，URLパスは請求書固有のIDになっていて，その内容がフォームに事前入力されています．
##### 5. 請求書データをアップデート
最後に，請求書の`id`をServer Actionに渡して，DBのレコードを更新します．これには，JavaScriptの`bind`を使います．これを用いることで，Server Actionに渡される値はエンコードされたものとなります．
`/app/ui/invoices/edit-form.tsx`につぎのような変更をすればよいです．
```diff tsx
// ...
+import { updateInvoice } from '@/app/lib/actions';
 
export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
+  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
 
  return (
+    <form action={updateInvoiceWithId}>
      <input type="hidden" name="id" value={invoice.id} />
    </form>
  );
}
```
また，現時点では`updateInvoice`関数が無いので，作成します．`/app/lib/actions.ts`に次の定義を追記します．
```tsx
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```
`createInvoice`アクションと内容は似ていますが，大まかには次のようなことをしています．
1. `formData`からデータを取得します
2. Zodで型の検証を行います
3. 金額をセントに変換します
4. SQLクエリを作成し，レコードをUPDATEします
5. `revalitadePath`でページを再検証します
6. `redirect`します

#### invoiceの削除
編集したり，追加したりすることがあれば，削除することがあってもいいですよね．削除したい請求書の`id`を取得してServer Actionに渡し，DELETEクエリをたたけばいいです．

`/app/ui/invoices/buttons.tsx`
```diff tsx
+import { deleteInvoice } from '@/app/lib/actions';
 
// ...
 
+export function DeleteInvoice({ id }: { id: string }) {
+  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
 
  return (
+    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
+    </form>
  );
}
```
`/app/lib/actions.ts`
```tsx
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
```