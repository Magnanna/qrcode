import Link from "next/link";
import { signUp } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 dark:bg-black">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
            <span className="text-xl">◎</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-neutral-500">An admin must grant access after signup</p>
        </div>

        <form action={signUp} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Full name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-900"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3 text-[15px] font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-neutral-500">
          Already have access?{" "}
          <Link href="/login" className="font-medium text-black dark:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
