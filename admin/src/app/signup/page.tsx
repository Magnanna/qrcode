import Link from "next/link";
import { signUp } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
            <span className="text-xl">◎</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-neutral-500">An admin must grant access after signup</p>
        </div>

        <form action={signUp} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full name
            </label>
            <input
              name="name"
              type="text"
              required
              className="input rounded-xl w-full text-[15px] py-3"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input rounded-xl w-full text-[15px] py-3"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input rounded-xl w-full text-[15px] py-3"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-neutral rounded-xl w-full text-[15px]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-neutral-500">
          Already have access?{" "}
          <Link href="/login" className="font-medium text-black">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
