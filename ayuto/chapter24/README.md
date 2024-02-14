# アクセシビリティの向上

### 扱う内容
- linterを使用して、ベストプラクティスに従う
- サーバー側でバリテーション
- クライアント側でバリテーション(React のフックを使用)

なぜ、クライアント、サーバーの両方でバリテーションする必要があるのか？

### リンターを使ってベストプラクティスに従う
- linterとは
コーディング規約などの一定の規約にしたがっているかチェックしてくれる

Next.js eslintのプラグイン`eslint-plugin-jsx-a11y`を使用すると，altやroleの指定などをチェックしてくれる。

```
npm run lint
```
でリンターを走らせてコードを確認してもらう。
リンターにはいろいろある
- black(python)
- rubocop(ruby)
- eslint(ts)
- テキストリンター
各言語ごとに用意されている。

### サーバー側でのバリテーション
サーバー側のバーリテーションはDBに変なデータが入らないようにするためにする。
`userFromState`フックを使う。

create-form.tsx
```tsx
'use client';
 
// ...
import { useFormState } from 'react-dom';
export default function Form({ customers }: { customers: CustomerField[] }) {
    const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createInvoice, initialState);
 
  return <form action={dispatch}>...</form>;
}
```

action.ts
```tsx
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

### クライアント側でのバリテーション
このチュートリアルでは、下のような感じでhtmlの機能で実現していたが、
```tsx
<input
  id="amount"
  name="amount"
  type="number"
  placeholder="Enter USD amount"
  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
  required
/>
```
クライアントコンポーネントの中でTSのコードで正規表現を書くなりしてバリテーションするでも良いはず。

- クライアントでバリテーションする必要性
アクセシビリティ向上
- サーバーでバリテーションする必要性
セキュリティ、バグらせないためなど