# chapter23 (Next/13th)
## エラーハンドリング
前のチャプターでは，サーバーアクションを使用してデータを変更する方法を学びました．ここではJavaScriptの`try/catch`構文やNext.jsのAPIを使用してエラーを適切に処理する方法を学びます．

- `error.tsx`を使用してrouteセグメント内のエラーを取得し，代わりにフォールバックUIを表示します．
- `notFound`関数の使い方と，404エラーを処理するための`not-found`ファイル

### サーバーアクションに`try/catch`を追加する
エラーの処理を適切に処理するために，JavaScriptの`try/catch`構文をサーバーアクションに追加します．

<details>
/app/lib/actions.ts

```tsx
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

```tsx
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

```tsx
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
```

</details>

ここで注目すべきなのは，`redirect`が`try/catch`の外で呼ばれていることです．これは`redirect`がerrorを発出するためで，`try`句の中で`redirect`するとそれが`catch`されてしまいます．そのため，`try/catch`の後で`redirect`することで，`try`句の処理が成功した場合に`redirect`が実行されるようになります．

### `error.tsx`でエラーを処理する
`error.tsx`はrouteセグメントのUI境界を定義するために使用できます．これは**予期しないエラー**に対するハンドリングとして機能し，ユーザーにフォールバックUIを表示します．
`/dashboard/invoices/error.tsx`を作成し，次のようにします．

```tsx
'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
```
`error.tsx`について，
- `error.tsx`はクライアントコンポーネントである必要があります(`"use client"`)．
- 2つのpropsをとります
  - `error`: JavaScriptのErrorオブジェクトのインスタンス
  - `reset`: エラー境界をリセットするための関数で，実行するとrouteセグメントの再レンダリングを試みます．

### `notFound`関数で404エラーを処理する
`notFound`関数を使用することでもエラーハンドリングが可能です．`error.tsx`は**全ての**エラーを補足するのに便利ですが，`notFound`は存在しないリソースを取得しようとするときにも使用できます．

たとえば，存在しないUUIDの請求書を編集しようとすると
- http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit 

`error.tsx`のエラーが表示されます(error.tsxの子要素なので)．

ただ，もっとエラーを具体的にしたい場合は，404エラーを表示して，アクセスしようとしているリソースが見つからなかったことをユーザに示すことができます．見つからなかったことを確認するには，`data.ts`の`fetchInvoiceById`関数にて，`invoice`をログ出力するようにします．

```diff tsx
  export async function fetchInvoiceById(id: string) {
    noStore();
    try {
      // ...
  
+     console.log(invoice); // Invoice is an empty array []
      return invoice[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch invoice.');
    }
  }
```
invoiceの返り値が空だった時は`notFound`関数を呼び出すようにします．

`/dashboard/invoices/[id]/edit/page.tsx`
```diff tsx
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
+import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
 
+  if (!invoice) {
+    notFound();
+  }
 
  // ...
}
```
このようにすれば，`/dashboard/invoices/[id]/edit`ルートで，請求書が存在しないエラーに遭遇した場合は`notFound()`を呼び出し，特別なエラー処理を記述できます．

エラー処理の内容は`/dashboard/invoices/[id]/edit/not-found.tsx`に記述します．
```tsx
import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
 
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
```