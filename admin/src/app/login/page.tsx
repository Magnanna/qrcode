import Link from "next/link";
import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
            <span className="text-xl">◎</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Gatekeeper</h1>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage the event</p>
        </div>

        {message && (
          <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-center text-sm text-green-700">
            {message}
          </p>
        )}

        <form action={signIn} className="space-y-4">
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
              autoComplete="current-password"
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
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-neutral-500">
          No account?{" "}
          <Link href="/signup" className="font-medium text-black">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
